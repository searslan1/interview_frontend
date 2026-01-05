"use client";

import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  PartyPopper,
  ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";

export function CompletedView() {
  const { uploadQueue, resetSession } = usePublicApplicationStore();
  
  // Kuyrukta bekleyen dosya var mı?
  const isSyncing = uploadQueue.length > 0;

  // Syncing durumunda kullanıcı sayfayı kapatmaya çalışırsa uyar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSyncing) {
        e.preventDefault();
        e.returnValue = ""; // Tarayıcı standart uyarısını tetikler
      }
    };

    if (isSyncing) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSyncing]);

  // --- MODE 1: YÜKLEME BEKLENİYOR ---
  if (isSyncing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] fade-in animate-in zoom-in-95">
        <Card className="max-w-md w-full text-center border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/50">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
               <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
            </div>
            <CardTitle className="text-yellow-700 dark:text-yellow-500">
              Yükleme Devam Ediyor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cevaplarınız sunucularımıza güvenli bir şekilde aktarılıyor. 
              <br />
              <strong>{uploadQueue.length}</strong> adet video kaldı.
            </p>
            
            <Alert variant="destructive" className="bg-white dark:bg-black/20 border-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Uyarı</AlertTitle>
              <AlertDescription>
                Lütfen işlem bitene kadar bu sayfayı veya tarayıcıyı <strong>kapatmayınız</strong>.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- MODE 2: BAŞARI (TEŞEKKÜRLER) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] fade-in animate-in zoom-in-95">
      <Card className="max-w-lg w-full text-center shadow-2xl border-green-100 dark:border-green-900/30">
        <CardHeader>
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
             <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Tebrikler!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Video mülakat sürecini başarıyla tamamladınız.
          </p>

          <div className="bg-muted/50 p-6 rounded-xl text-left space-y-3">
             <div className="flex items-start gap-3">
                <PartyPopper className="h-5 w-5 text-primary mt-0.5" />
                <div>
                   <h4 className="font-semibold text-sm">Başvurunuz Alındı</h4>
                   <p className="text-xs text-muted-foreground">Tüm yanıtlarınız ve belgeleriniz sistemimize kaydedildi.</p>
                </div>
             </div>
             
             <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                   <h4 className="font-semibold text-sm">Yapay Zeka Analizi</h4>
                   <p className="text-xs text-muted-foreground">Cevaplarınız AI tarafından analiz edilecek ve İK ekibine raporlanacaktır.</p>
                </div>
             </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-8">
           {/* Oturumu temizle ve ana sayfaya dön (opsiyonel) */}
           <Button 
             variant="outline" 
             onClick={() => {
                resetSession();
                window.location.href = "/"; // Veya şirketin kariyer sayfasına
             }}
           >
             Çıkış Yap
           </Button>
        </CardFooter>
      </Card>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Bize zaman ayırdığınız için teşekkür ederiz.</p>
      </footer>
    </div>
  );
}