// src/db/schema/users.ts
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { databaseConnections } from "./database-connections";
import { indexSubscriptions } from "./index-subscriptions";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  databaseConnections: many(databaseConnections),
  indexSubscriptions: many(indexSubscriptions),
}));
