import { getUserFn } from "@/server/user.functions";
import { userQuery } from "@novelty/react-query/modules/user/user.query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/protected")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: userQuery.userKey,
      queryFn: getUserFn,
    });
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: userQuery.userKey,
    queryFn: getUserFn,
  });
  return <div>{JSON.stringify(data)}</div>;
}
