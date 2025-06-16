import React, { createContext, useContext, useState, useEffect } from 'react';
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
      // Check for admin credentials from environment variables
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
          password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        const mockUser: User = {
          id: '1',
          email,
          role: 'superadmin',
          fullName: 'Super Admin'
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        window.location.assign('/superadmin');
      } else {
        throw new Error('Invalid credentials');
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
    window.location.assign('/');
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