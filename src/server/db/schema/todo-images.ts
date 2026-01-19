import {
  bigint,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { todosTable } from "./todos";

export const todoImagesTable = pgTable("todo_images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todoId: integer()
    .notNull()
    .references(() => todosTable.id, { onDelete: "cascade" }),
  filename: varchar({ length: 255 }).notNull(),
  filePath: varchar({ length: 500 }).notNull(),
  fileSize: bigint({ mode: "number" }).notNull(),
  contentType: varchar({ length: 100 }).notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});