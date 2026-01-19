import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { todosTable, todoImagesTable } from "@/server/db/schema/todos";
import { emailClient } from "@/server/email";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { UPLOAD_CONFIG } from "@/config";
import { generatePresignedUploadUrl } from "@/server/s3";
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

  generatePresignedUrl: publicProcedure
    .input(
      z.object({
        todoId: z.number(),
        filename: z.string(),
        fileSize: z.number(),
        contentType: z.enum(UPLOAD_CONFIG.ALLOWED_MIME_TYPES),
        width: z.number(),
        height: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .select({ id: todosTable.id })
        .from(todosTable)
        .where(eq(todosTable.id, input.todoId))
        .limit(1);

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      if (input.fileSize > UPLOAD_CONFIG.MAX_IMAGE_SIZE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `File size exceeds maximum of ${UPLOAD_CONFIG.MAX_IMAGE_SIZE / 1024 / 1024}MB`,
        });
      }

      const result = await generatePresignedUploadUrl({
        filename: input.filename,
        contentType: input.contentType,
        fileSize: input.fileSize,
      });

      return result;
    }),

  attachImageToTodo: publicProcedure
    .input(
      z.object({
        todoId: z.number(),
        filePath: z.string(),
        filename: z.string(),
        fileSize: z.number(),
        contentType: z.string(),
        width: z.number(),
        height: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [image] = await ctx.db
        .insert(todoImagesTable)
        .values({
          todoId: input.todoId,
          filename: input.filename,
          filePath: input.filePath,
          fileSize: input.fileSize,
          contentType: input.contentType,
          width: input.width,
          height: input.height,
        })
        .returning();

      return image;
    }),
});
