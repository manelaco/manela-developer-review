import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
};

export default HRDashboard; 