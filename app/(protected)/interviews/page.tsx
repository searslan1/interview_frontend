"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewList } from "@/components/interview/interview-list";
import { FilterSection } from "@/components/interview/filter-section";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function InterviewsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ✅ Varsayılan `filters` değerini belirledik.
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

  // ✅ `useEffect` içinde gereksiz bağımlılık kaldırıldı
  useEffect(() => {
    fetchInterviews();
  }, []); // Bağımlılık listesi boş bırakıldı (sadece 1 kez çağrılacak)

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

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
            <Button onClick={() => setIsCreateDialogOpen(true)}>Yeni Mülakat Oluştur</Button>
          </div>

          <FilterSection filters={filters} onFilterChange={handleFilterChange} />

          {interviews.length > 0 ? (
            <InterviewList interviews={interviews} filters={filters} />
          ) : (
            <p className="text-gray-500">Henüz mülakat bulunmamaktadır.</p>
          )}

          <CreateInterviewDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </motion.div>
      </main>
    </div>
  );
}
