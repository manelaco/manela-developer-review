import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      // Basic employee info
      name,
      employee_id,
      job_title,
      department,
      
      // Employment details
      province,
      employment_start_date,
      salary,
      employment_type,
      
      // Leave details
      leave_type,
      expected_leave_start,
      expected_return_date,
      
      // Insurance & benefits
      insurance_provider,
      policy_number,
      short_term_disability,
      company_top_up_percentage,
      
      // Meta info
      status,
      company_id,
      upload_id,
      ai_source_data,
      created_from_upload
    } = req.body;

    // Validate required fields
    if (!name || !job_title || !province || !employment_start_date || !salary || !leave_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, job_title, province, employment_start_date, salary, leave_type' 
      });
    }

    // Insert employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        name,
        job_title,
        leave_type,
        leave_date: expected_leave_start,
        return_date: expected_return_date || null,
        status: status || 'PENDING',
        support_status: 'Pending Setup',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (employeeError) {
      console.error('Error creating employee:', employeeError);
      return res.status(500).json({ error: 'Failed to create employee record' });
    }

    // Create detailed employee profile with parental leave data
    const { data: profile, error: profileError } = await supabase
      .from('employee_profiles')
      .insert({
        employee_id: employee.id,
        employee_external_id: employee_id,
        department,
        province,
        employment_start_date,
        annual_salary: parseFloat(salary),
        employment_type,
        insurance_provider,
        policy_number,
        short_term_disability_coverage: short_term_disability,
        company_top_up_percentage: company_top_up_percentage ? parseFloat(company_top_up_percentage) : null,
        ai_extraction_source: ai_source_data,
        created_from_upload: created_from_upload || false,
        upload_id: upload_id || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating employee profile:', profileError);
      // Don't fail completely, but log the error
    }

    // Update the policy upload to link it to the created employee
    if (upload_id) {
      const { error: linkError } = await supabase
        .from('policy_uploads')
        .update({
          linked_employee_id: employee.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', upload_id);

      if (linkError) {
        console.error('Error linking upload to employee:', linkError);
      }
    }

    return res.status(201).json({
      employee_id: employee.id,
      profile_id: profile?.id,
      message: 'Employee created successfully',
      next_step: 'policy_generation',
    });

  } catch (error) {
    console.error('Error in employee creation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 