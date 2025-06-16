import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check } from 'lucide-react';

// Enhanced schema for parental leave calculations
const formSchema = z.object({
  // Basic Employee Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  employee_id: z.string().optional(),
  job_title: z.string().min(2, 'Job title must be at least 2 characters'),
  department: z.string().optional(),
  
  // Critical for Parental Leave Calculations
  province: z.enum(['quebec', 'ontario'], { required_error: 'Province is required for benefit calculations' }),
  employment_start_date: z.string().min(1, 'Start date is required for tenure calculation'),
  salary: z.string().min(1, 'Salary is required for benefit calculations'),
  employment_type: z.enum(['full-time', 'part-time', 'contract']),
  
  // Leave Details
  leave_type: z.enum(['maternity', 'paternity', 'parental', 'adoption']),
  expected_leave_start: z.string().min(1, 'Expected leave start date is required'),
  expected_return_date: z.string().optional(),
  
  // Insurance & Benefits (AI Extracted)
  insurance_provider: z.string().optional(),
  policy_number: z.string().optional(),
  short_term_disability: z.string().optional(),
  company_top_up_percentage: z.string().optional(),
  
  // Status
  status: z.string().min(1, 'Status is required'),
});

interface AIExtractionData {
  employee_info?: {
    name?: string;
    employee_id?: string;
    department?: string;
  };
  insurance_details?: {
    provider?: string;
    policy_number?: string;
    coverage_type?: string;
  };
  benefits?: {
    short_term_disability?: string;
    company_top_up?: string;
    maternity_leave?: string;
    paternity_leave?: string;
  };
}

interface ParentalLeaveFormProps {
  aiData?: AIExtractionData;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ParentalLeaveForm: React.FC<ParentalLeaveFormProps> = ({
  aiData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Pre-populate with AI data if available
      name: aiData?.employee_info?.name || '',
      employee_id: aiData?.employee_info?.employee_id || '',
      job_title: '',
      department: aiData?.employee_info?.department || '',
      province: undefined,
      employment_start_date: '',
      salary: '',
      employment_type: undefined,
      leave_type: undefined,
      expected_leave_start: '',
      expected_return_date: '',
      insurance_provider: aiData?.insurance_details?.provider || '',
      policy_number: aiData?.insurance_details?.policy_number || '',
      short_term_disability: aiData?.benefits?.short_term_disability || '',
      company_top_up_percentage: aiData?.benefits?.company_top_up || '',
      status: 'PENDING',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Add AI source data to submission
    const submissionData = {
      ...data,
      ai_source_data: aiData,
      created_from_upload: !!aiData,
    };
    onSubmit(submissionData);
  };

  // Helper to show if field was AI-populated
  const FieldStatus = ({ hasAIData, fieldName }: { hasAIData: boolean; fieldName: string }) => {
    if (hasAIData) {
      return (
        <Badge variant="secondary" className="ml-2 text-xs">
          <Check className="w-3 h-3 mr-1" />
          AI Filled
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="ml-2 text-xs">
        <AlertCircle className="w-3 h-3 mr-1" />
        Required
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Employee for Parental Leave</h2>
        <p className="text-gray-600 mt-2">
          {aiData ? 
            "Fields marked with 'AI Filled' were extracted from your uploaded document. Please review and complete any missing information." :
            "Please fill in all required information to calculate parental leave benefits."
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          {/* Employee Information Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Employee Name
                      <FieldStatus hasAIData={!!aiData?.employee_info?.name} fieldName="name" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Employee ID
                      <FieldStatus hasAIData={!!aiData?.employee_info?.employee_id} fieldName="employee_id" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Employee ID (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Job Title
                      <Badge variant="outline" className="ml-2 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Required
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Department
                      <FieldStatus hasAIData={!!aiData?.employee_info?.department} fieldName="department" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Employment & Leave Details Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Employment & Leave Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Province
                      <Badge variant="destructive" className="ml-2 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Critical
                      </Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province (affects benefits)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quebec">Quebec (QPIP + EI)</SelectItem>
                        <SelectItem value="ontario">Ontario (EI Only)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employment_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Employment Start Date
                      <Badge variant="destructive" className="ml-2 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        For Tenure
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Annual Salary
                      <Badge variant="destructive" className="ml-2 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        For Benefits
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 75000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leave_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="maternity">Maternity Leave</SelectItem>
                        <SelectItem value="paternity">Paternity Leave</SelectItem>
                        <SelectItem value="parental">Parental Leave</SelectItem>
                        <SelectItem value="adoption">Adoption Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_leave_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Leave Start</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Insurance & Benefits Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Insurance & Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name="insurance_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Insurance Provider
                      <FieldStatus hasAIData={!!aiData?.insurance_details?.provider} fieldName="insurance_provider" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sun Life, Manulife" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="policy_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Policy Number
                      <FieldStatus hasAIData={!!aiData?.insurance_details?.policy_number} fieldName="policy_number" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Policy number from document" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="short_term_disability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Short-term Disability
                      <FieldStatus hasAIData={!!aiData?.benefits?.short_term_disability} fieldName="short_term_disability" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 66.67% for 15 weeks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_top_up_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Company Top-up %
                      <FieldStatus hasAIData={!!aiData?.benefits?.company_top_up} fieldName="company_top_up_percentage" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 15% (on top of government benefits)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Employee & Generate Policy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ParentalLeaveForm; 