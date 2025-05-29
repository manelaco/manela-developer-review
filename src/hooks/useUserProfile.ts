import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<{ company_id?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (error) {
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  return { ...profile, loading };
} 