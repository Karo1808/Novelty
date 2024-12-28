CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_email_verified" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
