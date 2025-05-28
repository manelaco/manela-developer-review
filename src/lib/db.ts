import { createClient } from '@supabase/supabase-js';
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface OnboardingUser {
  id?: string;
  company_name: string;
  preferred_domain: string;
  company_size: string;
  industry: string;
  role: string;
  tenant: string;
  resources: string[];
  created_at?: string;
}

export const saveOnboardingData = async (data: OnboardingUser) => {
  try {
    const { data: result, error } = await supabase
      .from('onboarding_users')
      .insert([
        {
          company_name: data.company_name,
          preferred_domain: data.preferred_domain,
          company_size: data.company_size,
          industry: data.industry,
          role: data.role,
          tenant: 'Company', // Set tenant role to Company as requested
          resources: data.resources,
        }
      ])
      .select();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    throw error;
  }
};

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('onboarding_users').select('count').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};

export interface Employee {
  id?: string;
  name: string;
  job_title: string;
  leave_date: string;
  return_date: string;
  leave_type: string;
  status: 'ACTIVE' | 'ON LEAVE' | 'DELAYED' | 'REINTEGRATION';
  support_status: string;
  documents?: string[];
  created_at?: string;
  updated_at?: string;
}

export const getEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: string, employee: Partial<Employee>) => {
  try {
    // Validate dates before updating
    validateEmployeeDates(employee);

    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const insertMockEmployees = async () => {
  // Get current week's dates
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

  // Format dates for the current week
  const thisWeekStart = format(weekStart, 'yyyy-MM-dd');
  const thisWeekEnd = format(weekEnd, 'yyyy-MM-dd');
  const midWeek = format(addDays(weekStart, 3), 'yyyy-MM-dd'); // Wednesday

  const mockEmployees = [
    {
      name: "Sarah Johnson",
      job_title: "Senior Software Engineer",
      leave_date: thisWeekStart, // Monday of current week
      return_date: format(addDays(weekStart, 180), 'yyyy-MM-dd'), // 6 months from leave date
      leave_type: "Parental",
      status: "ON LEAVE",
      support_status: "Activated"
    },
    {
      name: "Michael Chen",
      job_title: "Product Manager",
      leave_date: format(addDays(weekStart, -90), 'yyyy-MM-dd'), // 3 months before current week
      return_date: thisWeekEnd, // Sunday of current week
      leave_type: "Long-term",
      status: "ACTIVE",
      support_status: "Service Initiated"
    },
    {
      name: "Emma Rodriguez",
      job_title: "UX Designer",
      leave_date: midWeek, // Wednesday of current week
      return_date: format(addDays(weekStart, 90), 'yyyy-MM-dd'), // 3 months from leave date
      leave_type: "Caregiver",
      status: "DELAYED",
      support_status: "Service Initiated"
    },
    {
      name: "James Wilson",
      job_title: "Marketing Director",
      leave_date: format(addDays(weekStart, 14), 'yyyy-MM-dd'), // 2 weeks from now
      return_date: format(addDays(weekStart, 180), 'yyyy-MM-dd'), // 6 months from leave date
      leave_type: "Parental",
      status: "ACTIVE",
      support_status: "Activated"
    },
    {
      name: "Sophia Kim",
      job_title: "Data Analyst",
      leave_date: format(addDays(weekStart, -60), 'yyyy-MM-dd'), // 2 months before current week
      return_date: format(addDays(weekStart, 30), 'yyyy-MM-dd'), // 1 month from now
      leave_type: "Long - extended leave",
      status: "ON LEAVE",
      support_status: "Activated"
    },
    {
      name: "David Thompson",
      job_title: "HR Specialist",
      leave_date: format(addDays(weekStart, 7), 'yyyy-MM-dd'), // 1 week from now
      return_date: format(addDays(weekStart, 21), 'yyyy-MM-dd'), // 3 weeks from leave date
      leave_type: "Union short leave",
      status: "ACTIVE",
      support_status: "Service Initiated"
    },
    {
      name: "Olivia Martinez",
      job_title: "Sales Manager",
      leave_date: format(addDays(weekStart, 21), 'yyyy-MM-dd'), // 3 weeks from now
      return_date: format(addDays(weekStart, 180), 'yyyy-MM-dd'), // 6 months from leave date
      leave_type: "Parental",
      status: "ACTIVE",
      support_status: "Activated"
    },
    {
      name: "Ethan Brown",
      job_title: "Customer Success Lead",
      leave_date: format(addDays(weekStart, -30), 'yyyy-MM-dd'), // 1 month before current week
      return_date: format(addDays(weekStart, 90), 'yyyy-MM-dd'), // 3 months from now
      leave_type: "Other - Long-term",
      status: "ON LEAVE",
      support_status: "Service Initiated"
    },
    {
      name: "Ava Taylor",
      job_title: "Content Strategist",
      leave_date: format(addDays(weekStart, 14), 'yyyy-MM-dd'), // 2 weeks from now
      return_date: format(addDays(weekStart, 28), 'yyyy-MM-dd'), // 4 weeks from leave date
      leave_type: "Other - Short",
      status: "ACTIVE",
      support_status: "Activated"
    },
    {
      name: "Noah Garcia",
      job_title: "Operations Manager",
      leave_date: format(addDays(weekStart, 28), 'yyyy-MM-dd'), // 4 weeks from now
      return_date: format(addDays(weekStart, 180), 'yyyy-MM-dd'), // 6 months from leave date
      leave_type: "Request - Adoption",
      status: "ACTIVE",
      support_status: "Service Initiated"
    }
  ];

  try {
    const { data, error } = await supabase
      .from('employees')
      .insert(mockEmployees)
      .select();

    if (error) throw error;
    console.log('Mock employees inserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error inserting mock employees:', error);
    throw error;
  }
};

// Add function to get employees for a specific week
export const getEmployeesForWeek = async (weekStart: Date) => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(`leave_date.lte.${format(weekEnd, 'yyyy-MM-dd')},return_date.gte.${format(weekStart, 'yyyy-MM-dd')}`)
      .order('leave_date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching employees for week:', error);
    throw error;
  }
};

// Add function to validate employee dates
export const validateEmployeeDates = (employee: Partial<Employee>) => {
  if (employee.leave_date && employee.return_date) {
    const leaveDate = new Date(employee.leave_date);
    const returnDate = new Date(employee.return_date);
    
    if (returnDate < leaveDate) {
      throw new Error('Return date cannot be before leave date');
    }
  }
  return true;
};

export interface Content {
  id: string;
  title: string;
  type: 'article' | 'resource' | 'policy' | 'template' | 'blog' | 'video';
  content: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  author_id: string;
  company_id?: string; // null means available to all companies
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count?: number;
  metadata?: {
    readTime?: number;
    featured?: boolean;
    priority?: number;
    targetRoles?: ('hr_admin' | 'employee')[];
    targetCompanies?: any;
  };
}

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  parent_id?: string;
  created_at: string;
}

export interface ContentTag {
  id: string;
  name: string;
  created_at: string;
}

// Content Management Functions
export const getContent = async (filters?: {
  type?: Content['type'];
  status?: Content['status'];
  category?: string;
  company_id?: string;
  search?: string;
}) => {
  try {
    let query = supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export interface ContentAuditLog {
  id?: string;
  content_id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  user_id: string;
  user_role: string;
  company_id?: string;
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  timestamp: string;
  metadata?: {
    ip_address?: string;
    user_agent?: string;
    reason?: string;
  };
}

export const logContentAction = async (log: Omit<ContentAuditLog, 'id' | 'timestamp'>) => {
  try {
    const { data, error } = await supabase
      .from('content_audit_logs')
      .insert([{
        ...log,
        timestamp: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error logging content action:', error);
    throw error;
  }
};

export const getContentAuditLogs = async (filters?: {
  content_id?: string;
  user_id?: string;
  company_id?: string;
  action?: ContentAuditLog['action'];
  start_date?: string;
  end_date?: string;
}) => {
  try {
    let query = supabase
      .from('content_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (filters?.content_id) {
      query = query.eq('content_id', filters.content_id);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id);
    }
    if (filters?.action) {
      query = query.eq('action', filters.action);
    }
    if (filters?.start_date) {
      query = query.gte('timestamp', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('timestamp', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ContentAuditLog[];
  } catch (error) {
    console.error('Error fetching content audit logs:', error);
    throw error;
  }
};

export const createContent = async (content: Omit<Content, 'id' | 'created_at' | 'updated_at'>, user_id: string, user_role: string) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert([{
        ...content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    // Log the creation
    await logContentAction({
      content_id: data.id,
      action: 'create',
      user_id,
      user_role,
      company_id: content.company_id,
      changes: Object.entries(content).map(([field, value]) => ({
        field,
        old_value: null,
        new_value: value
      }))
    });

    return data as Content;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

export const updateContent = async (id: string, updates: Partial<Content>, user_id: string, user_role: string) => {
  try {
    // Get the current content first
    const { data: currentContent, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('content')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the changes
    const changes = Object.entries(updates)
      .filter(([field, value]) => value !== currentContent[field])
      .map(([field, value]) => ({
        field,
        old_value: currentContent[field],
        new_value: value
      }));

    if (changes.length > 0) {
      await logContentAction({
        content_id: id,
        action: 'update',
        user_id,
        user_role,
        company_id: currentContent.company_id,
        changes
      });
    }

    return data as Content;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

export const deleteContent = async (id: string, user_id: string, user_role: string) => {
  try {
    // Get the content first
    const { data: content, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the deletion
    await logContentAction({
      content_id: id,
      action: 'delete',
      user_id,
      user_role,
      company_id: content.company_id,
      changes: Object.entries(content).map(([field, value]) => ({
        field,
        old_value: value,
        new_value: null
      }))
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};

export const incrementContentView = async (contentId: string, user_id: string, user_role: string) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .update({ view_count: supabase.rpc('increment', { x: 1 }) })
      .eq('id', contentId)
      .select();

    if (error) throw error;

    // Log the view
    await logContentAction({
      content_id: contentId,
      action: 'view',
      user_id,
      user_role,
      company_id: data[0].company_id
    });

    return data;
  } catch (error) {
    console.error('Error incrementing content view:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as ContentCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const { data, error } = await supabase
      .from('content_tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as ContentTag[];
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export interface Company {
  id: string;
  name: string;
  status: string;
  users?: number;
  plan?: string;
  lastActive?: string;
}

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as Company[];
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const createTestCompanies = async () => {
  const companies = [
    {
      name: 'TechCorp Solutions',
      status: 'active',
      users: 5,
      plan: 'enterprise',
      lastActive: new Date().toISOString()
    },
    {
      name: 'Global Innovations Inc',
      status: 'active',
      users: 5,
      plan: 'enterprise',
      lastActive: new Date().toISOString()
    },
    {
      name: 'Future Dynamics',
      status: 'active',
      users: 5,
      plan: 'enterprise',
      lastActive: new Date().toISOString()
    },
    {
      name: 'Smart Systems Ltd',
      status: 'active',
      users: 5,
      plan: 'enterprise',
      lastActive: new Date().toISOString()
    },
    {
      name: 'Digital Frontiers',
      status: 'active',
      users: 5,
      plan: 'enterprise',
      lastActive: new Date().toISOString()
    }
  ];

  try {
    const { data: createdCompanies, error: companyError } = await supabase
      .from('companies')
      .insert(companies)
      .select();

    if (companyError) throw companyError;

    // Create employees for each company
    for (const company of createdCompanies) {
      const employees = [
        {
          name: `${company.name} Employee 1`,
          job_title: 'Software Engineer',
          leave_date: new Date().toISOString(),
          return_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days from now
          leave_type: 'Parental',
          status: 'ON LEAVE',
          support_status: 'Activated',
          company_id: company.id
        },
        {
          name: `${company.name} Employee 2`,
          job_title: 'Product Manager',
          leave_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          return_date: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(), // 210 days from now
          leave_type: 'Parental',
          status: 'ACTIVE',
          support_status: 'Service Initiated',
          company_id: company.id
        },
        {
          name: `${company.name} Employee 3`,
          job_title: 'UX Designer',
          leave_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
          return_date: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(), // 240 days from now
          leave_type: 'Caregiver',
          status: 'ACTIVE',
          support_status: 'Service Initiated',
          company_id: company.id
        },
        {
          name: `${company.name} Employee 4`,
          job_title: 'Marketing Director',
          leave_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
          return_date: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString(), // 270 days from now
          leave_type: 'Parental',
          status: 'ACTIVE',
          support_status: 'Activated',
          company_id: company.id
        },
        {
          name: `${company.name} Employee 5`,
          job_title: 'Data Analyst',
          leave_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
          return_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(), // 300 days from now
          leave_type: 'Long-term',
          status: 'ACTIVE',
          support_status: 'Service Initiated',
          company_id: company.id
        }
      ];

      const { error: employeeError } = await supabase
        .from('employees')
        .insert(employees);

      if (employeeError) throw employeeError;
    }

    return createdCompanies;
  } catch (error) {
    console.error('Error creating test companies:', error);
    throw error;
  }
};

export const createTestContent = async (companies: Company[]) => {
  const content = [
    {
      title: 'Understanding Parental Leave Policies',
      type: 'article' as const,
      content: 'A comprehensive guide to understanding parental leave policies in Canada, including eligibility, duration, and benefits.',
      status: 'published' as const,
      category: 'Policies',
      tags: ['parental leave', 'policy', 'benefits'],
      author_id: 'system',
      company_id: companies[0].id,
      metadata: {
        readTime: 10,
        featured: true,
        priority: 1,
        targetRoles: ['hr_admin', 'employee'],
        targetCompanies: {
          mode: 'only',
          companyIds: [companies[0].id]
        }
      }
    },
    {
      title: 'Return to Work Toolkit',
      type: 'resource' as const,
      content: 'A complete toolkit for employees returning from parental leave, including checklists, templates, and best practices.',
      status: 'published' as const,
      category: 'Resources',
      tags: ['return to work', 'toolkit', 'resources'],
      author_id: 'system',
      company_id: companies[1].id,
      metadata: {
        readTime: 15,
        featured: true,
        priority: 2,
        targetRoles: ['hr_admin', 'employee'],
        targetCompanies: {
          mode: 'only',
          companyIds: [companies[1].id]
        }
      }
    },
    {
      title: 'Company Parental Leave Policy Template',
      type: 'policy' as const,
      content: 'A customizable template for companies to create their own parental leave policy, including all legal requirements and best practices.',
      status: 'published' as const,
      category: 'Policies',
      tags: ['policy template', 'legal', 'company policy'],
      author_id: 'system',
      company_id: companies[2].id,
      metadata: {
        readTime: 20,
        featured: true,
        priority: 1,
        targetRoles: ['hr_admin'],
        targetCompanies: {
          mode: 'only',
          companyIds: [companies[2].id]
        }
      }
    },
    {
      title: 'Leave Request Form Template',
      type: 'template' as const,
      content: 'A standardized template for employees to request parental leave, including all necessary information and documentation requirements.',
      status: 'published' as const,
      category: 'Templates',
      tags: ['leave request', 'form', 'template'],
      author_id: 'system',
      company_id: companies[3].id,
      metadata: {
        readTime: 5,
        featured: false,
        priority: 3,
        targetRoles: ['hr_admin', 'employee'],
        targetCompanies: {
          mode: 'only',
          companyIds: [companies[3].id]
        }
      }
    },
    {
      title: 'Success Stories: Returning to Work',
      type: 'blog' as const,
      content: 'Real stories from employees who successfully returned to work after parental leave, including their challenges and strategies.',
      status: 'published' as const,
      category: 'Blog',
      tags: ['success stories', 'return to work', 'experience'],
      author_id: 'system',
      company_id: companies[4].id,
      metadata: {
        readTime: 8,
        featured: true,
        priority: 2,
        targetRoles: ['hr_admin', 'employee'],
        targetCompanies: {
          mode: 'only',
          companyIds: [companies[4].id]
        }
      }
    }
  ];

  try {
    const { data: createdContent, error } = await supabase
      .from('content')
      .insert(content)
      .select();

    if (error) throw error;
    return createdContent;
  } catch (error) {
    console.error('Error creating test content:', error);
    throw error;
  }
}; 