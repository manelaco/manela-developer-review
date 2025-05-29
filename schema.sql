-- Add current_onboarding_step to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_onboarding_step integer;

-- Add full_name to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS full_name text; 