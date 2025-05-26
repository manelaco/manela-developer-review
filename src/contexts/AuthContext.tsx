import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'superadmin' | 'hr_admin' | 'employee';

interface User {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isSuperadmin: boolean;
  isHRAdmin: boolean;
  isEmployee: boolean;
  viewAsCompany: (companyId: string) => void;
  stopViewingAsCompany: () => void;
  viewedCompanyId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewedCompanyId, setViewedCompanyId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual authentication with your backend
      // For now, we'll use mock data
      const mockUser: User = {
        id: '1',
        email,
        role: email.includes('admin@manela.com') ? 'superadmin' : 'hr_admin',
        companyId: email.includes('admin@manela.com') ? undefined : '1',
        companyName: email.includes('admin@manela.com') ? undefined : 'Test Company',
        fullName: 'Test User'
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirect based on role
      if (mockUser.role === 'superadmin') {
        navigate('/superadmin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setViewedCompanyId(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const viewAsCompany = (companyId: string) => {
    setViewedCompanyId(companyId);
    // Log this action
    console.log(`Superadmin viewing as company: ${companyId}`);
  };

  const stopViewingAsCompany = () => {
    setViewedCompanyId(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isSuperadmin: user?.role === 'superadmin',
    isHRAdmin: user?.role === 'hr_admin',
    isEmployee: user?.role === 'employee',
    viewAsCompany,
    stopViewingAsCompany,
    viewedCompanyId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 