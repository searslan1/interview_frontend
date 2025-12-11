// src/app/(protected)/interviews/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewList } from "@/components/interview/interview-list";
import { FilterSection } from "@/components/interview/filter-section";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
// 📌 DÜZELTME 1: Süre Uzatma Modalı import edildi
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

  // --- FİLTRE STATE'İ ---
  const [filters, setFilters] = useState<{
    sortBy: "newest" | "oldest";
    interviewType: "all" | "technical" | "behavioral" | "personality";
    status: "all" | "active" | "completed" | "draft" | "published" | "inactive";
    searchTerm?: string;
  }>({
    sortBy: "newest",
    interviewType: "all",
    status: "all",
    searchTerm: "",
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
    setIsExtendDialogOpen(true); // Süre uzatma modalını aç
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
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Mülakatlar</h1>
            <Button onClick={() => handleCreateDialogChange(true)}>Yeni Mülakat Oluştur</Button>
          </div>

          <FilterSection filters={filters} onFilterChange={handleFilterChange} />

          {interviews.length > 0 ? (
            <InterviewList 
                interviews={interviews} 
                filters={filters} 
                onEdit={handleEdit}
                onExtendDuration={handleExtendDuration}
            />
          ) : (
            <p className="text-gray-500">Henüz mülakat bulunmamaktadır.</p>
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
             interview={selectedInterview} // Seçili mülakatı gönder
          />

        </motion.div>
      </main>
    </div>
  );
}