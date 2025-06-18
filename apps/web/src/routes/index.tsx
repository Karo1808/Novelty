import { healthcheckQuery } from "@novelty/react-query/modules/healthcheck/healthcheck.query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(healthcheckQuery);
  },
});

function Home() {
  const { data } = useSuspenseQuery(healthcheckQuery);

  return <div>{JSON.stringify(data)}</div>;
}
