import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import type { QueryClient } from "@tanstack/react-query";

import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/api/root";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth as bauth } from "@/server/auth";

import appCss from "../styles/app.css?url";
import { authClient } from "@/lib/auth-client";

interface MyRouterContext {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
}

const getSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();
    const auth = await bauth.api.getSession({
      headers,
    });

    return auth;
  })
  .client(async () => {
    const auth = authClient.useSession.get();

    if (!auth.isPending || (!auth.isRefetching && auth.data)) return auth.data;
  });

// const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
//   const headers = getRequestHeaders();
//   const auth = await bauth.api.getSession({
//     headers,
//   });

//   return auth;
// });

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const auth = await getSession();

    return {
      isAuthenticated: Boolean(auth?.user),
      user: auth?.user,
      session: auth?.session,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
