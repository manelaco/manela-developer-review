
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './onboardingTypes';

interface CompanySizeSelectorProps {
  form: UseFormReturn<FormValues>;
}

const CompanySizeSelector: React.FC<CompanySizeSelectorProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">What is the size of your company?</h2>
      
      <FormField
        control={form.control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                {['1-10', '11-50', '51-100', '101-200', '201-500', '500+'].map((size) => (
                  <FormItem key={size}>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={size} 
                          id={`size-${size}`} 
                          className="peer sr-only" 
                        />
                        <FormLabel 
                          htmlFor={`size-${size}`} 
                          className="flex-1 cursor-pointer rounded-md border border-gray-200 p-4 text-center 
                            peer-data-[state=checked]:border-2
                            peer-data-[state=checked]:border-[#8B3A13]"
                        >
                          {size}
                        </FormLabel>
                      </div>
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanySizeSelector;
