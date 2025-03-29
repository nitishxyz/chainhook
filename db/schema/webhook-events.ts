import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const webhookEvents = pgTable("webhook_events", {
  id: varchar("id").primaryKey().notNull(),
  signature: varchar("signature").unique(),
  webhookId: varchar("webhook_id").notNull(),
  eventType: varchar("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  errorCount: integer("error_count").default(0),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
