export class EnqueuingError extends Error {
  constructor(
    public jobName: string,
    originalError?: Error,
  ) {
    super(`Error enqueuing job "${jobName}": ${originalError?.message ?? ""}`);
    this.name = "Job";
    this.stack = originalError?.stack ?? "";
  }
}
