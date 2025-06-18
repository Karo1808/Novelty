import { logger } from "../lib/logger";

export const redisConfig = {
  host: "localhost",
  port: 6380,
  retryStrategy(times: number) {
    if (times % 4 === 0) {
      logger.error({
        message: "redisRetryError",
        error: "Redis reconnect exhausted after 3 retries.",
      });
      return null;
    }

    return 200;
  },
};
