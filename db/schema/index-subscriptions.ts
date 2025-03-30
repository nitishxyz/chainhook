import {
  pgTable,
  timestamp,
  varchar,
  text,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { databaseConnections } from "./database-connections";
import { indexTypes } from "./index-types";

export const indexSubscriptions = pgTable("index_subscriptions", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  connectionId: varchar("connection_id")
    .notNull()
    .references(() => databaseConnections.id),
  indexTypeId: varchar("index_type_id")
    .notNull()
    .references(() => indexTypes.id),
  status: varchar("status", { enum: ["active", "paused", "error"] }).default(
    "active"
  ),
  targetSchema: varchar("target_schema").default("public"),
  targetTable: varchar("target_table").notNull(),
  addresses: text("addresses").array().notNull().default([]),
  filterCriteria: jsonb("filter_criteria"),
  lastIndexedAt: timestamp("last_indexed_at"),
  indexCount: integer("index_count").default(0),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const indexSubscriptionsRelations = relations(
  indexSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [indexSubscriptions.userId],
      references: [users.id],
    }),
    connection: one(databaseConnections, {
      fields: [indexSubscriptions.connectionId],
      references: [databaseConnections.id],
    }),
    indexType: one(indexTypes, {
      fields: [indexSubscriptions.indexTypeId],
      references: [indexTypes.id],
    }),
  })
);
