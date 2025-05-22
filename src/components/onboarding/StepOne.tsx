import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProgressIndicator from '../ProgressIndicator';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Lock, User, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: 'Full name is required'
  }),
  companyEmail: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .refine(
      (password) => /[A-Z]/.test(password),
      { message: 'Password must contain at least one uppercase letter' }
    )
    .refine(
      (password) => /[a-z]/.test(password),
      { message: 'Password must contain at least one lowercase letter' }
    )
    .refine(
      (password) => /[0-9]/.test(password),
      { message: 'Password must contain at least one number' }
    )
    .refine(
      (password) => /[^A-Za-z0-9]/.test(password),
      { message: 'Password must contain at least one special character' }
    )
    .optional(),
  companyName: z.string().min(1, {
    message: 'Company name is required'
  }),
  preferredDomain: z.string().min(1, {
    message: 'Preferred domain is required'
  })
});

type FormValues = z.infer<typeof formSchema>;

const StepOne: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const context = useOutletContext<string>();
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companyEmail: '',
      password: '',
      companyName: '',
      preferredDomain: ''
    }
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    // Length check (at least 6 characters)
    if (password.length >= 6) {
      strength += 1;
    }
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getStrengthText = (password: string, strength: number) => {
    if (password.length === 0) return 'Enter a password';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (strength === 1) return 'Very weak';
    if (strength === 2) return 'Weak';
    if (strength === 3) return 'Medium';
    if (strength === 4) return 'Strong';
    if (strength === 5) return 'Very strong';
    return '';
  };

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };
    setPasswordCriteria(criteria);
    setPasswordStrength(calculatePasswordStrength(password));
    return Object.values(criteria).every(Boolean);
  };

  const onSubmit = (data: FormValues) => {
    // Store in localStorage for persistence across steps
    localStorage.setItem('onboardingData', JSON.stringify({
      ...JSON.parse(localStorage.getItem('onboardingData') || '{}'),
      fullName: data.fullName,
      companyEmail: data.companyEmail,
      password: data.password,
      companyName: data.companyName,
      preferredDomain: data.preferredDomain,
      tenant: 'hr' // Tag user as HR tenant
    }));
    
    navigate('/onboarding/step-two');
  };

  if (context === "left") {
    return <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">STEP 1 OF 4</p>
          <ProgressIndicator totalSteps={4} currentStep={1} />
        </div>
        
        <div className="mt-14"> 
          <h1 className="text-4xl font-bold text-gray-900 pb-4 text-left">Let's get to know you better</h1>
          
          <p className="text-gray-600 mb-8">
            This data is needed so that we can easily provide solutions according to your company's capacity
          </p>
        </div>
      </div>;
  }

  return <Form {...form}>
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <form 
          id="step-one-form"
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6 pt-14 overflow-y-auto pr-4 flex-1"
        > 
          {/* Personal Information Section */}
          <div className="space-y-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">Personal Information</h2>
            
            <FormField 
              control={form.control} 
              name="fullName" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Your Name *</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                        <User size={18} className="text-gray-500" />
                      </div>
                      <Input placeholder="Enter your full name" {...field} className="h-12 rounded-l-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <FormField 
              control={form.control} 
              name="companyEmail" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Company Email *</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                        <Mail size={18} className="text-gray-500" />
                      </div>
                      <Input placeholder="youremail@company.com" {...field} className="h-12 rounded-l-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <div className="space-y-3">
              <FormLabel className="text-base">Create Password *</FormLabel>
              <FormField 
                control={form.control} 
                name="password" 
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="relative flex">
                          <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                            <Lock size={18} className="text-gray-500" />
                          </div>
                          <Input 
                            type="password" 
                            placeholder="Create a secure password" 
                            {...field} 
                            className="h-12 rounded-l-none pr-10"
                            onChange={(e) => {
                              field.onChange(e);
                              validatePassword(e.target.value);
                            }}
                          />
                          {Object.values(passwordCriteria).every(Boolean) && field.value && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white">
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#F2FCE2]">
                                <Check size={16} className="text-green-600" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Password Strength Indicator */}
                        <div className="space-y-1">
                          <div className="flex gap-1 h-1">
                            {(() => {
                              if (field.value.length < 6) {
                                // All red bars if length is invalid
                                return <>{[...Array(5)].map((_, index) => (
                                  <div key={index} className="flex-1 rounded-full bg-red-500 transition-colors" />
                                ))}</>;
                              } else {
                                // Normal strength bars
                                return <>{[...Array(5)].map((_, index) => (
                                  <div
                                    key={index}
                                    className={`flex-1 rounded-full transition-colors ${
                                      index < passwordStrength
                                        ? passwordStrength <= 2
                                          ? 'bg-red-500'
                                          : passwordStrength <= 3
                                          ? 'bg-yellow-500'
                                          : 'bg-green-500'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}</>;
                              }
                            })()}
                          </div>
                          <p className={`text-xs ${field.value.length < 6 ? 'text-red-600' : 'text-gray-500'}`}> 
                            {getStrengthText(field.value, passwordStrength)}
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                    
                    <Accordion type="single" collapsible className="w-full mt-2">
                      <AccordionItem value="password-requirements" className="border-none">
                        <AccordionTrigger className="py-2 text-xs text-gray-500 hover:no-underline">
                          Password requirements
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                          <ul className="space-y-1 pl-5 list-disc text-xs">
                            <li className={passwordCriteria.length ? "text-green-600" : ""}>
                              At least 6 characters
                            </li>
                            <li className={passwordCriteria.uppercase ? "text-green-600" : ""}>
                              At least one uppercase letter
                            </li>
                            <li className={passwordCriteria.lowercase ? "text-green-600" : ""}>
                              At least one lowercase letter
                            </li>
                            <li className={passwordCriteria.number ? "text-green-600" : ""}>
                              At least one number
                            </li>
                            <li className={passwordCriteria.symbol ? "text-green-600" : ""}>
                              At least one special character
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </FormItem>
                )} 
              />
            </div>
          </div>

          {/* Company Information Section */}
          <div className="space-y-6 pt-2">
            <h2 className="text-lg font-medium">Company Information</h2>
            
            <FormField 
              control={form.control} 
              name="companyName" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <div className="space-y-2">
              <FormLabel className="text-base">Preferred Company Domain name</FormLabel>
              
              <div className="flex">
                <FormField 
                  control={form.control} 
                  name="preferredDomain" 
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="yourdomain" {...field} className="h-12 rounded-r-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <div className="bg-gray-100 px-4 py-3 border border-l-0 border-gray-200 rounded-r-md flex items-center text-gray-500">
                  .manela.com
                </div>
              </div>
              
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                We will create a unique company URL for you to log into manela
              </p>
            </div>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-4 border-t border-gray-200">
          <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => navigate('/')}>
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            form="step-one-form" 
            className="flex-1 h-12 bg-[#1A1F2C] hover:bg-[#353e52] text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </Form>;
};

export default StepOne;
