/* eslint-disable node/no-process-env */
/* eslint-disable import/no-mutable-exports */
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import type { DBClient } from "@novelty/db/lib/types";
import * as schema from "@novelty/db/schemas/index.schema";
import { configureLogger } from "@novelty/lib/logger";
import { createQueue } from "@novelty/message-queue/lib/create-queue";
import { createWorker } from "@novelty/message-queue/lib/create-worker";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { Queue } from "bullmq";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import type { Redis as TRedis } from "ioredis";
import { Redis } from "ioredis";
import path from "node:path";
import type { Pool as TPool } from "pg";
import { Pool } from "pg";
import { Registry } from "prom-client";
import Redlock from "redlock";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";
import type { ServiceDependencies } from "types";
import { afterAll, beforeAll, vi } from "vitest";

if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let dbContainer: StartedPostgreSqlContainer;
let redisContainer: StartedTestContainer;
let s3Container: StartedTestContainer;
let testS3: S3Client;
let pool: TPool;
let testDb: DBClient;
let testRedis: TRedis;
let testDependencies: ServiceDependencies;
let testDependenciesWithQueue: Required<Omit<ServiceDependencies, "providers">>;
let testQueue: Queue;
let testRedlock: Redlock;

beforeAll(async () => {
  dbContainer = await new PostgreSqlContainer()
    .withStartupTimeout(12000)
    .start();

  redisContainer = await new GenericContainer("redis/redis-stack-server:latest")
    .withExposedPorts(6379)
    .start();

  testRedis = new Redis({
    host: redisContainer.getHost(),
    port: redisContainer.getMappedPort(6379),
  });

  testRedis.on("error", () => {});

  const connectionOptions = {
    host: redisContainer.getHost(),
    port: redisContainer.getMappedPort(6379),
  };

  const redisClients = [testRedis];

  // @ts-expect-error
  testRedlock = new Redlock(redisClients);

  const queueName = "email-queue";
  const jobProcessors: Record<string, (data: any) => Promise<void>> = {
    "send-verification-email": async () => {},
    "send-forgot-password-email": async () => {},
  };

  testQueue = createQueue(queueName, connectionOptions);

  testQueue.on("error", () => {});

  createWorker(queueName, jobProcessors, connectionOptions);

  pool = new Pool({
    connectionString: dbContainer.getConnectionUri(),
  });

  testDb = drizzle({ client: pool, schema });

  const migrationsFolder = path.resolve(__dirname, "../db/migrations");

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
      accessKeyId: process.env.R2_ACCESS_KEY!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });

  await testS3.send(
    new CreateBucketCommand({ Bucket: process.env.R2_BUCKET_NAME }),
  );

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
    redlockClient: testRedlock,
    s3Client: testS3,
    bucketName: process.env.R2_BUCKET_NAME!,
  };

  testDependenciesWithQueue = {
    dbInstance: testDb,
    logger,
    reqId: "test-req-id",
    prometheusRegistry: new Registry(),
    redisClient: testRedis,
    redlockClient: testRedlock,
    messageQueueInstance: testQueue,
    s3Client: testS3,
    bucketName: process.env.R2_BUCKET_NAME!,
  };
});

afterAll(async () => {
  await pool.end();
  await redisContainer.stop();
  await dbContainer.stop();
  await s3Container?.stop();
  vi.clearAllMocks();
});

export {
  testDb,
  testDependencies,
  testDependenciesWithQueue,
  testQueue,
  testRedis,
  testRedlock,
  testS3,
};
