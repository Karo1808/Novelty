import type { Logger } from "./types";

interface TimeoutQueryParams<T, U extends Error> {
  query: Promise<T>;
  timeoutDuration: number;
  customError: U;
  logger?: Logger;
  queryName: string;
}

export const timeoutQuery = <T, U extends Error>({
  query,
  timeoutDuration,
  customError,
  logger,
  queryName = "unknown_query",
}: TimeoutQueryParams<T, U>): Promise<T> => {
  if (!query || typeof query.then !== "function") {
    throw new TypeError("Provided query is not a promise");
  }

  if (typeof timeoutDuration !== "number" || timeoutDuration <= 0) {
    throw new TypeError("timeoutDuration must be a positive number");
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (logger) {
        logger.warn({
          message: `Query timed out`,
          queryName,
          timeoutDuration,
          error: customError,
        });
      }
      reject(customError);
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
