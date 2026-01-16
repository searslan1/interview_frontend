"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCandidateStore } from "@/store/candidateStore";
import { CandidateRow } from "./CandidateRow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from "lucide-react";
import type { Candidate, CandidateStatus } from "@/types/candidate";

interface CandidatePoolListProps {
  candidates?: Candidate[]; // Optional because data comes from store mostly
  isLoading?: boolean;      // Loading prop passed from page
  onSelectCandidate: (candidateId: string) => void; // Changed to accept ID
  onToggleFavorite?: (candidateId: string, currentStatus: boolean) => void; // Added for page control
}

export function CandidatePoolList({ 
  candidates: propCandidates,
  isLoading: propIsLoading,
  onSelectCandidate,
  onToggleFavorite
}: CandidatePoolListProps) {
  // Store'dan verileri çekiyoruz (prop olarak gelmediyse fallback)
  const {
    candidates: storeCandidates,
    isLoading: storeIsLoading,
    error,
    pagination,
    fetchCandidates,
    setPage,
    updateStatus,
  } = useCandidateStore();

  // Props varsa onları, yoksa store verilerini kullan
  const candidates = propCandidates || storeCandidates;
  const isLoading = propIsLoading !== undefined ? propIsLoading : storeIsLoading;

  // İlk yüklemede adayları getir (Eğer store verisi kullanılıyorsa)
  useEffect(() => {
    if (!propCandidates && candidates.length === 0) {
        fetchCandidates();
    }
  }, [fetchCandidates, propCandidates, candidates.length]);

  // Durum değiştirme handler
  const handleStatusChange = useCallback(async (candidateId: string, status: CandidateStatus) => {
    await updateStatus(candidateId, status);
  }, [updateStatus]);

  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // 1. Loading State
  if (isLoading && candidates.length === 0) {
    return <CandidateListSkeleton />;
  }

  // 2. Error State
  if (error && candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-background border rounded-lg border-dashed">
        <AlertCircle className="h-10 w-10 text-destructive mb-4 opacity-80" />
        <h3 className="text-lg font-semibold mb-2">Veriler Yüklenemedi</h3>
        <p className="text-muted-foreground text-center mb-4 max-w-sm">{error}</p>
        <Button onClick={() => fetchCandidates()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tekrar Dene
        </Button>
      </div>
    );
  }

  // 3. Empty State
  if (!isLoading && candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-background border rounded-lg border-dashed">
        <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aday Bulunamadı</h3>
        <p className="text-muted-foreground text-center max-w-sm text-sm">
          Arama kriterlerinize uygun aday bulunmuyor. Filtreleri temizlemeyi deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Liste Header & Toplam Sayı */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            Toplam <strong className="text-foreground">{pagination.total}</strong> aday listeleniyor
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Yükleniyor...
          </div>
        )}
      </div>

      {/* Aday Satırları */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate._id || candidate.id} // ID fallback
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <CandidateRow
                candidate={candidate}
                onSelect={() => onSelectCandidate(candidate.id || candidate._id)} // Pass ID
                onFavoriteToggle={(id) => {
                    if (onToggleFavorite) {
                        // ✅ Candidate objesinden isFavorite değerini kullan (backend'den geliyor)
                        onToggleFavorite(id, candidate.isFavorite ?? false);
                    }
                }}
                isFavorite={candidate.isFavorite ?? false} // ✅ Backend'den gelen değer
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls - Sadece store kullanılıyorsa göster */}
      {!propCandidates && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t gap-4">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Sayfa <strong>{pagination.currentPage}</strong> / {pagination.totalPages}
          </p>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1 || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers(pagination.currentPage, pagination.totalPages).map(
                (pageNum, idx) =>
                  pageNum === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.currentPage ? "default" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 ${pageNum === pagination.currentPage ? "" : "text-muted-foreground"}`}
                      onClick={() => handlePageChange(pageNum as number)}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  )
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Pagination Logic
function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 2) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// Skeleton Loader
function CandidateListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between px-1">
         <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border bg-card"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}