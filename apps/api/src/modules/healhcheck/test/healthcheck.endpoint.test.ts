import { testClient } from "hono/testing";
import { Pool, type Pool as TPool } from "pg";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import env from "@/env";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@/lib/http-status-codes";
import { healthcheckRouter } from "../healthcheck.index";
import { drizzle } from "drizzle-orm/node-postgres";

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

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", healthcheckRouter));

describe("healthcheck routes", () => {
  let container: any;
  let pool: TPool;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();
    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
    vi.clearAllMocks();
  });

  it("get /healthcheck handles service available", async () => {
    dbClient = drizzle({ client: pool });

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.OK);

    const json = await response.json();
    expect(json.status).toMatch(/healthy/i);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("connected");
  });

  it("get /healthcheck handles database unavailable", async () => {
    dbClient = drizzle({ client: "" as unknown as TPool });

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("disconnected");
  });
});
