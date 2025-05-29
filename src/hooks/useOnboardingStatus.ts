import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useOnboardingStatus(userId: string | undefined) {
  const [status, setStatus] = useState<'loading' | 'complete' | 'incomplete' | 'error'>('loading');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setStatus('error');
      setError('No user ID');
      return;
    }
    setStatus('loading');
    supabase
      .from('user_profiles')
      .select('onboarding_complete, current_onboarding_step')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setStatus('error');
          setError(error.message);
          console.error('Onboarding status fetch error:', error);
        } else if (data?.onboarding_complete) {
          setStatus('complete');
          setCurrentStep(4);
        } else {
          setStatus('incomplete');
          setCurrentStep(data?.current_onboarding_step || 1);
        }
      });
  }, [userId]);

  return { status, currentStep, error };
} 