"use client";

import { useEffect, useMemo } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Views
import { LandingView } from "@/components/public-application/views/LandingView";
import { AuthView } from "@/components/public-application/views/AuthView";
import { OtpView } from "@/components/public-application/views/OtpView";
import { WizardView } from "@/components/public-application/views/WizardView";
import { SystemCheckView } from "@/components/public-application/views/SystemCheckView";
import { ExamView } from "@/components/public-application/views/ExamView";
import { CompletedView } from "@/components/public-application/views/CompletedView";

interface PageProps {
  params: { id: string };
}

export default function ApplicationPage({ params }: PageProps) {
  const interviewId = params.id;

  const {
    currentStep,
    isLoading,
    error,
    interview,
    session,
    initInterview,
    reset,
  } = usePublicApplicationStore();

  // Interview verilerini çek
  useEffect(() => {
    if (interviewId) {
      initInterview(interviewId);
    }
  }, [interviewId, initInterview]);

  // İlk yükleme durumu
  const isInitialLoading = isLoading && !interview && !error;

  // Authenticated check
  const isAuthenticated = !!session?.token;

  // Step renderer
  const CurrentView = useMemo(() => {
    switch (currentStep) {
      case "landing":
        return <LandingView />;

      case "auth":
        return <AuthView />;

      case "otp":
        return <OtpView />;

      case "wizard-profile":
      case "wizard-docs":
        if (!isAuthenticated) return <AuthView />;
        return <WizardView step={currentStep} />;

      case "system-check":
        if (!isAuthenticated) return <AuthView />;
        return <SystemCheckView />;

      case "exam-intro":
      case "exam-active":
        if (!isAuthenticated) return <AuthView />;
        return <ExamView />;

      case "completed":
        return <CompletedView />;

      default:
        return <LandingView />;
    }
  }, [currentStep, isAuthenticated]);

  // Loading state
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Mülakat yükleniyor...
        </p>
      </div>
    );
  }

  // Error state
  if (error && !interview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Erişim Hatası</h1>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tekrar Dene
          </Button>
          <Button variant="ghost" onClick={reset}>
            Sıfırla
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Progress indicator - opsiyonel */}
      
      {/* Ana içerik */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {CurrentView}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-xs text-muted-foreground opacity-50">
        Secure Interview Platform &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
