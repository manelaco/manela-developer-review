
import { z } from 'zod';

export const formSchema = z.object({
  companySize: z.enum(['1-10', '11-50', '51-100', '101-200', '201-500', '500+']),
  industry: z.enum([
    'Accounting',
    'Advertising & Marketing',
    'Aerospace & Defense',
    'Agriculture',
    'Automotive',
    'Construction',
    'Consumer Products',
    'Education',
    'Energy & Utilities',
    'Entertainment & Media',
    'Financial Services',
    'Government',
    'Healthcare',
    'Hospitality & Tourism',
    'Information Technology',
    'Insurance',
    'Legal Services',
    'Manufacturing',
    'Real Estate',
    'Retail',
    'Telecommunications',
    'Transportation & Logistics',
    'Other'
  ]),
  role: z.string().min(1, "Please select your role"),
  otherIndustry: z.string().optional(),
}).refine(
  (data) => {
    // Only require otherIndustry when industry is 'Other'
    if (data.industry === 'Other') {
      return !!data.otherIndustry && data.otherIndustry.trim() !== '';
    }
    return true;
  },
  {
    message: "Please specify your industry",
    path: ["otherIndustry"] // Path to the field that has the error
  }
);

export type FormValues = z.infer<typeof formSchema>;

export const industries = [
  'Accounting',
  'Advertising & Marketing',
  'Aerospace & Defense',
  'Agriculture',
  'Automotive',
  'Construction',
  'Consumer Products',
  'Education',
  'Energy & Utilities',
  'Entertainment & Media',
  'Financial Services',
  'Government',
  'Healthcare',
  'Hospitality & Tourism',
  'Information Technology',
  'Insurance',
  'Legal Services',
  'Manufacturing',
  'Real Estate',
  'Retail',
  'Telecommunications',
  'Transportation & Logistics',
  'Other'
];
