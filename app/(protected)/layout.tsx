"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DashboardHeader from "@/components/layout/SimpleHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import ProtectedErrorBoundary from "@/components/ProtectedErrorBoundary";
import ProtectedLoading from "./loading";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized, error } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration mismatch prevention
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (isMounted && isInitialized && !user && !isLoading) {
      console.log("🔒 Unauthorized access, redirecting to login");
      router.replace("/");
    }
  }, [user, isLoading, isInitialized, router, isMounted]);

  // Don't render on server or before mount
  if (!isMounted || !isInitialized) {
    return <ProtectedLoading />;
  }

  // Show loading state
  if (isLoading) {
    return <ProtectedLoading />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            {error}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => router.replace("/")} 
          variant="outline" 
          className="mt-4"
        >
          Giriş Sayfasına Dön
        </Button>
      </div>
    );
  }

  // User not authenticated - will be redirected by useEffect
  if (!user) {
    return null;
  }

  return (
    <ProtectedErrorBoundary>
      <div className="h-screen flex overflow-hidden gradient-bg relative">
        {/* Animated Background Elements */}
        <div className="blob w-[600px] h-[600px] bg-primary/20 rounded-full -top-40 -left-40 fixed" />
        <div className="blob w-[500px] h-[500px] bg-secondary/15 rounded-full -bottom-32 -right-32 fixed" style={{ animationDelay: '-4s' }} />
        <div className="blob w-[300px] h-[300px] bg-primary/10 rounded-full top-1/2 left-1/3 fixed" style={{ animationDelay: '-8s' }} />
        
        {/* Sidebar - Glass Effect */}
        <div className="hidden lg:block w-64 flex-shrink-0 relative z-20">
          <Sidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative z-10">
          {/* Fixed Header - Glass Effect */}
          <div className="flex-shrink-0">
            <DashboardHeader />
          </div>
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Suspense fallback={<ProtectedLoading />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </ProtectedErrorBoundary>
  );
}
