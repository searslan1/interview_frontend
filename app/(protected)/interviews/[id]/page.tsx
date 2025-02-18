"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewDetails } from "@/components/interview/InterviewDetails";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApplicationStore } from "@/store/application-store";

export default function InterviewDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // ✅ ID'yi kesin string olarak al
  const { interviews, fetchAllInterviews } = useInterviewStore();
  const { fetchApplications, getApplicationsByInterviewId } = useApplicationStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAllInterviews(), fetchApplications()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchAllInterviews, fetchApplications]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const interview = interviews.find((i) => i.id === id);
  if (!interview) {
    return <div>Mülakat bulunamadı.</div>;
  }

  // ✅ Backend modeline uygun şekilde `Application` nesnelerini dönüştürüyoruz
  const applicationsWithDetails = getApplicationsByInterviewId(id).map((app) => ({
    id: app.id,
    candidateName: `${app.candidate.name} ${app.candidate.surname}`, // ✅ Aday adı ekleniyor
    email: app.candidate.email, // ✅ Eksik email eklendi
    status: app.status,
    submissionDate: new Date(app.submissionDate).toLocaleDateString(), // ✅ Tarih formatı güncellendi
    aiScore: app.generalAIAnalysis?.overallScore ?? 0, // ✅ AI Skoru yoksa varsayılan 0
    interviewTitle: interview.title, // ✅ Mülakat başlığı ekleniyor
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{interview.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InterviewDetails interview={interview} />
        <ApplicationList applications={applicationsWithDetails} />
      </div>
    </div>
  );
}
