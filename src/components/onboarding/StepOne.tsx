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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Check, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: 'Full name is required'
  }),
  companyEmail: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string()
    .min(12, { message: 'Password must be at least 12 characters' })
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
  const [authMethod, setAuthMethod] = useState<'password' | 'google' | 'outlook'>('password');
  const [authInProgress, setAuthInProgress] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });
  
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

  const handleGoogleAuth = () => {
    setAuthInProgress(true);
    // Simulate authentication process
    setTimeout(() => {
      toast({
        title: "Google Workspace Authentication",
        description: "Successfully authenticated with Google Workspace",
      });
      setAuthInProgress(false);
    }, 1500);
  };
  
  const handleOutlookAuth = () => {
    setAuthInProgress(true);
    // Simulate authentication process
    setTimeout(() => {
      toast({
        title: "Microsoft Outlook Authentication",
        description: "Successfully authenticated with Microsoft Outlook",
      });
      setAuthInProgress(false);
    }, 1500);
  };

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  const onSubmit = (data: FormValues) => {
    // Store in localStorage for persistence across steps
    localStorage.setItem('onboardingData', JSON.stringify({
      ...JSON.parse(localStorage.getItem('onboardingData') || '{}'),
      fullName: data.fullName,
      companyEmail: data.companyEmail,
      authMethod,
      password: authMethod === 'password' ? data.password : undefined,
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
              <FormLabel className="text-base">Account Creation Method *</FormLabel>
              
              <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'password' | 'google' | 'outlook')}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                  <TabsTrigger value="outlook">Outlook</TabsTrigger>
                </TabsList>
                
                <TabsContent value="password" className="space-y-2">
                  <FormField 
                    control={form.control} 
                    name="password" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Create Password</FormLabel>
                        <FormControl>
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
                                  At least 12 characters (14+ recommended)
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
                </TabsContent>
                
                <TabsContent value="google" className="p-4 border rounded-md">
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 flex items-center justify-center gap-2"
                      onClick={handleGoogleAuth}
                      disabled={authInProgress}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                      </svg>
                      Continue with Google Workspace
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Connect your Google Workspace account now
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="outlook" className="p-4 border rounded-md">
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 flex items-center justify-center gap-2"
                      onClick={handleOutlookAuth}
                      disabled={authInProgress}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
                        <path d="M23 3v6.75l-9.5 3.365V3H23zm-9.5 10.738L23 17.25V24h-9.5v-10.262zm2.5-3.878v2.378l4.5-1.598V6.596L16 8.215zM0 0h14v18H0V0z" fill="#0364B8"/>
                      </svg>
                      Continue with Microsoft Outlook
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Connect your Microsoft Outlook account now
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
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
