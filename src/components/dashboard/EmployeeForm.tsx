import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/lib/db';
import { toast } from 'sonner';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  leave_date: z.string().min(1, 'Leave date is required'),
  return_date: z.string().min(1, 'Return date is required'),
  leave_type: z.string().min(1, 'Leave type is required'),
  status: z.enum(['ACTIVE', 'ON LEAVE', 'DELAYED', 'REINTEGRATION']),
  support_status: z.string().min(1, 'Support status is required'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {
      status: 'ACTIVE',
    },
  });

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
      toast.success(employee ? 'Employee updated successfully' : 'Employee added successfully');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Employee Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter employee name"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            id="job_title"
            {...register('job_title')}
            placeholder="Enter job title"
          />
          {errors.job_title && <p className="text-sm text-red-500 mt-1">{errors.job_title.message}</p>}
        </div>

        <div>
          <Label htmlFor="leave_date">Leave Date</Label>
          <Input
            id="leave_date"
            type="date"
            {...register('leave_date')}
          />
          {errors.leave_date && <p className="text-sm text-red-500 mt-1">{errors.leave_date.message}</p>}
        </div>

        <div>
          <Label htmlFor="return_date">Return Date</Label>
          <Input
            id="return_date"
            type="date"
            {...register('return_date')}
          />
          {errors.return_date && <p className="text-sm text-red-500 mt-1">{errors.return_date.message}</p>}
        </div>

        <div>
          <Label htmlFor="leave_type">Leave Type</Label>
          <Select
            defaultValue={employee?.leave_type}
            onValueChange={(value) => setValue('leave_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Parental">Parental</SelectItem>
              <SelectItem value="Long-term">Long-term</SelectItem>
              <SelectItem value="Caregiver">Caregiver</SelectItem>
              <SelectItem value="Long - extended leave">Long - extended leave</SelectItem>
              <SelectItem value="Union short leave">Union short leave</SelectItem>
              <SelectItem value="Other - Long-term">Other - Long-term</SelectItem>
              <SelectItem value="Other - Short">Other - Short</SelectItem>
              <SelectItem value="Request - Adoption">Request - Adoption</SelectItem>
            </SelectContent>
          </Select>
          {errors.leave_type && <p className="text-sm text-red-500 mt-1">{errors.leave_type.message}</p>}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={employee?.status}
            onValueChange={(value) => setValue('status', value as Employee['status'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ON LEAVE">On Leave</SelectItem>
              <SelectItem value="DELAYED">Delayed</SelectItem>
              <SelectItem value="REINTEGRATION">Reintegration</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
        </div>

        <div>
          <Label htmlFor="support_status">Support Status</Label>
          <Select
            defaultValue={employee?.support_status}
            onValueChange={(value) => setValue('support_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select support status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activated">Activated</SelectItem>
              <SelectItem value="Service Initiated">Service Initiated</SelectItem>
            </SelectContent>
          </Select>
          {errors.support_status && <p className="text-sm text-red-500 mt-1">{errors.support_status.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}; 