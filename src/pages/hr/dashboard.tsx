import { useEffect } from 'react';
import { useRouter } from 'next/router';
import HRDashboard from '@/pages/hr/dashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function HRDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'hr_admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'hr_admin') {
    return null;
  }

  return <HRDashboard />;
} 