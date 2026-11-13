DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Users'
          AND column_name = 'contrasena'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Users'
          AND column_name = 'contraseña'
    ) THEN
        ALTER TABLE "Users" RENAME COLUMN "contrasena" TO "contraseña";
    END IF;
END
$$;
