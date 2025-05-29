import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';

const platformOptions = [
  { id: 'hr_toolkit', label: 'HR Toolkit', description: 'Comprehensive HR management suite with employee records, benefits, and compliance tools.' },
  { id: 'employee_support', label: 'Employee Support Center', description: 'Self-service portal for employees to access resources and submit requests.' }
];

const needsOptions = [
  { id: 'legal', label: 'Legal Requirements', description: 'Stay updated on legal requirements for parental leave.' },
  { id: 'tracking', label: 'Employee Tracking', description: 'Track leaves, return dates, and set up reminders.' },
  { id: 'templates', label: 'Templates', description: 'Ready-to-use branded documents and agreements.' },
  { id: 'backfilling', label: 'Backfilling Support', description: 'Resources for temporary replacements and coverage.' },
  { id: 'resources', label: 'General Resources', description: 'Tips, guides, and best practices for parental leave.' },
  { id: 'reintegration', label: 'Reintegration Support', description: 'Help returning employees transition back successfully.' }
];

interface OnboardingModalProps {
  userId: string;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePlatformToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNeedsToggle = (id: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    setLoading(true);
    // Save platform selection to onboarding_users or user_profiles
    await supabase
      .from('onboarding_users')
      .update({ platforms: selectedPlatforms })
      .eq('user_id', userId);
    setLoading(false);
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    // Save needs/interests and mark onboarding as complete
    await supabase
      .from('onboarding_users')
      .update({ resources: selectedNeeds })
      .eq('user_id', userId);
    await supabase
      .from('user_profiles')
      .update({ onboarding_complete: true, current_onboarding_step: 3 })
      .eq('id', userId);
    setLoading(false);
    onComplete();
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Choose Platform Access' : 'Choose According to Your Needs'}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Progress value={step === 1 ? 50 : 100} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">Step {step} of 2</div>
        </div>
        {step === 1 && (
          <div className="space-y-4">
            {platformOptions.map((opt) => (
              <label key={opt.id} className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={selectedPlatforms.includes(opt.id)}
                  onCheckedChange={() => handlePlatformToggle(opt.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.description}</div>
                </div>
              </label>
            ))}
            <Button
              className="w-full mt-4"
              onClick={handleNext}
              disabled={loading}
            >
              Continue
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            {needsOptions.map((opt) => (
              <label key={opt.id} className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={selectedNeeds.includes(opt.id)}
                  onCheckedChange={() => handleNeedsToggle(opt.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.description}</div>
                </div>
              </label>
            ))}
            <Button
              className="w-full mt-4"
              onClick={handleFinish}
              disabled={loading}
            >
              Finish & Enter Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal; 