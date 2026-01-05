"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCandidateStore } from "@/store/candidateStore";
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";
import { Header } from "@/components/Header";
import { 
  CandidateFilterBar, 
  CandidatePoolList, 
  CandidateDetailPanel 
} from "@/components/candidate/pool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, RefreshCw } from "lucide-react";
import type { Candidate } from "@/types/candidate";

export default function CandidatesPage() {
  const {
    candidates, // ✅ DÜZELTİLDİ: Store'da 'items' yok, 'candidates' var
    pagination,
    isLoading,
    fetchCandidates,
    fetchAvailablePositions,
  } = useCandidateStore();

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

  // Seçili aday (detay paneli için)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // İlk yükleme
  useEffect(() => {
    fetchCandidates();
    fetchAvailablePositions();
  }, [fetchCandidates, fetchAvailablePositions]);

  // Aday seçimi handler
  const handleSelectCandidate = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  }, []);

  // Detay paneli kapat
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCandidate(null), 300);
  }, []);

  // Favori toggle handler
  const handleFavoriteToggle = useCallback((candidateId: string) => {
    if (isFavorite(candidateId)) {
      removeFavorite(candidateId);
    } else {
      const candidate = candidates.find(c => c._id === candidateId);
      if (candidate) {
        addFavorite({
          id: candidate._id,
          name: `${candidate.name} ${candidate.surname}`,
          position: candidate.lastInterviewTitle || "Pozisyon Belirtilmemiş",
          score: candidate.scoreSummary?.avgOverallScore || 0,
        });
      }
    }
  }, [isFavorite, removeFavorite, addFavorite, candidates]);

  // ✅ DÜZELTİLDİ: Pagination objesindeki doğru key kullanıldı
  const stats = {
    total: pagination.total, // 'totalItems' veya 'total'
    favorites: favorites.length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <Header />
      <main className="container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Aday Havuzu (Talent Pool)</h1>
              <p className="text-muted-foreground mt-1">
                Tüm adayları tek bir merkezden yönetin, geçmiş verilerini inceleyin.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCandidates(1)} // Reset to page 1
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Listeyi Yenile
            </Button>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Toplam Aday</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                     <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.favorites}</p>
                    <p className="text-sm text-muted-foreground">Favorilerim</p>
                  </div>
                   <div className="h-12 w-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtre Bar */}
          <div className="space-y-4">
             {/* Filter Bar componenti store'a bağlı olmalı */}
             <CandidateFilterBar />
          </div>

          {/* Aday Listesi */}
          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle>Aday Listesi</CardTitle>
                    <CardDescription>
                        Arama kriterlerinize uygun adaylar listeleniyor
                    </CardDescription>
                 </div>
                 {/* Pagination özeti opsiyonel eklenebilir: 1-20 / 150 */}
              </div>
            </CardHeader>
            <CardContent className="p-0">
               {/* Liste bileşeni store'a bağlı çalışır veya props alır */}
              <CandidatePoolList onSelectCandidate={handleSelectCandidate} />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Aday Detay Paneli (Side Drawer) */}
      <CandidateDetailPanel
        candidate={selectedCandidate}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isFavorite={selectedCandidate ? isFavorite(selectedCandidate._id) : false}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
}