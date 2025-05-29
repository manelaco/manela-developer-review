import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { formSchema, FormValues } from './onboardingTypes';
import CompanySizeSelector from './CompanySizeSelector';
import IndustrySelector from './IndustrySelector';
import StepTwoSidebar from './StepTwoSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/lib/supabaseClient';

const companyRoles = [
  "Human Resources Lead", 
  "People & Culture Manager", 
  "DEI Specialist", 
  "HR Administrator", 
  "Talent Acquisition Manager", 
  "Employee Experience Lead", 
  "Learning & Development Manager", 
  "HR Business Partner", 
  "Chief People Officer"
];

const StepTwo: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<string>();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companySize: '51-100',
      industry: 'Consumer Products',
      role: 'Human Resources Lead',
      otherIndustry: ''
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      // Update current step in user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ current_onboarding_step: 2 })
        .eq('id', onboardingData.userId);

      if (updateError) throw updateError;

      // Store in localStorage for persistence across steps
      localStorage.setItem('onboardingData', JSON.stringify({
        ...onboardingData,
        companySize: data.companySize,
        industry: data.industry,
        role: data.role,
        otherIndustry: data.otherIndustry
      }));
      
      toast.success("Information saved successfully");
      navigate('/onboarding/step-three');
    } catch (error) {
      console.error('Error saving step two data:', error);
      toast.error('Failed to save information. Please try again.');
    }
  };

  // Get domain name from local storage
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
  const domainName = onboardingData.preferredDomain 
    ? `${onboardingData.preferredDomain}.manela.com`
    : 'yourdomain.manela.com';

  if (context === "left") {
    return (
      <StepTwoSidebar 
        domainName={domainName}
      />
    );
  }

  return (
    <Form {...form}>
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-14 overflow-y-auto pr-4 flex-1">
          <CompanySizeSelector form={form} />
          <IndustrySelector form={form} />
          
          <div className="space-y-2">
            <label className="text-base font-medium">Select Your Role *</label>
            <Select 
              defaultValue={form.getValues('role')}
              onValueChange={(value) => form.setValue('role', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {companyRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={() => navigate('/onboarding/step-one')}
          >
            Go Back
          </Button>
          
          <Button
            type="submit"
            className="flex-1 h-12 bg-[#1A1F2C] hover:bg-[#353e52] text-white"
            onClick={form.handleSubmit(onSubmit)}
          >
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default StepTwo;
