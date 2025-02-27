"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewDetails } from "@/components/interview/InterviewDetails";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApplicationStore } from "@/store/applicationStore";

export default function InterviewDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // ✅ ID'yi kesin string olarak al
  const { selectedInterview, getInterviewById } = useInterviewStore();
  const { applications, getApplicationsByInterviewId } = useApplicationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null); // ✅ Önceki hataları temizle
      try {
        await getInterviewById(id); // ✅ Sadece bu mülakatı çek
        await getApplicationsByInterviewId(id); // ✅ Sadece bu mülakata ait başvuruları çek
      } catch (err) {
        setError("Mülakat bilgileri yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, getInterviewById, getApplicationsByInterviewId]);

  console.log("Mülakat Detayı:", selectedInterview);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!selectedInterview) {
    return <div className="text-gray-500">Mülakat bulunamadı.</div>;
  }

  // ✅ Backend modeline uygun şekilde `Application` nesnelerini dönüştürüyoruz
  const applicationsWithDetails = applications.map((app) => ({
    id: app.id,
    candidateName: `${app.candidate.name} ${app.candidate.surname}`, // ✅ Aday adı ekleniyor
    email: app.candidate.email, // ✅ Eksik email eklendi
    status: app.status,
    submissionDate: new Date(app.submissionDate).toLocaleDateString(), // ✅ Tarih formatı güncellendi
    aiScore: app.generalAIAnalysis?.overallScore ?? 0, // ✅ AI Skoru yoksa varsayılan 0
    interviewTitle: selectedInterview.title, // ✅ Mülakat başlığı ekleniyor
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{selectedInterview.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InterviewDetails interview={selectedInterview} />
        <ApplicationList applications={applicationsWithDetails} />
      </div>
    </div>
  );
}
