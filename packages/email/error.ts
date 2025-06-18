export class EmailDeliveryError extends Error {
  constructor(
    public serviceName: string,
    originalError?: Error,
  ) {
    super(
      `Error sending email in "${serviceName}": ${originalError?.message ?? ""}`,
    );
    this.name = "ServiceName";
    this.stack = originalError?.stack ?? "";
  }
}
