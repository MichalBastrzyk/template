import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import * as TanstackQuery from "@/trpc/query-client";

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    Wrap: ({ children }) =>
      TanstackQuery.Provider({ queryClient: rqContext.queryClient, children }),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
