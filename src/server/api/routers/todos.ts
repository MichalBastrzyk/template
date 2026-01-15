import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { todosTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const todosRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(todosTable);
  }),
  create: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [newTodo] = await ctx.db
        .insert(todosTable)
        .values({ title: input.title })
        .returning();
      return newTodo;
    }),

  setStatus: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const [updatedTodo] = await ctx.db
        .update(todosTable)
        .set({ completed: input.completed })
        .where(eq(todosTable.id, input.id))
        .returning();
      return updatedTodo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(todosTable).where(eq(todosTable.id, input.id));
    }),
});
