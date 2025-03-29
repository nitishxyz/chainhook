CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
