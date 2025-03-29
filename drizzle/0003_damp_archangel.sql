CREATE TABLE "database_connections" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"host" varchar NOT NULL,
	"port" integer DEFAULT 5432 NOT NULL,
	"username" varchar NOT NULL,
	"password" text NOT NULL,
	"database" varchar NOT NULL,
	"ssl_mode" varchar DEFAULT 'require',
	"status" varchar DEFAULT 'pending',
	"last_connected_at" timestamp,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "index_subscriptions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"connection_id" varchar NOT NULL,
	"index_type_id" varchar NOT NULL,
	"status" varchar DEFAULT 'active',
	"target_schema" varchar DEFAULT 'public',
	"target_table" varchar NOT NULL,
	"addresses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"filter_criteria" jsonb,
	"last_indexed_at" timestamp,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "index_types" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "index_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "schema_templates" (
	"id" varchar PRIMARY KEY NOT NULL,
	"index_type_id" varchar NOT NULL,
	"schema_version" varchar NOT NULL,
	"creation_sql" text NOT NULL,
	"indexes_sql" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" varchar PRIMARY KEY NOT NULL,
	"signature" varchar,
	"webhook_id" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"payload" jsonb NOT NULL,
	"processed" boolean DEFAULT false,
	"processed_at" timestamp,
	"error_count" integer DEFAULT 0,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
ALTER TABLE "database_connections" ADD CONSTRAINT "database_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "index_subscriptions" ADD CONSTRAINT "index_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "index_subscriptions" ADD CONSTRAINT "index_subscriptions_connection_id_database_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."database_connections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "index_subscriptions" ADD CONSTRAINT "index_subscriptions_index_type_id_index_types_id_fk" FOREIGN KEY ("index_type_id") REFERENCES "public"."index_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schema_templates" ADD CONSTRAINT "schema_templates_index_type_id_index_types_id_fk" FOREIGN KEY ("index_type_id") REFERENCES "public"."index_types"("id") ON DELETE no action ON UPDATE no action;