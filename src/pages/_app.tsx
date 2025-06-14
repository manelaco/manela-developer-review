import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { testSupabaseConnection } from '@/lib/db';
import type { AppProps } from 'next/app';
import '@/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
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
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
} 