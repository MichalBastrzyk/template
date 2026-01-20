import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-out")({
  beforeLoad: async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    throw redirect({
      to: "/auth/sign-in",
    });
  },
});
