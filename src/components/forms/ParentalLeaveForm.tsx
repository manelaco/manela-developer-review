import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  employee_id: z.string().min(1, 'Employee ID is required'),
  job_title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  province: z.string().min(1, 'Province is required'),
  employment_start_date: z.string().min(1, 'Employment start date is required'),
  salary: z.string().min(1, 'Salary is required'),
  employment_type: z.string().optional(),
  leave_type: z.string().optional(),
  expected_leave_start: z.string().min(1, 'Expected leave start date is required'),
  expected_return_date: z.string().min(1, 'Expected return date is required'),
  insurance_provider: z.string().min(1, 'Insurance provider is required'),
  policy_number: z.string().min(1, 'Policy number is required'),
  short_term_disability: z.string().min(1, 'Short term disability is required'),
  company_top_up_percentage: z.string().min(1, 'Company top up percentage is required'),
  status: z.string().min(1, 'Status is required'),
});

const ParentalLeaveForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Pre-populate with AI data if available (proper nested structure)
      name: aiData?.employeeInfo?.name || '',
      employee_id: aiData?.employeeInfo?.employeeId || '',
      job_title: '',
      department: aiData?.employeeInfo?.department || '',
      province: 'quebec', // Default since document shows QPIP
      employment_start_date: '',
      salary: '',
      employment_type: undefined,
      leave_type: undefined,
      expected_leave_start: '',
      expected_return_date: '',
      insurance_provider: aiData?.insuranceDetails?.provider || '',
      policy_number: aiData?.insuranceDetails?.policyNumber || '',
      short_term_disability: aiData?.benefitBreakdown?.shortTermDisability || '',
      company_top_up_percentage: aiData?.companyPolicy?.topUpPercentage || '',
      status: 'PENDING',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // ... existing code ...
  };

  return (
    // Rest of the component code
  );
};

export default ParentalLeaveForm; 