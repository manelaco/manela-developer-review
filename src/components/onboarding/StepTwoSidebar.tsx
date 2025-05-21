import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from '../ProgressIndicator';

interface StepTwoSidebarProps {
  domainName: string;
}

const StepTwoSidebar: React.FC<StepTwoSidebarProps> = ({ domainName }) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">STEP 2 OF 4</p>
        <ProgressIndicator totalSteps={4} currentStep={2} />
      </div>
      
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">Your Domain Name</div>
        <div className="text-xl font-medium">{domainName}</div>
      </div>
      
      <div className="mt-14">
        <h1 className="text-4xl font-bold text-gray-900 pb-4 text-left">
          Let's get to know you better
        </h1>
        
        <p className="text-gray-600 mb-8">
          This data is needed so that we can easily provide solutions according to your company's capacity
        </p>
      </div>
    </div>
  );
};

export default StepTwoSidebar;
