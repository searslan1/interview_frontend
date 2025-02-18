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
}

export function InterviewList({ interviews, filters }: InterviewListProps) {
  const filteredInterviews = interviews
    .filter((interview) => {
      // **🔹 Statü Filtreleme**
      if (filters.status !== "all" && interview.status !== filters.status) return false;

      // **🔹 Mülakat Türü Filtreleme (Backend'de type alanı olmadığı için `category` olarak varsayalım)**
      if (filters.interviewType !== "all" && interview.title !== filters.interviewType) return false;

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
      const dateA = new Date(a.createdAt ?? "").getTime();
      const dateB = new Date(b.createdAt ?? "").getTime();

      return filters.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredInterviews.length > 0 ? (
        filteredInterviews.map((interview) => (
          <InterviewCard key={interview._id} interview={interview} />
        ))
      ) : (
        <p className="col-span-3 text-center">Eşleşen mülakat bulunamadı.</p>
      )}
    </div>
  );
}
