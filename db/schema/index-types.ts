import { pgTable, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schemaTemplates } from "./schema-templates";
import { indexSubscriptions } from "./index-subscriptions";

export const indexTypes = pgTable("index_types", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const indexTypesRelations = relations(indexTypes, ({ many }) => ({
  schemaTemplates: many(schemaTemplates),
  indexSubscriptions: many(indexSubscriptions),
}));
