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
import { drizzle } from "drizzle-orm/node-postgres";
import {
  createUserQuery,
  getIsEmailVerifiedQuery,
  getUserByEmailQuery,
} from "../auth.query";
import type { DBClient, Dependencies } from "../../lib/types";
import { configureLogger } from "@novelty/lib/logger";
import { Pool } from "pg";
import { Registry } from "prom-client";
import type { Pool as TPool } from "pg";
import path from "node:path";
import * as schema from "../../schemas/index.schema";
import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { usersTable } from "../../schemas/user.schema";
import { eq } from "drizzle-orm";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("auth queries", () => {
  let container: StartedPostgreSqlContainer;
  let pool: TPool;
  let dbClient: DBClient;
  let dependencies: Dependencies;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();

    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });

    dbClient = drizzle({ client: pool, schema });

    const migrationsFolder = path.resolve(__dirname, "../../migrations");

    await migrate(dbClient, {
      migrationsFolder,
    });

    const logger = configureLogger({
      nodeEnvironment: "test",
      hostUrl: "",
      labels: {},
      logLevel: "info",
    });

    dependencies = {
      dbInstance: dbClient,
      logger,
      reqId: "test-req-id",
      prometheusRegistry: new Registry(),
    };
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
    vi.clearAllMocks();
  });

  describe("getUserByEmailQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
    };

    it("should find and returns the user by email", async () => {
      const startTime = Date.now();

      await dbClient.insert(usersTable).values(dummyUser);

      const result = await getUserByEmailQuery(
        {
          ...dependencies,
          dbInstance: dbClient,
        },
        dummyUser.email,
      );

      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyUser.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result).not.toHaveProperty("password");

      const endTime = Date.now();
      expect(new Date(result!.createdAt).getTime()).toBeGreaterThanOrEqual(
        startTime,
      );
      expect(new Date(result!.updatedAt).getTime()).toBeLessThanOrEqual(
        endTime,
      );

      await dbClient
        .delete(usersTable)
        .where(eq(usersTable.email, dummyUser.email));
    });

    it("should return undefined when user does not exist", async () => {
      const res = await getUserByEmailQuery(dependencies, dummyUser.email);

      expect(res).toBeUndefined();
    });
  });

  describe("createUser", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
    };

    afterEach(async () => {
      await dbClient
        .delete(usersTable)
        .where(eq(usersTable.email, dummyUser.email));
    });

    it("should create user if they don't exist", async () => {
      const startTime = Date.now();

      const [result] = await createUserQuery(dependencies, dummyUser);

      const endTime = Date.now();

      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyUser.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(new Date(result!.createdAt).getTime()).toBeGreaterThanOrEqual(
        startTime,
      );
      expect(new Date(result!.updatedAt).getTime()).toBeLessThanOrEqual(
        endTime,
      );
    });

    it("should throw error if the user already exists", async () => {
      await dbClient.insert(usersTable).values(dummyUser);

      await expect(
        createUserQuery(dependencies, dummyUser),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          "duplicate key value violates unique constraint",
        ),
        name: "QueryExecutionError",
      });
    });
  });

  describe("getIsEmailVerifiedQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
    };

    it("should return the isEmailVerified column value", async () => {
      await dbClient.insert(usersTable).values(dummyUser);

      const result = await getIsEmailVerifiedQuery(
        {
          ...dependencies,
          dbInstance: dbClient,
        },
        dummyUser.email,
      );

      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        isEmailVerified: false,
      });
      expect(result).not.toHaveProperty("password");

      await dbClient
        .delete(usersTable)
        .where(eq(usersTable.email, dummyUser.email));
    });

    it("should return undefined when user does not exist", async () => {
      const res = await getIsEmailVerifiedQuery(dependencies, dummyUser.email);

      expect(res).toBeUndefined();
    });
  });
});
