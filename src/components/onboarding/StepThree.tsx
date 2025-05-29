import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProgressIndicator from '../ProgressIndicator';
import { MinusIcon, PlusIcon, InfoIcon } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/lib/supabaseClient';

interface PlatformOption {
  id: string;
  name: string;
  description: string;
  seats: number;
  selected: boolean;
}
const StepThree: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<string>();
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([{
    id: 'hr-toolkit',
    name: 'Human Resource Toolkit',
    description: 'Comprehensive HR management suite with employee records, benefits administration, and compliance tools.',
    seats: 1,
    selected: true
  }, {
    id: 'employee-support',
    name: 'Employee support center',
    description: 'Self-service portal for employees to access resources, submit requests, and view company policies.',
    seats: 0,
    selected: false
  }]);
  const toggleOption = (id: string) => {
    setPlatformOptions(platformOptions.map(option => option.id === id ? {
      ...option,
      selected: !option.selected
    } : option));
  };
  const updateSeats = (id: string, increment: boolean) => {
    setPlatformOptions(platformOptions.map(option => option.id === id ? {
      ...option,
      seats: increment ? option.seats + 1 : Math.max(0, option.seats - 1)
    } : option));
  };
  const handleContinue = async () => {
    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      // Update current step in user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ current_onboarding_step: 3 })
        .eq('id', onboardingData.userId);

      if (updateError) throw updateError;

      // Store in localStorage for persistence across steps
      localStorage.setItem('onboardingData', JSON.stringify({
        ...onboardingData,
        platforms: platformOptions
      }));
      
      navigate('/onboarding/step-four');
    } catch (error) {
      console.error('Error saving step three data:', error);
      toast.error('Failed to save information. Please try again.');
    }
  };
  const goBack = () => {
    navigate('/onboarding/step-two');
  };

  // Get domain name from local storage
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
  const domainName = onboardingData.preferredDomain ? `${onboardingData.preferredDomain}.manela.com` : 'yourdomain.manela.com';
  if (context === "left") {
    return <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">STEP 3 OF 4</p>
          <ProgressIndicator totalSteps={4} currentStep={3} />
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Your Domain Name</div>
          <div className="text-xl font-medium">{domainName}</div>
        </div>
        
        <div className="mt-14">
          <h1 className="text-4xl font-bold text-gray-900 pb-4 text-left">
            Which support centers are you looking for?
          </h1>
          
          <p className="text-gray-600 mb-8">
            You can choose either one or both platforms to support your companies needs.
          </p>
        </div>
      </div>;
  }
  return <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="space-y-6 pt-14 overflow-y-auto pr-4 flex-1">
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Choose platform access</h2>
          <div className="space-y-6">
            {platformOptions.map(option => <div key={option.id} className={`border ${option.selected ? 'border-[#8B3A13]' : 'border-gray-200'} rounded-lg p-4 flex flex-col cursor-pointer`} onClick={() => toggleOption(option.id)}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${option.selected ? 'bg-[#8B3A13]' : 'border border-gray-300'}`}>
                      {option.selected && <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.33333 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}
                    </div>
                    <span className="font-medium">{option.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Seats:</span>
                    <Button type="button" variant="outline" size="icon" className="w-8 h-8 p-0" onClick={e => {
                  e.stopPropagation();
                  updateSeats(option.id, false);
                }} disabled={!option.selected || option.seats === 0}>
                      <MinusIcon size={16} />
                    </Button>
                    <span className="w-6 text-center">{option.seats}</span>
                    <Button type="button" variant="outline" size="icon" className="w-8 h-8 p-0" onClick={e => {
                  e.stopPropagation();
                  updateSeats(option.id, true);
                }} disabled={!option.selected}>
                      <PlusIcon size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{option.description}</p>
              </div>)}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 text-gray-700 text-sm">Seats can be added or removed in your account settings. </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
          <InfoIcon size={14} />
          Seats are the number of independent users who will have access to each platform. If you're not sure right now you can always change it later.
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-4 border-t border-gray-200">
        <Button type="button" variant="outline" className="flex-1 h-12" onClick={goBack}>
          Go Back
        </Button>
        <Button type="button" onClick={handleContinue} className="flex-1 h-12 bg-[#1A1F2C] hover:bg-[#353e52] text-white">
          Continue
        </Button>
      </div>
    </div>;
};
export default StepThree;