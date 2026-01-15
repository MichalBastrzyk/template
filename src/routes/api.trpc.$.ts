import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createTRPCContext(),
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
