"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; 
import { Star, AlertCircle } from "lucide-react"; 

// Components
import { CandidateDetailReview } from "@/components/candidate/candidate-detail-review";

// Stores & Hooks
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";
import { useApplicationAnalysisStatus } from "@/hooks/useApplicationAnalysisStatus";

export default function CandidateDetailPage() {
  const params = useParams();
  // ID'yi güvenli bir şekilde alıyoruz
  const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 1. Hook ile veriyi çek (Polling desteği ile)
  // Bu hook arka planda 'awaiting_ai_analysis' durumunu kontrol etmeli
  const { application, isLoading, isPolling, error } = useApplicationAnalysisStatus(applicationId);

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

  // ----------------------------------------------------
  // 2. FAVORİ İŞLEMLERİ
  // ----------------------------------------------------
  const toggleFavorite = () => {
    if (!application) return;

    if (isFavorite(application._id)) {
      removeFavorite(application._id);
    } else {
      // Mülakat başlığını bulmaya çalışıyoruz, yoksa deneyimden, yoksa fallback
      let positionTitle = "Pozisyon Belirtilmemiş";
      
      if (typeof application.interviewId === 'object' && application.interviewId.title) {
        positionTitle = application.interviewId.title;
      } else if (application.experience && application.experience.length > 0) {
        positionTitle = application.experience[0].position;
      }

      addFavorite({
        id: application._id,
        name: `${application.candidate.name} ${application.candidate.surname}`,
        position: positionTitle,
        score: application.generalAIAnalysis?.overallScore || 0,
      });
    }
  };

  // ----------------------------------------------------
  // 3. DURUM YÖNETİMİ (UI STATE)
  // ----------------------------------------------------

  // A) Yükleniyor
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Aday detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  // B) Hata veya Veri Yok
  if (error || !application) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-destructive">
          <AlertCircle className="h-12 w-12" />
          <h2 className="text-xl font-semibold">Başvuru Bulunamadı</h2>
          <p className="text-muted-foreground">İstediğiniz başvuruya ulaşılamıyor veya yetkiniz yok.</p>
        </div>
      </div>
    );
  }
  
  // C) AI Analizi Bekleniyor (Polling Ekranı)
  if (application.status === 'awaiting_ai_analysis' || application.status === 'awaiting_video_responses') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md space-y-6">
            <div className="relative mx-auto w-16 h-16">
               <LoadingSpinner size="lg" className="text-primary" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {application.status === 'awaiting_video_responses' 
                  ? 'Video Yüklemesi Bekleniyor' 
                  : 'Yapay Zeka Analizi Yapılıyor'}
              </h1>
              <p className="text-muted-foreground">
                {application.status === 'awaiting_video_responses'
                  ? 'Aday henüz tüm videolarını yüklemedi.'
                  : 'Video yanıtları yapay zeka tarafından analiz ediliyor. Bu işlem videonun uzunluğuna göre 1-2 dakika sürebilir.'}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
              <p>
                Durum otomatik olarak kontrol ediliyor...
                {isPolling && <span className="ml-2 font-medium text-primary animate-pulse">(Güncelleniyor)</span>}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // D) Normal Görünüm (Detay Sayfası)
  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />
      
      <main className="container mx-auto px-4 pt-8">
        {/* Üst Başlık ve Aksiyonlar */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {application.candidate.name} {application.candidate.surname}
            </h1>
            <p className="text-muted-foreground mt-1">
              {typeof application.interviewId === 'object' ? application.interviewId.title : 'Mülakat Başvurusu'}
            </p>
          </div>
          
          <Button
            variant={isFavorite(application._id) ? "secondary" : "outline"}
            size="icon"
            onClick={toggleFavorite}
            title={isFavorite(application._id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          >
            <Star 
              className={`h-5 w-5 ${isFavorite(application._id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} 
            />
          </Button>
        </div>

        {/* Detay Bileşeni */}
        {/* ÖNEMLİ: Bu bileşen yeni 'Application' tipini kabul etmeli */}
        <CandidateDetailReview application={application} /> 
      </main>
    </div>
  );
}