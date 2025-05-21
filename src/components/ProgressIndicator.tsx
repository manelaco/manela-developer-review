
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            "h-1.5 rounded-full flex-1 transition-all duration-300",
            index < currentStep ? "bg-[#8B3A13]" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
