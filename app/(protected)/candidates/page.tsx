"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCandidateStore } from "@/store/candidateStore";
import { 
  CandidateFilterBar, 
  CandidatePoolList, 
  CandidateDetailPanel 
} from "@/components/candidate/pool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function CandidatesPage() {
  // ✅ Store'dan gerekli tüm verileri ve aksiyonları çekiyoruz
  const {
    candidates, 
    selectedCandidate, // Detay verisi (CV dahil)
    pagination,
    isLoading,         // Liste yükleniyor mu?
    isLoadingDetail,   // Detay yükleniyor mu?
    error,
    fetchCandidates,
    fetchCandidateById,
    fetchAvailablePositions,
    addToFavorites,
    removeFromFavorites,
    clearSelectedCandidate
  } = useCandidateStore();

  // Panel kontrolü (UI State)
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 1. İlk Yükleme
  useEffect(() => {
    fetchCandidates();
    fetchAvailablePositions();
  }, [fetchCandidates, fetchAvailablePositions]);

  // 2. Aday Seçimi Handler (Full Detay Çekme)
  const handleSelectCandidate = useCallback(async (candidateId: string) => {
    setIsDetailOpen(true);
    // Backend'den full detay (CV, Eğitim vb.) çekilir
    await fetchCandidateById(candidateId);
  }, [fetchCandidateById]);

  // 3. Detay Paneli Kapatma
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    // Panel kapandıktan kısa süre sonra store'daki seçimi temizle (Animasyon için bekle)
    setTimeout(() => {
        clearSelectedCandidate();
    }, 300);
  }, [clearSelectedCandidate]);

  // 4. Favori Toggle Handler (Backend Entegreli)
  const handleFavoriteToggle = useCallback(async (candidateId: string, currentStatus: boolean) => {
    if (currentStatus) {
      await removeFromFavorites(candidateId);
    } else {
      await addToFavorites(candidateId);
    }
    // Listeyi yenilemeye gerek yok, Store optimistic update yapıyor
  }, [addToFavorites, removeFromFavorites]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <main className="container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Aday Havuzu (Talent Pool)</h1>
              <p className="text-muted-foreground mt-1">
                Tüm adayları tek bir merkezden yönetin, AI analizlerini ve geçmiş verilerini inceleyin.
              </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCandidates(1)}
                disabled={isLoading}
                >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Yenile
                </Button>
            </div>
          </div>

          {/* Hata Bildirimi */}
          {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{pagination.total}</p>
                    <p className="text-sm text-muted-foreground">Toplam Aday</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                     <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Buraya "Aktif Süreç", "Teklif Bekleyen" gibi diğer istatistikler eklenebilir */}
          </div>

          {/* Filtre Bar */}
          <div className="space-y-4">
             {/* Store'a bağlı filtre bileşeni */}
             <CandidateFilterBar />
          </div>

          {/* Aday Listesi */}
          <Card className="min-h-[500px]">
            <CardHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Aday Listesi</CardTitle>
                    <CardDescription>
                        {pagination.total > 0 
                            ? `${pagination.total} aday arasından listeleniyor`
                            : "Kriterlere uygun aday bulunamadı"}
                    </CardDescription>
                </div>
                {/* Pagination Özeti */}
                <div className="text-sm text-muted-foreground">
                    Sayfa {pagination.page} / {pagination.totalPages || 1}
                </div>
            </CardHeader>
            <CardContent className="p-0">
               {/* ✅ Liste Bileşeni: 
                  - Store'daki candidates verisini kullanacak (veya props ile alacak)
                  - ID tıklanınca handleSelectCandidate(id) çağıracak
               */}
              <CandidatePoolList 
                candidates={candidates}
                isLoading={isLoading}
                onSelectCandidate={handleSelectCandidate} 
                onToggleFavorite={handleFavoriteToggle}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Aday Detay Paneli (Side Drawer) */}
      <CandidateDetailPanel
        candidate={selectedCandidate} // Store'dan gelen FULL detaylı aday
        isOpen={isDetailOpen}
        isLoading={isLoadingDetail}   // Yükleniyor durumu
        onClose={handleCloseDetail}
        onFavoriteToggle={() => {
            if (selectedCandidate) {
                handleFavoriteToggle(selectedCandidate.id || selectedCandidate._id, selectedCandidate.isFavorite);
            }
        }}
      />
    </div>
  );
}