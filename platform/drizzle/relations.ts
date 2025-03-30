import { relations } from "drizzle-orm/relations";
import { users, indexSubscriptions, databaseConnections, indexTypes, schemaTemplates } from "./schema";

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

export const usersRelations = relations(users, ({many}) => ({
	indexSubscriptions: many(indexSubscriptions),
	databaseConnections: many(databaseConnections),
}));

export const databaseConnectionsRelations = relations(databaseConnections, ({one, many}) => ({
	indexSubscriptions: many(indexSubscriptions),
	user: one(users, {
		fields: [databaseConnections.userId],
		references: [users.id]
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