-- Database Schema for Manela MVP
-- This schema defines the structure for the Manela application database
-- Note: This is a sanitized version for developer reference
-- All sensitive data and internal configurations have been removed

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
CREATE TYPE user_role AS ENUM ('employee', 'admin', 'superadmin');

-- Activity Logs Table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    company_id UUID,
    action VARCHAR NOT NULL,
    entity_type VARCHAR NOT NULL,
    entity_id UUID,
    changes JSONB,
    ip_address VARCHAR,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Sessions Table
CREATE TABLE activity_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    start_time TIMESTAMPTZ DEFAULT now(),
    end_time TIMESTAMPTZ,
    activity_data JSONB
);

-- Analytics Table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    user_id UUID,
    page_path VARCHAR NOT NULL,
    time_spent INTEGER,
    interaction_type VARCHAR,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    company_id UUID,
    action VARCHAR NOT NULL,
    table_name VARCHAR NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Calendar Integrations Table
CREATE TABLE calendar_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    leave_plan_id UUID,
    calendar_type TEXT NOT NULL,
    calendar_id TEXT,
    integration_status TEXT DEFAULT 'pending',
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMPTZ,
    sync_leave_dates BOOLEAN DEFAULT true,
    sync_deadlines BOOLEAN DEFAULT true,
    sync_reminders BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    synced_events JSONB DEFAULT '[]',
    sync_errors JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    domain VARCHAR,
    settings JSONB DEFAULT '{"branding": {"logo": null, "fonts": null, "colors": null}, "features": {"hr_toolkit": true, "employee_support": true}}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    onboarding_user_id UUID,
    subscription_status VARCHAR DEFAULT 'active',
    status VARCHAR DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    seats_allocated INTEGER DEFAULT 0,
    seats_used INTEGER DEFAULT 0
);

-- Company Users Table
CREATE TABLE company_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    user_id UUID,
    role VARCHAR DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content Table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    category_id UUID,
    title VARCHAR NOT NULL,
    content_type VARCHAR NOT NULL,
    content TEXT,
    status VARCHAR NOT NULL DEFAULT 'draft',
    visibility VARCHAR NOT NULL DEFAULT 'private',
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    tags TEXT[],
    metadata JSONB DEFAULT '{"file_url": null, "file_size": null, "file_type": null, "thumbnail_url": null}'
);

-- Content Access Table
CREATE TABLE content_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID,
    company_id UUID,
    role_id UUID,
    can_view BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content Categories Table
CREATE TABLE content_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    company_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content Versions Table
CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID,
    version_number INTEGER NOT NULL,
    content TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB
);

-- Document Templates Table
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    template_type TEXT NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    province TEXT,
    is_system_template BOOLEAN DEFAULT true,
    company_id UUID,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Employee Profiles Table
CREATE TABLE employee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID,
    employee_external_id TEXT,
    department TEXT,
    province TEXT NOT NULL,
    employment_start_date DATE NOT NULL,
    annual_salary NUMERIC NOT NULL,
    employment_type TEXT,
    insurance_provider TEXT,
    policy_number TEXT,
    short_term_disability_coverage TEXT,
    company_top_up_percentage NUMERIC,
    ai_extraction_source JSONB,
    created_from_upload BOOLEAN DEFAULT false,
    upload_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Employees Table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    leave_date DATE NOT NULL,
    return_date DATE NOT NULL,
    leave_type TEXT NOT NULL,
    status TEXT NOT NULL,
    support_status TEXT NOT NULL,
    documents TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Generated Documents Table
CREATE TABLE generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_plan_id UUID NOT NULL,
    template_id UUID,
    employee_id UUID NOT NULL,
    company_id UUID NOT NULL,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    file_format TEXT DEFAULT 'pdf',
    storage_path TEXT,
    download_url TEXT,
    file_size INTEGER,
    generation_data JSONB DEFAULT '{}',
    personalization_data JSONB DEFAULT '{}',
    requires_signature BOOLEAN DEFAULT false,
    signature_status TEXT DEFAULT 'not_required',
    signed_at TIMESTAMPTZ,
    delivery_method TEXT,
    email_sent_at TIMESTAMPTZ,
    version INTEGER DEFAULT 1,
    parent_document_id UUID,
    status TEXT DEFAULT 'generated',
    generated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Government Regulations Table
CREATE TABLE government_regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country TEXT NOT NULL DEFAULT 'Canada',
    province TEXT NOT NULL,
    regulation_type TEXT NOT NULL,
    weeks_available INTEGER NOT NULL,
    pay_percentage NUMERIC NOT NULL,
    max_weekly_amount NUMERIC,
    waiting_period_weeks INTEGER DEFAULT 1,
    requirements JSONB DEFAULT '{}',
    application_details JSONB DEFAULT '{}',
    effective_date DATE NOT NULL,
    expiry_date DATE,
    source_url TEXT,
    last_updated TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Leave Plans Table
CREATE TABLE leave_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    company_id UUID NOT NULL,
    leave_type TEXT NOT NULL,
    due_date DATE,
    leave_start_date DATE NOT NULL,
    leave_end_date DATE NOT NULL,
    return_to_work_date DATE NOT NULL,
    government_weeks INTEGER,
    government_pay_percentage NUMERIC,
    government_weekly_amount NUMERIC,
    company_weeks INTEGER DEFAULT 0,
    company_pay_percentage NUMERIC DEFAULT 0,
    company_weekly_amount NUMERIC DEFAULT 0,
    total_weeks INTEGER NOT NULL,
    total_pay_percentage NUMERIC,
    estimated_total_amount NUMERIC,
    ai_generated_summary TEXT,
    custom_notes TEXT,
    timeline_data JSONB DEFAULT '{}',
    benefit_breakdown JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Onboarding Users Table
CREATE TABLE onboarding_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT,
    preferred_domain TEXT,
    company_size TEXT,
    industry TEXT,
    role TEXT,
    tenant TEXT,
    resources TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID,
    company_id UUID
);

-- Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    role user_role
);

-- Policy Uploads Table
CREATE TABLE policy_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    policy_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    storage_path TEXT NOT NULL,
    upload_url TEXT,
    metadata JSONB DEFAULT '{}',
    ai_processed BOOLEAN DEFAULT false,
    ai_extraction_data JSONB DEFAULT '{}',
    uploaded_by UUID,
    status TEXT DEFAULT 'active',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    linked_employee_id UUID
);

-- Role Permissions Table
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '{"users": {"read": false, "create": false, "delete": false, "update": false}, "company": {"manage": false}, "content": {"read": false, "create": false, "delete": false, "update": false}}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    company_id UUID,
    token_hash TEXT NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Superadmins Table
CREATE TABLE superadmins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    email VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    company_id UUID,
    role_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    job_title VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    onboarding_complete BOOLEAN DEFAULT false,
    current_onboarding_step INTEGER,
    full_name TEXT,
    role user_role DEFAULT 'employee',
    auth_user_id UUID,
    due_date DATE,
    leave_type TEXT,
    pregnancy_status TEXT,
    partner_leave_eligible BOOLEAN DEFAULT false,
    province TEXT,
    email TEXT
);

-- User Roles Table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Add Foreign Key Constraints
ALTER TABLE activity_logs
    ADD CONSTRAINT fk_activity_logs_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_activity_logs_company_id FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE activity_sessions
    ADD CONSTRAINT fk_activity_sessions_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id);

ALTER TABLE analytics
    ADD CONSTRAINT fk_analytics_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_analytics_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id);

ALTER TABLE audit_logs
    ADD CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_audit_logs_company_id FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE calendar_integrations
    ADD CONSTRAINT fk_calendar_integrations_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_calendar_integrations_leave_plan_id FOREIGN KEY (leave_plan_id) REFERENCES leave_plans(id);

ALTER TABLE company_users
    ADD CONSTRAINT fk_company_users_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_company_users_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id);

ALTER TABLE content
    ADD CONSTRAINT fk_content_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_content_category_id FOREIGN KEY (category_id) REFERENCES content_categories(id),
    ADD CONSTRAINT fk_content_created_by FOREIGN KEY (created_by) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_content_updated_by FOREIGN KEY (updated_by) REFERENCES user_profiles(id);

ALTER TABLE content_access
    ADD CONSTRAINT fk_content_access_content_id FOREIGN KEY (content_id) REFERENCES content(id),
    ADD CONSTRAINT fk_content_access_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_content_access_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE content_categories
    ADD CONSTRAINT fk_content_categories_company_id FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE content_versions
    ADD CONSTRAINT fk_content_versions_content_id FOREIGN KEY (content_id) REFERENCES content(id),
    ADD CONSTRAINT fk_content_versions_created_by FOREIGN KEY (created_by) REFERENCES user_profiles(id);

ALTER TABLE document_templates
    ADD CONSTRAINT fk_document_templates_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_document_templates_created_by FOREIGN KEY (created_by) REFERENCES user_profiles(id);

ALTER TABLE employee_profiles
    ADD CONSTRAINT fk_employee_profiles_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id),
    ADD CONSTRAINT fk_employee_profiles_upload_id FOREIGN KEY (upload_id) REFERENCES policy_uploads(id);

ALTER TABLE generated_documents
    ADD CONSTRAINT fk_generated_documents_leave_plan_id FOREIGN KEY (leave_plan_id) REFERENCES leave_plans(id),
    ADD CONSTRAINT fk_generated_documents_template_id FOREIGN KEY (template_id) REFERENCES document_templates(id),
    ADD CONSTRAINT fk_generated_documents_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id),
    ADD CONSTRAINT fk_generated_documents_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_generated_documents_generated_by FOREIGN KEY (generated_by) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_generated_documents_parent_document_id FOREIGN KEY (parent_document_id) REFERENCES generated_documents(id);

ALTER TABLE leave_plans
    ADD CONSTRAINT fk_leave_plans_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id),
    ADD CONSTRAINT fk_leave_plans_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_leave_plans_approved_by FOREIGN KEY (approved_by) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_leave_plans_created_by FOREIGN KEY (created_by) REFERENCES user_profiles(id);

ALTER TABLE onboarding_users
    ADD CONSTRAINT fk_onboarding_users_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_onboarding_users_company_id FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE policy_uploads
    ADD CONSTRAINT fk_policy_uploads_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_policy_uploads_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_policy_uploads_linked_employee_id FOREIGN KEY (linked_employee_id) REFERENCES employees(id);

ALTER TABLE role_permissions
    ADD CONSTRAINT fk_role_permissions_role_id FOREIGN KEY (role_id) REFERENCES roles(id),
    ADD CONSTRAINT fk_role_permissions_permission_id FOREIGN KEY (permission_id) REFERENCES permissions(id);

ALTER TABLE sessions
    ADD CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_sessions_company_id FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE superadmins
    ADD CONSTRAINT fk_superadmins_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id);

ALTER TABLE user_profiles
    ADD CONSTRAINT fk_user_profiles_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_user_profiles_role_id FOREIGN KEY (role_id) REFERENCES roles(id),
    ADD CONSTRAINT fk_user_profiles_auth_user_id FOREIGN KEY (auth_user_id) REFERENCES user_profiles(id);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    ADD CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

-- Add Indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_company_id ON activity_logs(company_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_analytics_company_id ON analytics(company_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_calendar_integrations_user_id ON calendar_integrations(user_id);
CREATE INDEX idx_calendar_integrations_leave_plan_id ON calendar_integrations(leave_plan_id);

CREATE INDEX idx_company_users_company_id ON company_users(company_id);
CREATE INDEX idx_company_users_user_id ON company_users(user_id);

CREATE INDEX idx_content_company_id ON content(company_id);
CREATE INDEX idx_content_category_id ON content(category_id);
CREATE INDEX idx_content_created_at ON content(created_at);

CREATE INDEX idx_content_access_content_id ON content_access(content_id);
CREATE INDEX idx_content_access_company_id ON content_access(company_id);
CREATE INDEX idx_content_access_role_id ON content_access(role_id);

CREATE INDEX idx_content_categories_company_id ON content_categories(company_id);

CREATE INDEX idx_content_versions_content_id ON content_versions(content_id);

CREATE INDEX idx_document_templates_company_id ON document_templates(company_id);

CREATE INDEX idx_employee_profiles_employee_id ON employee_profiles(employee_id);

CREATE INDEX idx_generated_documents_leave_plan_id ON generated_documents(leave_plan_id);
CREATE INDEX idx_generated_documents_employee_id ON generated_documents(employee_id);
CREATE INDEX idx_generated_documents_company_id ON generated_documents(company_id);

CREATE INDEX idx_leave_plans_employee_id ON leave_plans(employee_id);
CREATE INDEX idx_leave_plans_company_id ON leave_plans(company_id);
CREATE INDEX idx_leave_plans_created_at ON leave_plans(created_at);

CREATE INDEX idx_policy_uploads_company_id ON policy_uploads(company_id);
CREATE INDEX idx_policy_uploads_uploaded_by ON policy_uploads(uploaded_by);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_company_id ON sessions(company_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX idx_user_profiles_role_id ON user_profiles(role_id);
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Add RLS Policies
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE superadmins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY; 