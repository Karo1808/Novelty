/* eslint-disable import/no-mutable-exports */
import type { DBClient } from "@novelty/db/lib/types";
import type { ServiceDependencies } from "@novelty/services/types";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { ConnectionOptions, Queue } from "bullmq";
import type { Redis as TRedis } from "ioredis";
import type { Pool as TPool } from "pg";
import type { StartedTestContainer } from "testcontainers";
import path from "node:path";
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import * as schema from "@novelty/db/schemas/index.schema";
import { configureLogger } from "@novelty/lib/logger";
import { createQueue } from "@novelty/message-queue/lib/create-queue";
import { createTestWorker } from "@novelty/message-queue/lib/create-test-worker";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Redis } from "ioredis";
import { Pool } from "pg";
import { Registry } from "prom-client";
import Redlock from "redlock";
import { GenericContainer } from "testcontainers";
import { afterAll, beforeAll, vi } from "vitest";
import env from "./env";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let dbContainer: StartedPostgreSqlContainer;
let redisContainer: StartedTestContainer;
let s3Container: StartedTestContainer;
let pool: TPool;
let testDb: DBClient;
let testRedis: TRedis;
let testQueue: Queue;
let testS3: S3Client;
let testDependencies: ServiceDependencies;
let testRedlock: Redlock;
let originalConsoleError: any;

beforeAll(async () => {
  dbContainer = await new PostgreSqlContainer()
    .withStartupTimeout(12000)
    .start();

  redisContainer = await new GenericContainer("redis/redis-stack-server:latest")
    .withExposedPorts(6379)
    .start();

  testRedis = new Redis({
    maxRetriesPerRequest: null,
    host: redisContainer.getHost(),
    port: redisContainer.getMappedPort(6379),
    enableReadyCheck: false,
    enableOfflineQueue: true,
  });

  // oxlint-disable-next-line no-console
  originalConsoleError = console.error;

  // oxlint-disable-next-line no-console
  console.error = (...args) => {
    const message = args.join(" ");
    if (message.includes("ECONNREFUSED") || message.includes("ENOTFOUND")) {
      return;
    }
    originalConsoleError(...args);
  };

  testRedis.on("error", () => {});

  const connectionOptions: ConnectionOptions = testRedis;

  const redisClients = [testRedis];
  testRedlock = new Redlock(redisClients);

  const queueName = "email-queue";
  const jobProcessors: Record<string, (data: any) => Promise<void>> = {
    "send-verification-email": async () => {},
    "send-forgot-password-email": async () => {},
  };

  testQueue = createQueue(queueName, connectionOptions);

  testQueue.on("error", () => {});

  createTestWorker(queueName, jobProcessors, testRedis);

  pool = new Pool({
    connectionString: dbContainer.getConnectionUri(),
  });

  testDb = drizzle({ client: pool, schema });

  const migrationsFolder = path.resolve(
    __dirname,
    "../../../packages/db/migrations",
  );
  await migrate(testDb, {
    migrationsFolder,
  });

  s3Container = await new GenericContainer("scireum/s3-ninja:latest")
    .withExposedPorts(9000)
    .start();

  testS3 = new S3Client({
    endpoint: `http://${s3Container.getHost()}:${s3Container.getMappedPort(9000)}`,
    region: "auto",
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  await testS3.send(new CreateBucketCommand({ Bucket: env.R2_BUCKET_NAME }));

  const logger = configureLogger({
    nodeEnvironment: "test",
    hostUrl: "",
    labels: {},
    logLevel: "info",
  });

  testDependencies = {
    dbInstance: testDb,
    logger,
    reqId: "test-req-id",
    prometheusRegistry: new Registry(),
    redisClient: testRedis,
    s3Client: testS3,
    redlockClient: testRedlock,
  };
});

afterAll(async () => {
  await pool.end();
  await redisContainer.stop();
  await dbContainer.stop();
  await s3Container?.stop();
  vi.clearAllMocks();
});

export { testDb, testDependencies, testQueue, testRedis, testRedlock, testS3 };
