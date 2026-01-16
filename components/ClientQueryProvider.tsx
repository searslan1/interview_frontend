"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/components/AuthProvider";

/**
 * React Query Provider
 * 
 * Best Practices:
 * - SSR-safe initialization with useState
 * - Optimized caching strategies
 * - Error/retry handling
 * - Development devtools
 * - Auth state management with AuthProvider
 */
export default function ClientQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache & Stale Time
            staleTime: 5 * 60 * 1000, // 5 dakika - veri "taze" kabul edilir
            gcTime: 30 * 60 * 1000,   // 30 dakika - garbage collection süresi (eski cacheTime)
            
            // Refetch Behavior
            refetchOnWindowFocus: false,      // Pencere odaklanınca yenileme
            refetchOnReconnect: true,         // İnternet bağlantısı geri gelince
            refetchOnMount: true,             // Component mount olunca
            
            // Retry Strategy
            retry: (failureCount, error: any) => {
              // 404 ve 401 hatalarında retry yapma
              if (error?.response?.status === 404) return false;
              if (error?.response?.status === 401) return false;
              // Maksimum 3 retry
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Network Mode
            networkMode: "offlineFirst", // Önce cache'den, sonra network
          },
          mutations: {
            // Mutation Retry
            retry: 1,
            retryDelay: 1000,
            
            // Network Mode
            networkMode: "online",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      {/* Development ortamında devtools göster */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
