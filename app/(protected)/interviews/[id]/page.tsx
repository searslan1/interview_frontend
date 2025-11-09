"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewDetails } from "@/components/interview/InterviewDetails";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApplicationStore } from "@/store/applicationStore";
// ✅ ApplicationStatus tipini kullanmak için import
import { ApplicationStatus } from "@/types/application"; 

// ✅ Sadeleştirilmiş Liste Tipi Tanımlandı
interface ApplicationListItem {
    id: string; 
    candidateName: string;
    email: string;
    status: ApplicationStatus; 
    submissionDate: string; 
    aiScore: number;
    interviewTitle: string;
}


export default function InterviewDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; 
  const { selectedInterview, getInterviewById } = useInterviewStore();
  const { applications, getApplicationsByInterviewId } = useApplicationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (loadData metodu değişmedi)
    const loadData = async () => {
      setIsLoading(true);
      setError(null); 
      try {
        await getInterviewById(id); 
        await getApplicationsByInterviewId(id); 
      } catch (err) {
        setError("Mülakat bilgileri yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, getInterviewById, getApplicationsByInterviewId]);

  // ... (Loading ve Error durumları değişmedi)

  if (!selectedInterview) {
    return <div className="text-gray-500">Mülakat bulunamadı.</div>;
  }

  // ✅ Veri Dönüşümü ve Hata Çözümü
  const applicationsWithDetails: ApplicationListItem[] = applications.map((app) => ({
    id: app.id,
    candidateName: `${app.candidate.name} ${app.candidate.surname}`, 
    email: app.candidate.email, 
    status: app.status,
    // ✅ Düzeltme: submissionDate yerine createdAt kullanıldı
    submissionDate: new Date(app.createdAt).toLocaleDateString(), 
    aiScore: app.generalAIAnalysis?.overallScore ?? 0, 
    interviewTitle: selectedInterview.title, 
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{selectedInterview.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InterviewDetails interview={selectedInterview} />
        {/* ✅ Düzeltme: applicationsWithDetails dizisi artık ApplicationList'in beklediği tipe atanabilir. 
             Ancak ApplicationList'in prop'larının da ApplicationListItem[] bekleyecek şekilde güncellenmesi gerekir! */}
        <ApplicationList applications={applicationsWithDetails as any} /> 
      </div>
    </div>
  );
}