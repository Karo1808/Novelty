import { connectToDB } from "@novelty/db/connect";
import logger from "@/lib/logger";
import { captureException } from "./sentry";

class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public originalError: Error,
  ) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

// eslint-disable-next-line import/no-mutable-exports
let dbClient;

async function initializeDbClient() {
  try {
    dbClient = await connectToDB({
      databaseUrl: undefined,
    });
  }
  catch (error) {
    logger.error({
      message: "Failed to establish database connection",
      source: "lib/db",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });

    captureException({
      error: error as Error,
      breadcrumb: {
        category: "database connection",
        message: "Failed to establish database connection",
        level: "error",
      },
    });

    throw new DatabaseConnectionError(
      "An error occurred while trying to establish a connection to the database",
      error as Error,
    );
  }
}

await initializeDbClient();
export default dbClient;
