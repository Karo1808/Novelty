import { queryOptions } from "@tanstack/react-query";

export const draftQuery = {
  draftKey: () => ["draft"],
  draftUserOpts: () =>
    queryOptions({
      queryKey: [...draftQuery.draftKey(), "user"],
      staleTime: 0,
      refetchInterval: 0,
      gcTime: 0,
      refetchOnMount: "always",
    }),
};
