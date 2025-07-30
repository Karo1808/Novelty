CREATE OR REPLACE FUNCTION create_user_info_after_email_verified()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_email_verified = TRUE
     AND (OLD.is_email_verified IS DISTINCT FROM TRUE) THEN

    INSERT INTO user_info (
      id,
      user_id,
      username,
      avatar_url,
      bio,
      preferences,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid()::text,
      NEW.id,
      NULL,
      '',
      NULL,
      '{}'::jsonb,
      now(),
      now()
    )
    ON CONFLICT (user_id)
      DO UPDATE
        SET updated_at = EXCLUDED.updated_at;  -- or DO NOTHING
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
