import { todosRouter } from "@/server/api/routers/todos";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  todo: todosRouter,
});

export type AppRouter = typeof appRouter;
