import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  staticData: { authRequired: true },
  beforeLoad: ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/auth/sign-in",
        search: { redirect: location.href },
      });
    }

    if (!context.user?.emailVerified) {
      throw redirect({
        to: "/auth/verify-email",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
