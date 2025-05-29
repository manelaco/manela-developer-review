import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

export function useOnboardingStatus(userId: string | undefined) {
  const [status, setStatus] = useState<'loading' | 'complete' | 'incomplete' | 'error'>('loading');
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
      .select('onboarding_complete')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setStatus('error');
          setError(error.message);
          console.error('Onboarding status fetch error:', error);
        } else if (data?.onboarding_complete) {
          setStatus('complete');
        } else {
          setStatus('incomplete');
        }
      });
  }, [userId]);

  return { status, error };
} 