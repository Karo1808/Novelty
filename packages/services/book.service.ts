import {
  MAX_RESULTS_BASIC_SEARCH,
  MAX_RESULTS_DETAILED_SEARCH,
} from "@novelty/lib/config";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { captureException } from "@novelty/lib/sentry";
import { MarkKeysAsPartial } from "@novelty/lib/types";
import {
  BasicSearchResultSchema,
  DetailSearchResult,
  DetailSearchResultSchema,
  GetBookResult,
  getBookResultSchema,
  type BasicSearchResult,
} from "@novelty/lib/validations/book";
import ky, { HTTPError } from "ky";
import { ServiceDependencies } from "types";
import { ZodError } from "zod";
import { GOOGLE_BOOK_API_URL } from "./lib/config";
import { apiQueryDurationHistogram } from "./lib/metrics";
import type { ErrorResponse, Result } from "./types";

const apiKey = process.env.GOOGLE_BOOKS_API_KEY ?? "";

const googleBooksApiBase = ky.create({
  prefixUrl: GOOGLE_BOOK_API_URL,
  retry: 2,
  searchParams: {
    key: apiKey!,
  },
});

type Dependencies = MarkKeysAsPartial<
  ServiceDependencies,
  ["dbInstance", "redisClient"]
>;

interface ApiParams {
  dependencies: Dependencies;
  queryName: string;
  endpointPath: string;
  query: string;
}

const timers = new WeakMap<
  Request,
  ReturnType<ReturnType<typeof apiQueryDurationHistogram>["startTimer"]>
>();

const getApi = ({
  dependencies,
  queryName,
  endpointPath,
  query,
}: ApiParams) => {
  const { prometheusRegistry, reqId, logger } = dependencies;
  const histogram = apiQueryDurationHistogram(prometheusRegistry);

  return googleBooksApiBase.extend({
    headers: { "x-request-id": dependencies.reqId },
    hooks: {
      beforeRequest: [
        (request) => {
          const end = histogram.startTimer({ queryName });
          timers.set(request, end);
        },
      ],
      afterResponse: [
        (request, _options, response) => {
          timers.get(request)?.({
            status: "success",
            http_status: String(response.status),
          });
          timers.delete(request);
        },
      ],
      beforeError: [
        (error) => {
          const req = (error as any).request as Request | undefined;
          const res = (error as any).response as Response | undefined;

          timers.get(req!)?.({
            status: "failure",
            http_status: String(res?.status ?? 0),
          });
          if (req) {
            timers.delete(req);
          }

          logger.error({
            message: "Request failed",
            source: queryName,
            error: (error as Error).message,
            stackTrace: (error as Error)?.stack,
            reqId,
          });

          captureException({
            error: error as Error,
            tags: [{ name: "requestId", value: reqId }],
            breadcrumb: {
              category: "external api query",
              message: (error as Error).message,
              level: "error",
            },
            contextName: queryName,
            context: {
              queryName,
              endpointPath,
              query,
            },
          });

          return error;
        },
      ],
    },
  });
};

export const GetBook = async (
  dependencies: Dependencies,
  id: string,
): Promise<Result<GetBookResult, BasicSearchError>> => {
  const queryName = "getBook";
  const endpoint = "volumes";

  const api = getApi({
    dependencies,
    queryName,
    endpointPath: endpoint,
    query: id,
  });

  try {
    const json = await api
      .get(`volumes/${id}`, {
        searchParams: {
          fields:
            "id,volumeInfo(title,authors,averageRating,publishedDate,description,pageCount,imageLinks(thumbnail))",
        },
      })
      .json<BasicSearchResult>();

    try {
      const results = getBookResultSchema.parse(json);
      return {
        data: results,
        success: true,
      };
    } catch (error) {
      const parsedError = error as ZodError;
      return {
        success: false,
        error: {
          message: parsedError.message,
          kind: "BAD_GATEWAY",
        },
      };
    }
  } catch (error) {
    const httpError = error as HTTPError;
    const status = httpError.response.status;
    const statusText = httpError.response.statusText;
    const message = httpError.message;

    if (status === HttpStatusCodes.GATEWAY_TIMEOUT) {
      return {
        success: false,
        error: {
          message,
          kind: statusText as "GATEWAY_TIMEOUT",
        },
      };
    }

    if (status === HttpStatusCodes.SERVICE_UNAVAILABLE) {
      return {
        success: false,
        error: {
          message,
          kind: statusText as "SERVICE_UNAVAILABLE",
        },
      };
    }

    throw error;
  }
};

export type BasicSearchError =
  | ErrorResponse<"SERVICE_UNAVAILABLE">
  | ErrorResponse<"GATEWAY_TIMEOUT">
  | ErrorResponse<"BAD_GATEWAY">;

export const basicSearch = async (
  dependencies: Dependencies,
  query: string,
): Promise<Result<BasicSearchResult, BasicSearchError>> => {
  const queryName = "basicSearch";
  const endpoint = "volumes";

  const api = getApi({
    dependencies,
    queryName,
    endpointPath: endpoint,
    query,
  });

  try {
    const json = await api
      .get("volumes", {
        searchParams: {
          q: query,
          maxResults: MAX_RESULTS_BASIC_SEARCH,
          projection: "lite",
          fields:
            "items(id,volumeInfo(title,authors,averageRating,imageLinks(thumbnail)))",
        },
      })
      .json<BasicSearchResult>();

    try {
      const results = BasicSearchResultSchema.parse(json);
      return {
        data: results,
        success: true,
      };
    } catch (error) {
      const parsedError = error as ZodError;
      return {
        success: false,
        error: {
          message: parsedError.message,
          kind: "BAD_GATEWAY",
        },
      };
    }
  } catch (error) {
    const httpError = error as HTTPError;
    const status = httpError.response.status;
    const statusText = httpError.response.statusText;
    const message = httpError.message;

    if (status === HttpStatusCodes.GATEWAY_TIMEOUT) {
      return {
        success: false,
        error: {
          message,
          kind: statusText as "GATEWAY_TIMEOUT",
        },
      };
    }

    if (status === HttpStatusCodes.SERVICE_UNAVAILABLE) {
      return {
        success: false,
        error: {
          message,
          kind: statusText as "SERVICE_UNAVAILABLE",
        },
      };
    }

    throw error;
  }
};

export const detailedSearch = async (
  dependencies: Dependencies,
  query: string,
): Promise<Result<DetailSearchResult, BasicSearchError>> => {
  const queryName = "detailedSearch";
  const endpoint = "volumes";

  const api = getApi({
    dependencies,
    queryName,
    endpointPath: endpoint,
    query,
  });

  try {
    const json = await api
      .get("volumes", {
        searchParams: {
          q: query,
          maxResults: MAX_RESULTS_DETAILED_SEARCH,
          fields:
            "items(id,volumeInfo(title,authors,averageRating,publishedDate,description,pageCount,imageLinks(thumbnail)))",
        },
      })
      .json<BasicSearchResult>();

    try {
      const results = DetailSearchResultSchema.parse(json);
      return {
        data: results,
        success: true,
      };
    } catch (error) {
      const parsedError = error as ZodError;
      return {
        success: false,
        error: {
          message: parsedError.message,
          kind: "BAD_GATEWAY",
        },
      };
    }
  } catch (error) {
    const httpError = error as HTTPError;
    const status = httpError.response.status;
    const statusText = httpError.response.statusText;
    const message = httpError.message;

    if (status === HttpStatusCodes.GATEWAY_TIMEOUT) {
      return {
        success: false,
        error: {
          message,
          kind: statusText as "GATEWAY_TIMEOUT",
        },
      };
    }

    if (status === HttpStatusCodes.SERVICE_UNAVAILABLE) {
      return {
        success: false,
        error: {
          message,
          kind: statusText as "SERVICE_UNAVAILABLE",
        },
      };
    }

    throw error;
  }
};
