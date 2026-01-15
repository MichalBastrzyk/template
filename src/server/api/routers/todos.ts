import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { todosTable } from "@/server/db/schema";
import { emailClient } from "@/server/email";
import { eq } from "drizzle-orm";
import { z } from "zod";
import TodosEmail from "../../../../emails/todos-email";

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

  emailTodos: publicProcedure
    .input(
      z.object({
        email: z.email(),
        senderName: z.string().optional(),
        recipientName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todos = await ctx.db.select().from(todosTable);

      const todoItems = todos.map((todo) => ({
        title: todo.title,
        completed: todo.completed,
      }));

      emailClient.sendEmail({
        to: input.email,
        subject: `${input.senderName ?? "Someone"} shared a list with you`,
        reactEmailTemplate: TodosEmail({
          senderName: input.senderName,
          recipientName: input.recipientName,
          todos: todoItems,
        }),
      });
    }),
});
