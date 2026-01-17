import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "@/env";
import * as todosSchema from "./schema/todos";
import * as authSchema from "./schema/auth";

const schema = {
  ...todosSchema,
  ...authSchema,
};

const client = postgres(env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, {
  schema,
  logger: true,
  casing: "snake_case",
});
