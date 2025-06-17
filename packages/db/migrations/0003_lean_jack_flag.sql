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