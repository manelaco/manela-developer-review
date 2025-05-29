import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingLayout from "./components/OnboardingLayout";
import StepOne from "./components/onboarding/StepOne";
import StepTwo from "./components/onboarding/StepTwo";
import StepThree from "./components/onboarding/StepThree";
import StepFour from "./components/onboarding/StepFour";
import Dashboard from "./components/dashboard/Dashboard";
import SuperAdminDashboard from "./components/superadmin/SuperAdminDashboard";
import { useEffect } from 'react';
import { testSupabaseConnection } from './lib/db';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        await testSupabaseConnection();
      } catch (error) {
        console.error('Failed to connect to Supabase:', error);
      }
    };
    testConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route index element={<Navigate to="step-one" replace />} />
                <Route path="step-one" element={<StepOne />} />
                <Route path="step-two" element={<StepTwo />} />
                <Route path="step-three" element={<StepThree />} />
                <Route path="step-four" element={<StepFour />} />
              </Route>
              
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute allowedRoles={['hr_admin', 'employee']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/superadmin/*" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
