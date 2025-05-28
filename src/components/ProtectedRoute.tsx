import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (
    allowedRoles.length > 0 &&
    user &&
    !(
      allowedRoles.includes(user.role) ||
      (user.role === 'superadmin' && user.viewedCompanyId)
    )
  ) {
    // Redirect to appropriate dashboard if role not allowed
    return <Navigate to={user.role === 'superadmin' ? '/superadmin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 