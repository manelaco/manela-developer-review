
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<Navigate to="step-one" replace />} />
            <Route path="step-one" element={<StepOne />} />
            <Route path="step-two" element={<StepTwo />} />
            <Route path="step-three" element={<StepThree />} />
            <Route path="step-four" element={<StepFour />} />
          </Route>
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
