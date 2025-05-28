import React, { useState } from 'react';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';

const steps = [StepTwo, StepThree, StepFour];

const OnboardingOverlay: React.FC = () => {
  const [step, setStep] = useState(0);
  const StepComponent = steps[step];

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(30, 32, 38, 0.85)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        minWidth: 360,
        maxWidth: 480,
        width: '100%',
        padding: 32,
        position: 'relative',
      }}>
        <StepComponent />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {step > 0 && <button onClick={goBack}>Back</button>}
          {step < steps.length - 1 && <button onClick={goNext}>Next</button>}
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay; 