"use client";

import { InterviewCard } from "@/components/interview/InterviewCard";
import type { Interview } from "@/types/interview";

interface InterviewListProps {
  interviews: Interview[];
  filters: {
    sortBy: "newest" | "oldest";
    interviewType: "all" | "technical" | "behavioral" | "personality";
    status: "all" | "active" | "completed" | "draft" | "published" | "inactive";
    searchTerm?: string;
  };
  // 📌 YENİ EKLENEN: InterviewCard'a iletilecek aksiyon yöneticileri
  onEdit: (interview: Interview) => void; 
  onExtendDuration: (interview: Interview) => void;
}

export function InterviewList({ interviews, filters, onEdit, onExtendDuration }: InterviewListProps) {
  const filteredInterviews = interviews
    .filter((interview) => {
      // **🔹 Statü Filtreleme**
      if (filters.status !== "all" && interview.status !== filters.status) return false;

      // **🔹 Mülakat Türü Filtreleme (Bu alan modelinizle uyumlu olmalıdır)**
      if (filters.interviewType !== "all") {
        if (filters.interviewType === "personality" && !interview.stages.personalityTest) {
          return false; 
        }
      }

      // **🔹 Arama Filtreleme**
      if (
        filters.searchTerm &&
        !interview.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // **🔹 Sıralama (Sort)**
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return filters.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredInterviews.length > 0 ? (
        filteredInterviews.map((interview) => (
          <InterviewCard 
            key={interview._id} 
            interview={interview} 
            // 📌 InterviewCard'a aksiyon yöneticileri iletiliyor
            onEdit={onEdit} 
            onExtendDuration={onExtendDuration}
          />
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500">Eşleşen mülakat bulunamadı.</p>
      )}
    </div>
  );
}