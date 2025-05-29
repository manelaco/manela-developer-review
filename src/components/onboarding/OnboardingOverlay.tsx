import React, { useState } from 'react';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [StepTwo, StepThree, StepFour];

const OnboardingOverlay: React.FC = () => {
  const [step, setStep] = useState(0);
  const StepComponent = steps[step];

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[10000] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl min-w-[360px] max-w-[480px] w-full p-8 relative">
        <StepComponent />
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          {step > 0 && (
            <Button 
              variant="outline" 
              onClick={goBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button 
              onClick={goNext}
              className="flex items-center gap-2 ml-auto"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay; 