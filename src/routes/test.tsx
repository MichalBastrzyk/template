import { useTRPC } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/test")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.post.hello.queryOptions({ name: "World" }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.post.hello.queryOptions({ name: "World" }));

  return <div>{data}</div>;
}
