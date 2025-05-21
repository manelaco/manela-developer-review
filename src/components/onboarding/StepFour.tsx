import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ProgressIndicator from '../ProgressIndicator';
import { toast } from 'sonner';

interface ResourceOption {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

const StepFour: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<string>();
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([
    { 
      id: 'legal', 
      title: 'Legal requirements surrounding parental leave',
      description: 'I want to be kept up to date on what my company is legally required to do',
      selected: true 
    },
    { 
      id: 'tracking', 
      title: 'Tracking employees on leave',
      description: 'I want to be able to track leaves, return dates and email triggers',
      selected: false 
    },
    { 
      id: 'updates', 
      title: 'Keeping up to date on all things parental leave',
      description: 'I\'m interested in knowing what\'s occurring in news, media, and other companies',
      selected: false 
    },
    { 
      id: 'templates', 
      title: 'Ready-to-go templates',
      description: 'Leave contracts and agreements already company branded',
      selected: false 
    },
    { 
      id: 'backfilling', 
      title: 'Backfilling',
      description: 'Support in backfilling, contractual replacements',
      selected: false 
    },
    { 
      id: 'resources', 
      title: 'General Resources, tips and guidance',
      description: 'Support in backfilling, contractual replacements',
      selected: false 
    },
    { 
      id: 'reintegration', 
      title: 'Reintegration support',
      description: 'Guidance on how to retain and support returning parents',
      selected: false 
    }
  ]);

  const toggleOption = (id: string) => {
    setResourceOptions(resourceOptions.map(option => 
      option.id === id 
        ? { ...option, selected: !option.selected } 
        : option
    ));
  };

  const handleComplete = () => {
    // Store final selections
    localStorage.setItem('onboardingData', JSON.stringify({
      ...JSON.parse(localStorage.getItem('onboardingData') || '{}'),
      resources: resourceOptions.filter(resource => resource.selected).map(resource => resource.id),
      tenant: 'hr', // Ensure user is tagged as HR tenant
    }));
    
    toast.success('Onboarding completed successfully!');
    navigate('/dashboard');
  };

  const goBack = () => {
    navigate('/onboarding/step-three');
  };

  // Get domain name from local storage
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
  const domainName = onboardingData.preferredDomain 
    ? `${onboardingData.preferredDomain}.manela.com`
    : 'yourdomain.manela.com';

  if (context === "left") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">STEP 4 OF 4</p>
          <ProgressIndicator totalSteps={4} currentStep={4} />
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Your Domain Name</div>
          <div className="text-xl font-medium">{domainName}</div>
        </div>
        
        <div className="mt-14">
          <h1 className="text-4xl font-bold text-gray-900 pb-4 text-left">
            Which parental leave resources do you need most?
          </h1>
          
          <p className="text-gray-600 mb-8">
            We'll curate your toolkit so you always have what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="space-y-6 pt-14 overflow-y-auto pr-4 flex-1">
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Select your resources</h2>
          
          <div className="space-y-4">
            {resourceOptions.map(option => (
              <div
                key={option.id}
                className={`border ${option.selected ? 'border-[#8B3A13]' : 'border-gray-200'} rounded-lg p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => toggleOption(option.id)}
              >
                <Checkbox
                  checked={option.selected}
                  className="mt-1"
                />
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12"
          onClick={goBack}
        >
          Go Back
        </Button>
        
        <Button
          type="button"
          onClick={handleComplete}
          className="flex-1 h-12 bg-[#1A1F2C] hover:bg-[#353e52] text-white"
        >
          Complete
        </Button>
      </div>
    </div>
  );
};

export default StepFour;
