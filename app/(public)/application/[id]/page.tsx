"use client";

import { useEffect } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- VIEW COMPONENTS (Bir sonraki adımda oluşturacağız) ---
// Şimdilik hata vermemesi için yorum satırında veya placeholder olarak düşünün
import { LandingView } from "@/components/public-application/views/LandingView";
import { AuthView } from "@/components/public-application/views/AuthView";
import { WizardView } from "@/components/public-application/views/WizardView";
import { SystemCheckView } from "@/components/public-application/views/SystemCheckView";
import { ExamView } from "@/components/public-application/views/ExamView";
import { CompletedView } from "@/components/public-application/views/CompletedView";

interface PageProps {
  params: { id: string };
}

export default function ApplicationPage({ params }: PageProps) {
  const { 
    currentStep, 
    isLoading, 
    error, 
    initInterview,
    interview,
    isAuthenticated,
    resumeSession
  } = usePublicApplicationStore();

  const interviewId = params.id;

  // 1. BAŞLANGIÇ: Mülakat verilerini çek
  useEffect(() => {
    if (interviewId) {
      initInterview(interviewId);
    }
  }, [interviewId, initInterview]);

  // 2. LOADING DURUMU (Veri çekilirken)
  // Sadece ilk yüklemede tam ekran loading gösterelim.
  // Step geçişlerindeki ufak loadingleri view'lar kendi içinde halleder.
  if (isLoading && !interview && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Mülakat yükleniyor...</p>
      </div>
    );
  }

  // 3. HATA DURUMU (Mülakat bulunamadı / Süresi doldu vb.)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
           <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Erişim Hatası</h1>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  // 4. ROUTER (Akış Kontrolü)
  // Store'daki 'currentStep'e göre ilgili ekranı render et.
  const renderStep = () => {
    switch (currentStep) {
      case "landing":
        return <LandingView />;
      
      case "auth":
        return <AuthView />;
      
      case "wizard-profile":
      case "wizard-docs":
        // WizardView kendi içinde sekmeleri (Profile/Docs) yönetebilir
        // veya store'daki currentStep'e göre prop alabilir.
        return <WizardView step={currentStep} />;
      
      case "system-check":
        // Sadece giriş yapmış kullanıcılar görebilir
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
  };

  return (
    <div className="relative min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* İstersen buraya global bir 'ProgressBar' koyabilirsin.
        Mülakatın yüzde kaçının tamamlandığını gösterir.
      */}
      
      {/* Ana İçerik Alanı */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {renderStep()}
      </div>
      
      {/* Footer (Opsiyonel: "Powered by HR Tech" vb.) */}
      <footer className="absolute bottom-4 w-full text-center text-xs text-muted-foreground opacity-50">
        Secure Interview Platform &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}