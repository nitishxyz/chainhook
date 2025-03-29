import {
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { indexSubscriptions } from "./index-subscriptions";

export const databaseConnections = pgTable("database_connections", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name").notNull(),
  host: varchar("host").notNull(),
  port: integer("port").notNull().default(5432),
  username: varchar("username").notNull(),
  password: text("password").notNull(), // Will be encrypted
  database: varchar("database").notNull(),
  sslMode: varchar("ssl_mode").default("require"),
  status: varchar("status", { enum: ["pending", "active", "error"] }).default(
    "pending"
  ),
  lastConnectedAt: timestamp("last_connected_at"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const databaseConnectionsRelations = relations(
  databaseConnections,
  ({ one, many }) => ({
    user: one(users, {
      fields: [databaseConnections.userId],
      references: [users.id],
    }),
    indexSubscriptions: many(indexSubscriptions),
  })
);
