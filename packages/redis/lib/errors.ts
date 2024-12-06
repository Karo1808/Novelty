export class RedisConnectionError extends Error {
  constructor(
    message: string = "Error connecting to Redis",
    public originalError?: Error,
  ) {
    super(message);
    this.name = "RedisConnectionError";
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class RedisQueryError extends Error {
  constructor(
    public queryName: string,
    originalError: Error,
  ) {
    super(
      `Error executing Redis command "${queryName}" ,${originalError.message}`,
    );
    this.name = "RedisQueryError";
    this.stack = originalError.stack;
  }
}

export class RedisTimeoutError extends Error {
  constructor(timeoutDuration: number) {
    super(`Redis operation timed out after ${timeoutDuration} ms`);
    this.name = "RedisTimeoutError";
  }
}
