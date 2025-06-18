export class QueryExecutionError extends Error {
  constructor(
    public queryName: string,
    originalError?: Error,
  ) {
    super(
      `Error in database query "${queryName}": ${originalError?.message ?? ""}`,
    );
    this.name = "QueryExecutionError";
    this.stack = originalError?.stack ?? "";
  }
}

export class DatabaseConnectionError extends Error {
  private status: number;
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = "DatabaseConnectionError";
    this.status = 503;
  }
}

export class QueryTimeoutError extends Error {
  constructor(timeoutDuration: number) {
    super(`Query timed out after ${timeoutDuration} ms`);
    this.name = "QueryTimeoutError";
  }
}
