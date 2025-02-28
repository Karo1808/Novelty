/* eslint-disable import/no-mutable-exports */
import path from "node:path";
import * as schema from "@novelty/db/schemas/index.schema";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { afterAll, beforeAll, vi } from "vitest";
import { Pool } from "pg";
import type { Pool as TPool } from "pg";
import type { DBClient } from "@novelty/db/lib/types";
import { drizzle } from "drizzle-orm/node-postgres";
import { Redis } from "ioredis";
import type { Redis as TRedis } from "ioredis";
import type { StartedRedisContainer } from "@testcontainers/redis";
import { RedisContainer } from "@testcontainers/redis";
import { createQueue } from "@novelty/message-queue/lib/create-queue";
import type { Queue } from "bullmq";
import { createWorker } from "@novelty/message-queue/lib/create-worker";
import type { ServiceDependencies } from "@novelty/services/types";
import { Registry } from "prom-client";
import { configureLogger } from "@novelty/lib/logger";
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";
import env from "./env";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let dbContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;
let s3Container: StartedTestContainer;
let pool: TPool;
let testDb: DBClient;
let testRedis: TRedis;
let testQueue: Queue;
let testS3: S3Client;
let testDependencies: ServiceDependencies;

beforeAll(async () => {
  dbContainer = await new PostgreSqlContainer()
    .withStartupTimeout(12000)
    .start();

  redisContainer = await new RedisContainer().start();

  testRedis = new Redis(redisContainer.getConnectionUrl());

  const connectionOptions = {
    host: redisContainer.getHost(),
    port: redisContainer.getPort(),
  };

  const queueName = "email-queue";
  const jobProcessors: Record<string, (data: any) => Promise<void>> = {
    "send-verification-email": async () => {},
  };

  testQueue = createQueue(queueName, connectionOptions);

  createWorker(queueName, jobProcessors, connectionOptions);

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
  };
});

afterAll(async () => {
  await pool.end();
  await redisContainer.stop();
  await dbContainer.stop();
  await s3Container?.stop();
  vi.clearAllMocks();
});

export { testDb, testDependencies, testQueue, testRedis, testS3 };
