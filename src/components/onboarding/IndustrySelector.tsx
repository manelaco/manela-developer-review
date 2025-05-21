
import React, { useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormValues, industries } from './onboardingTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface IndustrySelectorProps {
  form: UseFormReturn<FormValues>;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ form }) => {
  const selectedIndustry = form.watch('industry');
  
  // Reset otherIndustry when industry selection changes
  useEffect(() => {
    if (selectedIndustry !== 'Other') {
      form.setValue('otherIndustry', '');
    }
  }, [selectedIndustry, form]);
  
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-medium">What is your industry?</h2>
      
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {selectedIndustry === 'Other' && (
        <FormField
          control={form.control}
          name="otherIndustry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify your industry</FormLabel>
              <FormControl>
                <Input placeholder="Your industry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default IndustrySelector;
