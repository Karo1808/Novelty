import { queryOptions } from "@tanstack/react-query";

export const userQuery = {
  userKey: ["user"],
  userOpts: () =>
    queryOptions({
      queryKey: [...userQuery.userKey],
    }),
};
