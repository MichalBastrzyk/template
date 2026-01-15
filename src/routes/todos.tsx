import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useIsFetching,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CheckCircle2Icon, ListTodoIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/todos")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.todo.list.queryOptions(),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const todoQueryOptions = trpc.todo.list.queryOptions();

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    ...todoQueryOptions,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const queryKey = todoQueryOptions.queryKey;
  const isFetching = useIsFetching({ queryKey }) > 0;
  const isMutating = useIsMutating({ mutationKey: trpc.todo.pathKey() }) > 0;

  const [title, setTitle] = React.useState("");

  const list = React.useMemo(() => {
    return [...todos].sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return bDate - aDate;
    });
  }, [todos]);

  const createMutation = useMutation({
    ...trpc.todo.create.mutationOptions(),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<typeof todos>(queryKey) ?? [];
      const optimisticId = Date.now() * -1;
      const optimisticTodo = {
        id: optimisticId,
        title: input.title,
        completed: false,
        createdAt: new Date(),
      };
      queryClient.setQueryData<typeof todos>(queryKey, [
        ...previous,
        optimisticTodo,
      ]);
      setTitle("");
      return { previous, optimisticId };
    },
    onError: (_error, _input, context) => {
      const previous = context as { previous?: typeof todos } | undefined;
      if (previous?.previous) {
        queryClient.setQueryData(queryKey, previous.previous);
      }
    },
    onSuccess: (data, _input, context) => {
      const optimisticContext = context as
        | { previous?: typeof todos; optimisticId?: number }
        | undefined;
      queryClient.setQueryData<typeof todos>(queryKey, (current = []) => {
        const replaced = current.map((todo) =>
          todo.id === optimisticContext?.optimisticId ? data : todo,
        );
        const exists = replaced.some((todo) => todo.id === data.id);
        return exists ? replaced : [...replaced, data];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const statusMutation = useMutation({
    ...trpc.todo.setStatus.mutationOptions(),
    onMutate: async (input, context) => {
      await context.client.cancelQueries({
        queryKey,
      });

      context.client.setQueryData(queryKey, (current = []) =>
        current.map((todo) =>
          todo.id === input.id ? { ...todo, completed: input.completed } : todo,
        ),
      );

      return undefined;
    },
    onError: (_error, _input, context) => {
      const previous = context as { previous?: typeof todos } | undefined;
      if (previous?.previous) {
        queryClient.setQueryData(queryKey, previous.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    ...trpc.todo.delete.mutationOptions(),
    mutationKey: ["todos", "delete"],
    onMutate: async (input) => {
      queryClient.setQueryData(queryKey, (current = []) =>
        current.filter((todo) => todo.id !== input.id),
      );
      return undefined;
    },
    onError: (_error, _input, context) => {
      const previous = context as { previous?: typeof todos } | undefined;
      if (previous?.previous) {
        queryClient.setQueryData(queryKey, previous.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const remaining = list.filter((todo) => !todo.completed).length;
  const completed = list.length - remaining;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) return;

    createMutation.mutate({ title: trimmed });
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Todos
        </span>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Minimal, fast, and optimistic
            </h1>
            <p className="text-sm text-muted-foreground">
              {remaining} open · {completed} done
            </p>
          </div>
          <div
            className={cn(
              "flex translate-y-0 items-center gap-2 text-xs text-muted-foreground opacity-0 transition-all duration-100",
              (isFetching || isMutating) && "-translate-y-2.5 opacity-100",
            )}
          >
            <Spinner className="size-3" />
            Syncing
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-foreground/5">
          <CardTitle>New todo</CardTitle>
          <CardDescription>Keep it short and specific.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Write a clear next step..."
                aria-label="Todo title"
              />
              <p className="text-xs text-muted-foreground">
                Press enter to add instantly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit">Add todo</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setTitle("")}
                disabled={!title}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your list</CardTitle>
          <CardDescription>
            Tap a checkbox to toggle status instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-lg border border-border/60" />
              <Skeleton className="h-14 w-full rounded-lg border border-border/60" />
              <Skeleton className="h-14 w-full rounded-lg border border-border/60" />
            </div>
          ) : isError ? (
            <div className="text-sm text-destructive">
              Failed to load todos. Refresh to try again.
            </div>
          ) : list.length === 0 ? (
            <Empty className="border-foreground/10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListTodoIcon />
                </EmptyMedia>
                <EmptyTitle>No todos yet</EmptyTitle>
                <EmptyDescription>
                  Add your first task and keep momentum.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {list.map((todo) => {
                const createdLabel = new Date(
                  todo.createdAt,
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <li
                    key={todo.id}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-2 transition hover:border-border/60 hover:bg-muted/40"
                  >
                    <label className="flex flex-1 items-start gap-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={(value) =>
                          statusMutation.mutate({
                            id: todo.id,
                            completed: Boolean(value),
                          })
                        }
                      />
                      <span className="flex flex-1 flex-col gap-1">
                        <span
                          className={
                            "text-sm font-medium transition" +
                            (todo.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground")
                          }
                        >
                          {todo.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {todo.completed ? "Completed" : "Created"} ·{" "}
                          {createdLabel}
                        </span>
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {todo.completed && (
                        <CheckCircle2Icon className="size-4 text-primary" />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteMutation.mutate({ id: todo.id })}
                        aria-label="Delete todo"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground">
          <span>{list.length} total</span>
          <span>
            {statusMutation.isPending || deleteMutation.isPending
              ? "Updating"
              : "All changes saved"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
