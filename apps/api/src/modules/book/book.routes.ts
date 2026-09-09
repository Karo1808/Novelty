import { jsonContent, jsonContentRequired } from "@/lib/json-content";
import {
  externalRateLimitSchema,
  malformedResponseSchema,
} from "@/lib/response-schemas";
import { serviceUnavailableSchema } from "@/lib/service-unavailable-schema";
import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import {
  basicSearchQuerySchema,
  basicSearchSuccessSchema,
  detailedSearchSuccessSchema,
  getBookParams,
  getBookSuccessSchema,
} from "./book.validations";

const tags = ["Book"];
const searchTags = [...tags, "Search"];

export const getBookRoute = createRoute({
  tags,
  method: "get",
  path: "/books/:id",
  description: "Gets book information based on ID",
  request: {
    params: getBookParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContentRequired(
      getBookSuccessSchema,
      "Book data",
    ),
    [HttpStatusCodes.BAD_GATEWAY]: jsonContent(
      malformedResponseSchema,
      "Malformed response from external API",
    ),
    [HttpStatusCodes.GATEWAY_TIMEOUT]: jsonContent(
      externalRateLimitSchema,
      "Rate limit on external API reached",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Service unavailable",
    ),
    // [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
    //   tooManyRequestsSchema,
    //   "Rate limiter"
    // ),
  },
});

export type GetBookRoute = typeof getBookRoute;

export const basicSearchRoute = createRoute({
  tags: searchTags,
  method: "get",
  path: "/books/search/basic",
  description:
    "Searches for books using a query and retrieves basic information",
  request: {
    query: basicSearchQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContentRequired(
      basicSearchSuccessSchema,
      "Book data",
    ),
    [HttpStatusCodes.BAD_GATEWAY]: jsonContent(
      malformedResponseSchema,
      "Malformed response from external API",
    ),
    [HttpStatusCodes.GATEWAY_TIMEOUT]: jsonContent(
      externalRateLimitSchema,
      "Rate limit on external API reached",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Service unavailable",
    ),
    // [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
    //   tooManyRequestsSchema,
    //   "Rate limiter"
    // ),
  },
});

export type BasicSearchRoute = typeof basicSearchRoute;

export const detailedSearchRoute = createRoute({
  tags: searchTags,
  method: "get",
  path: "/books/search/detailed",
  description:
    "Searches for books using a query and retrieves in depth information",
  request: {
    query: basicSearchQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContentRequired(
      detailedSearchSuccessSchema,
      "Book data",
    ),
    [HttpStatusCodes.BAD_GATEWAY]: jsonContent(
      malformedResponseSchema,
      "Malformed response from external API",
    ),
    [HttpStatusCodes.GATEWAY_TIMEOUT]: jsonContent(
      externalRateLimitSchema,
      "Rate limit on external API reached",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Service unavailable",
    ),
    // [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
    //   tooManyRequestsSchema,
    //   "Rate limiter"
    // ),
  },
});

export type DetailedSearchRoute = typeof detailedSearchRoute;
