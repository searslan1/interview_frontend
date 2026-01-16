// src/app/(protected)/interviews/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewList } from "@/components/interview/interview-list"; // Dosya adı küçük harf olabilir kontrol et
import { FilterSection } from "@/components/interview/filter-section";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
import { ExtendDurationDialog } from "@/components/interview/ExtendDurationDialog"; 
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Interview } from "@/types/interview";

export default function InterviewsPage() {
  // --- MODAL & AKSİYON STATE'LERİ ---
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // --- FİLTRE STATE'İ (DÜZELTİLDİ) ---
  // 1. searchTerm artık zorunlu string (başlangıç değeri "")
  // 2. Tipler genel string yapıldı (FilterSection ve InterviewList ile uyumlu olması için)
  const [filters, setFilters] = useState<{
    sortBy: string;
    interviewType: string;
    status: string;
    searchTerm: string; // ❗Düzeltme: Soru işareti (?) kaldırıldı
  }>({
    sortBy: "newest",
    interviewType: "all",
    status: "all",
    searchTerm: "", // ❗Düzeltme: Başlangıç değeri boş string atandı
  });

  const { interviews, loading, error, fetchInterviews } = useInterviewStore();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // ----------------------------------------------------
  // 📌 AKSİYON İŞLEYİCİLERİ
  // ----------------------------------------------------
  
  const handleEdit = useCallback((interviewToEdit: Interview) => {
    setSelectedInterview(interviewToEdit);
    setIsEditDialogOpen(true); 
  }, []);

  const handleExtendDuration = useCallback((interviewToExtend: Interview) => {
    setSelectedInterview(interviewToExtend);
    setIsExtendDialogOpen(true);
  }, []);

  // --- GENEL MODAL YÖNETİMİ ---
  const handleDialogChangeFactory = (
    setOpenState: React.Dispatch<React.SetStateAction<boolean>>
  ) => (open: boolean) => {
    setOpenState(open);
    if (!open) {
      setSelectedInterview(null);
    }
  };

  const handleCreateDialogChange = handleDialogChangeFactory(setIsCreateDialogOpen);
  const handleEditDialogChange = handleDialogChangeFactory(setIsEditDialogOpen);
  const handleExtendDialogChange = handleDialogChangeFactory(setIsExtendDialogOpen);

  // ----------------------------------------------------

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    // Hata mesajı obje gelirse stringe çeviriyoruz
    const errorMessage = typeof error === 'string' ? error : 'Bilinmeyen bir hata oluştu';
    return <div className="text-red-500">Hata: {errorMessage}</div>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Mülakatlar</h1>
                <p className="text-sm text-muted-foreground mt-1">{interviews.length} mülakat</p>
              </div>
              <Button 
                onClick={() => handleCreateDialogChange(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
              >
                Yeni Mülakat Oluştur
              </Button>
            </div>

          <FilterSection filters={filters} onFilterChange={handleFilterChange} />

          {interviews.length > 0 ? (
            <InterviewList 
                interviews={interviews} 
                filters={filters} // Artık tipler uyuşuyor
                onEdit={handleEdit}
                onExtendDuration={handleExtendDuration}
            />
          ) : (
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">Henüz mülakat bulunmamaktadır.</p>
                <p className="text-gray-400 text-sm mt-2">Yeni bir mülakat oluşturarak başlayın.</p>
            </div>
          )}

          {/* 1. OLUŞTURMA/DÜZENLEME MODALI */}
          <CreateInterviewDialog 
            open={isCreateDialogOpen || isEditDialogOpen} 
            onOpenChange={isEditDialogOpen ? handleEditDialogChange : handleCreateDialogChange} 
            interviewToEdit={selectedInterview}
          />
          
          {/* 2. SÜRE UZATMA MODALI */}
          <ExtendDurationDialog 
             open={isExtendDialogOpen}
             onOpenChange={handleExtendDialogChange}
             interview={selectedInterview} 
          />

          </motion.div>
        </div>
      </main>
    </div>
  );
}