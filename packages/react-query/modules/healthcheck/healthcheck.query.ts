import { queryOptions } from "@tanstack/react-query";
import { getHealthcheck } from "./healthcheck.api";

export const healthcheckQuery = queryOptions({
  queryKey: ["healthcheck"],
  queryFn: getHealthcheck,
});
