import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

export function useOnboardingStatus(userId: string | undefined, companyId: string | undefined) {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId || !companyId) return;

    const checkOnboarding = async () => {
      const { data, error } = await supabase
        .from('onboarding_users')
        .select('id')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) {
        setIsComplete(false);
        return;
      }
      setIsComplete(!!data);
    };

    checkOnboarding();
  }, [userId, companyId]);

  return isComplete;
} 