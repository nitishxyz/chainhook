import { relations } from "drizzle-orm/relations";
import { users, databaseConnections, indexSubscriptions, indexTypes, schemaTemplates } from "./schema";

export const databaseConnectionsRelations = relations(databaseConnections, ({one, many}) => ({
	user: one(users, {
		fields: [databaseConnections.userId],
		references: [users.id]
	}),
	indexSubscriptions: many(indexSubscriptions),
}));

export const usersRelations = relations(users, ({many}) => ({
	databaseConnections: many(databaseConnections),
	indexSubscriptions: many(indexSubscriptions),
}));

export const indexSubscriptionsRelations = relations(indexSubscriptions, ({one}) => ({
	user: one(users, {
		fields: [indexSubscriptions.userId],
		references: [users.id]
	}),
	databaseConnection: one(databaseConnections, {
		fields: [indexSubscriptions.connectionId],
		references: [databaseConnections.id]
	}),
	indexType: one(indexTypes, {
		fields: [indexSubscriptions.indexTypeId],
		references: [indexTypes.id]
	}),
}));

export const indexTypesRelations = relations(indexTypes, ({many}) => ({
	indexSubscriptions: many(indexSubscriptions),
	schemaTemplates: many(schemaTemplates),
}));

export const schemaTemplatesRelations = relations(schemaTemplates, ({one}) => ({
	indexType: one(indexTypes, {
		fields: [schemaTemplates.indexTypeId],
		references: [indexTypes.id]
	}),
}));