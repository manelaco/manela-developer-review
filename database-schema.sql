-- MANELA Database Schema (Structure Only)
-- No real data included - for developer review
-- Version: 1.0.0
-- Last Updated: 2024-03-19

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles with role separation
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  user_type TEXT CHECK (user_type IN ('hr_manager', 'employee', 'admin')),
  company_email TEXT, -- HR only
  personal_email TEXT, -- Employee only
  employee_role TEXT, -- HR role within company
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Company management with address verification
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT, -- email domain for HR validation
  verified_address TEXT, -- Google verified address
  address_components JSONB, -- structured address data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employee-Company linking
CREATE TABLE employee_company_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES user_profiles(id),
  company_id UUID REFERENCES companies(id),
  linked_at TIMESTAMP DEFAULT NOW()
);

-- Separate policy storage for HR vs Employee
CREATE TABLE hr_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hr_manager_id UUID REFERENCES user_profiles(id),
  employee_name TEXT NOT NULL,
  employee_salary DECIMAL(10,2),
  leave_type TEXT NOT NULL,
  policy_data JSONB NOT NULL,
  shared_with_employee BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE employee_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES user_profiles(id),
  policy_data JSONB NOT NULL,
  generation_source TEXT DEFAULT 'self_service',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Document handling with enhanced metadata
CREATE TABLE uploaded_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  original_filename TEXT,
  file_size INTEGER,
  mime_type TEXT,
  processing_status TEXT DEFAULT 'pending',
  extracted_data JSONB,
  ai_confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notification system
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_type ON user_profiles(user_type);
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_company_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (example for user_profiles)
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "HR managers can view employee profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles hr
      WHERE hr.id = auth.uid()
      AND hr.user_type = 'hr_manager'
      AND hr.company_email = user_profiles.company_email
    )
  );

-- Add audit triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE user_profiles IS 'Stores user profile information with role-based access';
COMMENT ON TABLE companies IS 'Company information with address verification';
COMMENT ON TABLE employee_company_links IS 'Links employees to their companies';
COMMENT ON TABLE hr_policies IS 'HR-managed policies for employees';
COMMENT ON TABLE employee_policies IS 'Employee-accessible policies';
COMMENT ON TABLE uploaded_documents IS 'Document storage with AI processing metadata';
COMMENT ON TABLE notifications IS 'User notification system';

-- Add example data (for development only)
INSERT INTO user_profiles (email, user_type, full_name)
VALUES 
  ('admin@example.com', 'admin', 'Admin User'),
  ('hr@example.com', 'hr_manager', 'HR Manager'),
  ('employee@example.com', 'employee', 'Test Employee');

-- Note: This schema includes:
-- 1. Row Level Security (RLS) for data protection
-- 2. Audit triggers for tracking changes
-- 3. Performance indexes
-- 4. Documentation comments
-- 5. Example development data
-- 6. No sensitive or production data 