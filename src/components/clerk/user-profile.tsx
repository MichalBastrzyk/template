"use client";

import * as React from "react";
import {
  User,
  Shield,
  CreditCard,
  Mail,
  Smartphone,
  Plus,
  MoreVertical,
  Check,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tab = "profile" | "security" | "billing";

interface UserProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTab?: Tab;
}

// Mock Connectable Providers (Icons would usually be SVGs)
const GoogleIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    className="mr-2 h-4 w-4"
    fill="currentColor"
  >
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

export function UserProfile({
  className,
  initialTab = "profile",
  ...props
}: UserProfileProps) {
  const [activeTab, setActiveTab] = React.useState<Tab>(initialTab);
  const [isEditingName, setIsEditingName] = React.useState(false);

  // Demo State
  const [name, setName] = React.useState("Cameron Walker");

  return (
    <div
      className={cn(
        "flex h-[700px] w-full max-w-5xl overflow-hidden rounded-xl border bg-card shadow-sm",
        className,
      )}
      {...props}
    >
      {/* Sidebar */}
      <aside className="flex w-[280px] flex-col border-r bg-muted/10 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account info.
          </p>
        </div>

        <nav className="space-y-1">
          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "profile" && "bg-muted font-medium",
            )}
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button
            variant={activeTab === "security" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "security" && "bg-muted font-medium",
            )}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button
            variant={activeTab === "billing" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "billing" && "bg-muted font-medium",
            )}
            onClick={() => setActiveTab("billing")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </nav>

        <div className="mt-auto flex items-center gap-2 border-t pt-6">
          <span className="text-xs text-muted-foreground">
            Secured by{" "}
            <span className="font-semibold text-foreground/80">clerk</span>
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-2xl space-y-8 p-10">
          {activeTab === "profile" && (
            <>
              <h1 className="text-2xl font-bold text-foreground">
                Profile details
              </h1>
              <Separator />

              {/* Profile Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-6">
                  <h3 className="w-1/3 text-sm font-medium">Profile</h3>
                  <div className="flex flex-1 items-center gap-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      {isEditingName ? (
                        <div className="flex max-w-xs items-center gap-2">
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setIsEditingName(false)}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      ) : (
                        <p className="font-medium text-foreground">{name}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                      onClick={() => setIsEditingName(!isEditingName)}
                    >
                      Update profile
                    </Button>
                  </div>
                </div>

                {/* Email Section */}
                <div className="flex items-start justify-between border-b pb-6">
                  <h3 className="w-1/3 pt-1 text-sm font-medium">
                    Email addresses
                  </h3>
                  <div className="flex-1 space-y-4">
                    <div className="group flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">example@personal.com</span>
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground"
                        >
                          Primary
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add email address
                    </Button>
                  </div>
                </div>

                {/* Phone Section */}
                <div className="flex items-start justify-between border-b pb-6">
                  <h3 className="w-1/3 pt-1 text-sm font-medium">
                    Phone number
                  </h3>
                  <div className="flex-1 space-y-4">
                    <div className="group flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">+1 (555) 123-4567</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add phone number
                    </Button>
                  </div>
                </div>

                {/* Connected Accounts */}
                <div className="flex items-start justify-between pb-6">
                  <h3 className="w-1/3 pt-1 text-sm font-medium">
                    Connected accounts
                  </h3>
                  <div className="flex-1 space-y-4">
                    <div className="group flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GoogleIcon />
                        <span className="text-sm">Google</span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          · example@gmail.com
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Connect account
                    </Button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "security" && (
            <div>
              <h1 className="mb-6 text-2xl font-bold">Security</h1>
              <p className="text-muted-foreground">
                Security settings placeholder.
              </p>
            </div>
          )}

          {activeTab === "billing" && (
            <div>
              <h1 className="mb-6 text-2xl font-bold">Billing</h1>
              <p className="text-muted-foreground">
                Billing settings placeholder.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
