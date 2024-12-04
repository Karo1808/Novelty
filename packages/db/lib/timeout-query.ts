import type { Logger } from "@novelty/lib/types";
import { QueryTimeoutError } from "./errors";

export const timeoutQuery = <T>(
  query: Promise<T>,
  timeoutDuration: number,
  logger?: Logger,
  queryName = "unnamed query",
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new QueryTimeoutError(timeoutDuration);
      if (logger) {
        logger.warn({
          message: `Query timed out`,
          queryName,
          timeoutDuration,
        });
      }
      reject(error);
    }, timeoutDuration);

    query
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};
