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
  type: 'article' | 'resource' | 'policy' | 'template';
  content: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  author_id: string;
  company_id?: string; // null means available to all companies
  created_at: string;
  updated_at: string;
  published_at?: string;
  metadata?: {
    readTime?: number;
    featured?: boolean;
    priority?: number;
    targetRoles?: ('hr_admin' | 'employee')[];
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

export const createContent = async (content: Omit<Content, 'id' | 'created_at' | 'updated_at'>) => {
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
    return data as Content;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

export const updateContent = async (id: string, updates: Partial<Content>) => {
  try {
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
    return data as Content;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting content:', error);
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