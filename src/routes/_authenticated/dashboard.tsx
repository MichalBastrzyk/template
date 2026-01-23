import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserButton } from "@/components/clerk/user-button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/auth/sign-in" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <UserButton />
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription>You're logged in as {user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Name</dt>
                <dd>{user?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Verified</dt>
                <dd>{user?.emailVerified ? "Yes" : "No"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">User ID</dt>
                <dd className="max-w-[200px] truncate font-mono text-xs">
                  {user?.id}
                </dd>
              </div>
            </dl>
            <Button onClick={handleSignOut} className="mt-6 w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
