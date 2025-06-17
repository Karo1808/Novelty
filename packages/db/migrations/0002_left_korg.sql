DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_type
    WHERE  typname = 'auth_provider_enum'
  ) THEN
    CREATE TYPE auth_provider_enum AS ENUM ('email', 'google', 'amazon');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS auth_providers (
  id               varchar(255) PRIMARY KEY,
  user_id          varchar(255) NOT NULL,
  provider         auth_provider_enum NOT NULL,
  provider_user_id varchar(255),
  created_at       timestamp NOT NULL DEFAULT now(),
  updated_at       timestamp NOT NULL
);

-- 3️⃣  FK constraint ─ add only if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   information_schema.table_constraints
    WHERE  constraint_name = 'auth_providers_user_id_users_id_fk'
      AND  table_name      = 'auth_providers'
  ) THEN
    ALTER TABLE auth_providers
      ADD CONSTRAINT auth_providers_user_id_users_id_fk
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE;
  END IF;
END $$;



