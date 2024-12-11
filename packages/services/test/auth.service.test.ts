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
import type { DBClient } from "@novelty/db/lib/types";
import { configureLogger } from "@novelty/lib/logger";
import { Pool } from "pg";
import { Registry } from "prom-client";
import type { Pool as TPool } from "pg";
import path from "node:path";
import * as schema from "@novelty/db/schemas/index.schema";
import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { registerUser } from "auth.service";
import type { ServiceDependencies } from "types";
import type { Redis } from "ioredis";
import * as queries from "@novelty/db/queries/auth.query";
import * as authUtils from "../lib/auth";
import { verify } from "@node-rs/argon2";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { eq, sql } from "drizzle-orm";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import {
  DatabaseConnectionError,
  QueryExecutionError,
} from "@novelty/db/lib/errors";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("auth service", () => {
  let container: StartedPostgreSqlContainer;
  let pool: TPool;
  let dbClient: DBClient;
  let dependencies: ServiceDependencies;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();
    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });
    dbClient = drizzle({ client: pool, schema });
    const migrationsFolder = path.resolve(__dirname, "../../db/migrations");
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
      redisClient: {} as unknown as Redis,
    };
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    const dummyBody: InsertUser["register"] = {
      email: "email@mail.com",
      password: "password123",
    };

    afterEach(async () => {
      vi.restoreAllMocks();
      await dbClient.execute(sql`TRUNCATE table users CASCADE`);
    });

    it("should handle successful signup", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(queries, "getUserByEmailQuery");
      const createUserQuerySpy = vi.spyOn(queries, "createUserQuery");
      const hashPasswordSpy = vi.spyOn(authUtils, "hashPassword");

      const result = await registerUser(dependencies, dummyBody);

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(getUserByEmailQuerySpy).toHaveResolvedWith(undefined);
      expect(hashPasswordSpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).toHaveBeenCalledWith(dummyBody.password);
      expect(createUserQuerySpy).toHaveBeenCalledOnce();
      expect(result).toHaveProperty("status", HttpStatusCodes.CREATED);
      expect(result.body).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyBody.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const user = await dbClient.query.usersTable.findFirst({
        where: eq(usersTable.email, dummyBody.email),
      });
      expect(new Date(user!.createdAt).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(new Date(user!.updatedAt).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(user).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyBody.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Verify password hashing
      expect(await verify(user!.password, dummyBody.password)).toBe(true);
    });

    it("should handle email already existing", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(queries, "getUserByEmailQuery");
      const createUserQuerySpy = vi.spyOn(queries, "createUserQuery");
      const hashPasswordSpy = vi.spyOn(authUtils, "hashPassword");

      await dbClient.insert(usersTable).values({
        email: dummyBody.email,
        password: dummyBody.password,
      });

      const result = await registerUser(dependencies, dummyBody);
      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).not.toHaveBeenCalled();
      expect(createUserQuerySpy).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        status: HttpStatusCodes.CONFLICT,
      });

      const users = await dbClient.query.usersTable.findMany({
        where: eq(usersTable.email, dummyBody.email),
      });
      expect(users).toHaveLength(1);
    });

    it("should handle no user returned upon creation", async () => {
      const createUserQuerySpy = vi.spyOn(queries, "createUserQuery");
      createUserQuerySpy.mockImplementationOnce(() => Promise.resolve([]));

      await expect(registerUser(dependencies, dummyBody)).rejects.toThrow(
        QueryExecutionError,
      );
    });

    it("should handle database connection error", async () => {
      const dbClientSpy = vi
        .spyOn(dependencies.dbInstance, "execute")
        .mockImplementation(() => {
          throw new DatabaseConnectionError("Database connection failed");
        });

      await expect(registerUser(dependencies, dummyBody)).rejects.toThrow(
        DatabaseConnectionError,
      );
      dbClientSpy.mockRestore();
    });

    it("should handle invalid data from getUserByEmailQuery", async () => {
      vi.spyOn(queries, "getUserByEmailQuery").mockResolvedValue(
        "unexpected-data" as any,
      );

      await expect(registerUser(dependencies, dummyBody)).rejects.toThrow(
        QueryExecutionError,
      );
    });

    it("should handle unexpected exceptions", async () => {
      vi.spyOn(authUtils, "hashPassword").mockImplementation(() => {
        throw new Error("Unexpected Error");
      });

      await expect(registerUser(dependencies, dummyBody)).rejects.toThrow(
        Error,
      );
    });

    it.each([
      ["first parallel call", dummyBody],
      ["second parallel call", dummyBody],
    ])(
      "should handle race conditions for duplicate user creation (%s)",
      async (_, body) => {
        vi.spyOn(queries, "getUserByEmailQuery").mockResolvedValue(undefined);
        const [result1, result2] = await Promise.all([
          registerUser(dependencies, body),
          registerUser(dependencies, body),
        ]);

        // One of these should have succeeded and the other should return CONFLICT
        const statuses = [result1.status, result2.status];
        expect(statuses).toContain(HttpStatusCodes.CONFLICT);
        expect(statuses).toContain(HttpStatusCodes.CREATED);
      },
    );
  });
});
