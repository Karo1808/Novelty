import { testClient } from "hono/testing";
import { insertUserSchema, usersTable } from "@novelty/db/schemas/user.schema";
import { Pool, type Pool as TPool } from "pg";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer } from "@testcontainers/redis";
import type { StartedRedisContainer } from "@testcontainers/redis";
import env from "@/env";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { authRouter } from "../auth.index";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import * as schema from "@novelty/db/schemas/index.schema";
import path from "node:path";
import { eq } from "drizzle-orm";
import createErrorSchema from "@/lib/create-error-schema";
import type { z } from "zod";
import * as queries from "@novelty/db/queries/auth.query";
import * as authServices from "@novelty/services/auth.service";
import { DatabaseConnectionError } from "@novelty/db/lib/errors";

vi.mock("@hono/node-server/conninfo", () => ({
  getConnInfo: vi.fn(() => ({
    remote: {
      address: "127.0.0.1",
    },
  })),
}));

let dbClient: any;

vi.mock("@novelty/db/index", () => ({
  get db() {
    return dbClient;
  },
}));

let redis: any;

vi.mock("@novelty/redis/index", () => ({
  get redis() {
    return redis;
  },
}));

vi.mock("@/middleware/rate-limit.ts", () => ({
  mainLimiter: vi.fn(),
}));

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", authRouter));

describe("auth routes", () => {
  let pgContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedRedisContainer;
  let pool: TPool;

  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();

    redisContainer = await new RedisContainer().start();

    pool = new Pool({
      connectionString: pgContainer.getConnectionUri(),
    });

    dbClient = drizzle({ client: pool, schema });
    const migrationsFolder = path.resolve(
      __dirname,
      "../../../../../../packages/db/migrations",
    );
    await migrate(dbClient, {
      migrationsFolder,
    });
  });

  afterAll(async () => {
    await pool.end();
    await pgContainer.stop();
    await redisContainer.stop();
    vi.clearAllMocks();
  });

  describe("post /register", () => {
    const dummyBody: InsertUser["register"] = {
      email: "email@mail.com",
      password: "password123",
    };

    afterEach(async () => {
      await dbClient
        .delete(usersTable)
        .where(eq(usersTable.email, dummyBody.email));
      vi.clearAllMocks();
    });

    it("handles success", async () => {
      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.CREATED);

      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/registration success/i),
        user: {
          id: expect.stringMatching(/^[\w-]{21}$/),
          email: expect.stringMatching(dummyBody.email),
          isEmailVerified: false,
          createdAt: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ),
          updatedAt: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ),
        },
      });
    });

    it("returns conflict if email already exists", async () => {
      await dbClient.insert(usersTable).values({
        email: dummyBody.email,
        password: "somehashedpassword",
      });

      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/already exists/i),
      });
    });

    it("returns bad request if request body is invalid", async () => {
      const invalidBody = { email: "newuser", password: "password" };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(insertUserSchema.shape.register);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth.register.$post({
        json: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("returns service unavailable if database connection fails", async () => {
      vi.spyOn(queries, "getUserByEmailQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("returns internal server error on unexpected error", async () => {
      vi.spyOn(authServices, "registerUser").mockImplementationOnce(() => {
        throw new Error("Unexpected error");
      });

      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });
});
