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
import { supabase } from '@/lib/supabaseClient';

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
    ),
  companyName: z.string().min(1, {
    message: 'Company name is required'
  }),
  role: z.string().min(1, {
    message: 'Role is required'
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
      role: ''
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

  // Utility: Fuzzy match or create company
  const findOrCreateCompany = async (companyName: string, generatedDomain: string) => {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${companyName}%`);
    if (error) throw error;
    if (companies && companies.length > 0) {
      return companies[0];
    } else {
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName, domain: generatedDomain, status: 'active' }])
        .select()
        .single();
      if (companyError) throw companyError;
      return newCompany;
    }
  };

  // Utility: Find or create role
  const findOrCreateRole = async (roleName: string) => {
    let { data: role } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();
    if (!role) {
      const { data: newRole, error } = await supabase
        .from('roles')
        .insert([{ name: roleName }])
        .select()
        .single();
      if (error) throw error;
      role = newRole;
    }
    return role.id;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Validate password before proceeding
      if (!validatePassword(data.password)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please ensure your password meets all requirements"
        });
        return;
      }
      const generatedDomain = data.companyName.replace(/\s+/g, '').toLowerCase();
      // 1. Fuzzy match or create company
      const company = await findOrCreateCompany(data.companyName, generatedDomain);
      // 2. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.companyEmail,
        password: data.password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');
      const userId = authData.user.id;
      // 3. Find or create role
      const roleId = await findOrCreateRole(data.role);
      // 4. Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: userId,
          full_name: data.fullName,
          company_id: company.id,
          role_id: roleId,
          onboarding_complete: false,
          current_onboarding_step: 1,
          created_at: new Date().toISOString()
        }]);
      if (profileError) throw profileError;
      // 5. Link user to company
      const { error: linkError } = await supabase
        .from('company_users')
        .insert([{
          company_id: company.id,
          user_id: userId,
          role: data.role
        }]);
      if (linkError) throw linkError;
      // 6. Store onboarding data in localStorage
      localStorage.setItem('onboardingData', JSON.stringify({
        fullName: data.fullName,
        companyEmail: data.companyEmail,
        companyName: data.companyName,
        companyId: company.id,
        userId,
        role: data.role,
        roleId
      }));
      toast({
        title: "Success",
        description: "Account created successfully!"
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again."
      });
    }
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
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submitted');
            form.handleSubmit(onSubmit)(e);
          }} 
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
              <FormLabel className="text-base">Role *</FormLabel>
              
              <div className="flex">
                <FormField 
                  control={form.control} 
                  name="role" 
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Select role" {...field} className="h-12 rounded-r-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
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
            onClick={() => {
              console.log('Continue button clicked');
              form.handleSubmit(onSubmit)();
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </Form>;
};

export default StepOne;
