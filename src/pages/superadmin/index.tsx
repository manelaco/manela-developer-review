import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SuperAdminDashboard from '@/components/superadmin/SuperAdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'superadmin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'superadmin') {
    return null;
  }

  return <SuperAdminDashboard />;
} 