CREATE TABLE "user_info" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"username" varchar(255),
	"avatar_url" text,
	"bio" text,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_info_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_info_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_email_verified" boolean NOT NULL,
	"is_onboarded" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION create_user_info_after_email_verified()
RETURNS trigger AS $$
BEGIN
  -- Check if is_email_verified changed to true (and was not true before)
  IF NEW.is_email_verified = TRUE AND (OLD.is_email_verified IS DISTINCT FROM TRUE) THEN
    INSERT INTO user_info (
      id, 
      user_id, 
      username,      -- Set to NULL instead of NEW.email
      avatar_url, 
      bio, 
      preferences, 
      created_at, 
      updated_at
    )
    VALUES (
      gen_random_uuid()::text,  -- generate a new UUID
      NEW.id, 
      NULL,                     -- set username to NULL
      '',                       -- default avatar_url (adjust as needed)
      NULL,                     -- bio can be NULL
      '{}'::jsonb,              -- default empty preferences JSON
      now(), 
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_create_user_info
AFTER UPDATE OF is_email_verified ON users
FOR EACH ROW
WHEN (NEW.is_email_verified = TRUE)
EXECUTE FUNCTION create_user_info_after_email_verified();