-- Standalone SQL for pgAdmin if Alembic cannot run.
-- Run against database: haveit_app (or your DATABASE_URL target)

ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS pincode VARCHAR;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS cuisine_types TEXT;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS food_type VARCHAR(20);
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS cost_for_two NUMERIC(10, 2);
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS opening_time VARCHAR(10);
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS closing_time VARCHAR(10);
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS fssai_url TEXT;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS gst_url TEXT;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS pan_url TEXT;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS aadhaar_url TEXT;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS restaurant_image TEXT;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS bank_name VARCHAR;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE restaurant_profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Convert enum status to varchar when needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'restaurant_profiles'
      AND column_name = 'status'
      AND udt_name = 'restaurant_status'
  ) THEN
    ALTER TABLE restaurant_profiles
      ALTER COLUMN status TYPE VARCHAR USING status::text;
  END IF;
END $$;

UPDATE restaurant_profiles SET cuisine_types = COALESCE(cuisine_types, cuisine) WHERE cuisine_types IS NULL AND cuisine IS NOT NULL;
UPDATE restaurant_profiles SET fssai_url = COALESCE(fssai_url, fssai_certificate_url) WHERE fssai_url IS NULL AND fssai_certificate_url IS NOT NULL;
UPDATE restaurant_profiles SET pan_url = COALESCE(pan_url, pan_card_url) WHERE pan_url IS NULL AND pan_card_url IS NOT NULL;
UPDATE restaurant_profiles SET ifsc_code = COALESCE(ifsc_code, ifsc) WHERE ifsc_code IS NULL AND ifsc IS NOT NULL;

UPDATE restaurant_profiles SET status = 'draft' WHERE status IS NULL;
UPDATE restaurant_profiles SET onboarding_completed = TRUE WHERE status IN ('pending', 'approved', 'rejected') AND onboarding_completed = FALSE;
UPDATE restaurant_profiles SET submitted_at = created_at WHERE status IN ('pending', 'approved', 'rejected') AND submitted_at IS NULL AND created_at IS NOT NULL;

ALTER TABLE restaurant_profiles ALTER COLUMN status SET DEFAULT 'draft';

-- Mark migration applied (optional; only if using alembic_version table)
-- INSERT INTO alembic_version (version_num) VALUES ('c4a8b9d0e1f2') ON CONFLICT DO NOTHING;
