"use client";

import { useMemo } from "react";
import { InterviewCard } from "@/components/interview/InterviewCard";
import type { Interview } from "@/types/interview";

interface InterviewListProps {
  interviews: Interview[];
  filters: {
    sortBy: string;      // "newest" | "oldest"
    interviewType: string; // "all" | "async-video" | "live-video" ...
    status: string;      // "all" | "active" | "draft" ...
    searchTerm?: string;
  };
  onEdit: (interview: Interview) => void; 
  onExtendDuration: (interview: Interview) => void;
}

export function InterviewList({ interviews, filters, onEdit, onExtendDuration }: InterviewListProps) {
  
  // 📌 Performans için useMemo kullanıldı.
  // Sadece interviews listesi veya filters değiştiğinde hesaplama yapar.
  const filteredInterviews = useMemo(() => {
    return interviews
      .filter((interview) => {
        // **🔹 1. Statü Filtreleme**
        if (filters.status !== "all" && interview.status !== filters.status) {
          return false;
        }

        // **🔹 2. Mülakat Türü Filtreleme (Backend 'type' alanı ile eşleşme)**
        // FilterSection'dan gelen değer (örn: 'async-video') ile veritabanındaki değer eşleşmeli.
        if (filters.interviewType !== "all" && interview.type !== filters.interviewType) {
          return false;
        }

        // **🔹 3. Arama Filtreleme (Başlık veya Pozisyon Adı)**
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          const titleMatch = interview.title.toLowerCase().includes(term);
          // Pozisyon başlığı varsa onu da aramaya dahil edelim
          const positionMatch = interview.position?.title?.toLowerCase().includes(term);
          
          if (!titleMatch && !positionMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // **🔹 Sıralama (Sort)**
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return filters.sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [interviews, filters]); // Bağımlılık dizisi

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredInterviews.length > 0 ? (
        filteredInterviews.map((interview) => (
          <InterviewCard 
            key={interview._id} 
            interview={interview} 
            onEdit={onEdit} 
            onExtendDuration={onExtendDuration}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Sonuç Bulunamadı</p>
            <p className="text-sm text-gray-500">
                Seçilen kriterlere uygun mülakat kaydı yok. Filtreleri temizlemeyi deneyin.
            </p>
        </div>
      )}
    </div>
  );
}