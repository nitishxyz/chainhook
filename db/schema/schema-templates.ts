import { pgTable, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { indexTypes } from "./index-types";

export const schemaTemplates = pgTable("schema_templates", {
  id: varchar("id").primaryKey().notNull(),
  indexTypeId: varchar("index_type_id")
    .notNull()
    .references(() => indexTypes.id),
  schemaVersion: varchar("schema_version").notNull(),
  creationSql: text("creation_sql").notNull(),
  indexesSql: text("indexes_sql").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const schemaTemplatesRelations = relations(
  schemaTemplates,
  ({ one }) => ({
    indexType: one(indexTypes, {
      fields: [schemaTemplates.indexTypeId],
      references: [indexTypes.id],
    }),
  })
);
