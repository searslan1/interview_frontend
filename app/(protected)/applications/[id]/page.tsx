"use client"

import { useParams } from "next/navigation";
import { CandidateDetailReview } from "@/components/candidate/candidate-detail-review";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react"; // Loader2 (Spinner) import edildi
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";
import { useApplicationAnalysisStatus } from "@/hooks/useApplicationAnalysisStatus"; // 🚀 Polling Hook'u import edildi



export default function CandidateDetailPage() {
  // useParams() kullanımı varsayımıyla id'yi alıyoruz
  const params = useParams();
  const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 1. Hook'u kullanarak başvuruyu çek ve durumu izle
  const { application, isLoading, isPolling, error } = useApplicationAnalysisStatus(applicationId);

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

  // ----------------------------------------------------
  // 2. YÜKLEME VE HATA DURUMLARI (GELENEKSEL VE POLLED)
  // ----------------------------------------------------

  if (isLoading) {
    // İlk yükleme (Henüz veri gelmedi)
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span className="text-lg">Başvuru detayları yükleniyor...</span>
      </div>
    );
  }

  if (error || !application) {
    // Veri gelmediyse veya hata varsa
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-red-600">
        Hata: Başvuru bulunamadı veya bir sorun oluştu.
      </div>
    );
  }
  
  // ----------------------------------------------------
  // 3. KRİTİK DURUM: AI ANALİZİ BEKLENİYOR (Awaiting Polling)
  // ----------------------------------------------------
  if (application.status === 'awaiting_ai_analysis') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Video Analizi Devam Ediyor</h1>
            <p className="text-gray-500 mb-4">
              Adayın video yanıtları şu anda arka planda BullMQ Worker'ları tarafından 
              harici Yapay Zeka sunucusuna gönderilerek analiz ediliyor.
            </p>
            <p className="text-sm text-gray-400">
              Durum 10 saniyede bir otomatik olarak kontrol ediliyor. Lütfen bekleyin.
              {isPolling && <span className="ml-2 font-medium text-blue-500">(Kontrol ediliyor...)</span>}
            </p>
            {/* Analiz tamamlandığında sayfa otomatik yenilenecektir (React Query sayesinde) */}
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. BAŞVURU İNCELENİYOR VEYA ANALİZ TAMAMLANDI (Normal Gösterim)
  // ----------------------------------------------------

 const toggleFavorite = () => {
    if (application) {
      if (isFavorite(application.id)) {
        removeFavorite(application.id);
      } else {
        addFavorite({
          id: application.id,
          name: application.candidate.name,
          position: application.experience?.[0]?.position || "Pozisyon Belirtilmemiş",
          score: application.generalAIAnalysis?.overallScore || 0,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{application.candidate.name} {application.candidate.surname}</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite(application.id) ? "text-yellow-400" : ""}
            >
              <Star className="h-6 w-6" />
            </Button>
          </div>
          {/* Mock data yerine gerçek application objesini gönderiyoruz */}
          <CandidateDetailReview application={application} /> 
          {/* NOT: CandidateDetailReview bileşeninin prop tipi Application tipini kabul edecek şekilde güncellenmelidir. */}
        </div>
      </main>
    </div>
  );
}

