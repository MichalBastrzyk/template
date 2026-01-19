import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { todoImagesTable } from "./todo-images";

export const todosTable = pgTable("todos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
});

export { todoImagesTable };
