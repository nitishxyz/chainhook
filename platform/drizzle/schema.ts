import { pgTable, foreignKey, varchar, text, jsonb, timestamp, integer, unique, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const indexSubscriptions = pgTable("index_subscriptions", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	userId: varchar("user_id").notNull(),
	connectionId: varchar("connection_id").notNull(),
	indexTypeId: varchar("index_type_id").notNull(),
	status: varchar().default('active'),
	targetSchema: varchar("target_schema").default('public'),
	targetTable: varchar("target_table").notNull(),
	addresses: text().array().default([""]).notNull(),
	filterCriteria: jsonb("filter_criteria"),
	lastIndexedAt: timestamp("last_indexed_at", { mode: 'string' }),
	lastError: text("last_error"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	indexCount: integer("index_count").default(0),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "index_subscriptions_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.connectionId],
			foreignColumns: [databaseConnections.id],
			name: "index_subscriptions_connection_id_database_connections_id_fk"
		}),
	foreignKey({
			columns: [table.indexTypeId],
			foreignColumns: [indexTypes.id],
			name: "index_subscriptions_index_type_id_index_types_id_fk"
		}),
]);

export const webhookEvents = pgTable("webhook_events", {
	id: varchar().primaryKey().notNull(),
	signature: varchar(),
	webhookId: varchar("webhook_id").notNull(),
	eventType: varchar("event_type").notNull(),
	payload: jsonb().notNull(),
	processed: boolean().default(false),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	errorCount: integer("error_count").default(0),
	lastError: text("last_error"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("webhook_events_signature_unique").on(table.signature),
]);

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	username: varchar().notNull(),
	email: varchar().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const databaseConnections = pgTable("database_connections", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	name: varchar().notNull(),
	host: varchar().notNull(),
	port: integer().default(5432).notNull(),
	username: varchar().notNull(),
	password: text().notNull(),
	database: varchar().notNull(),
	sslMode: varchar("ssl_mode").default('require'),
	status: varchar().default('pending'),
	lastConnectedAt: timestamp("last_connected_at", { mode: 'string' }),
	lastError: text("last_error"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "database_connections_user_id_users_id_fk"
		}),
]);

export const indexTypes = pgTable("index_types", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("index_types_name_unique").on(table.name),
]);

export const schemaTemplates = pgTable("schema_templates", {
	id: varchar().primaryKey().notNull(),
	indexTypeId: varchar("index_type_id").notNull(),
	schemaVersion: varchar("schema_version").notNull(),
	creationSql: text("creation_sql").notNull(),
	indexesSql: text("indexes_sql").array().default([""]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.indexTypeId],
			foreignColumns: [indexTypes.id],
			name: "schema_templates_index_type_id_index_types_id_fk"
		}),
]);
