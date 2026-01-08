"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useInterviewStore } from "@/store/interviewStore";
import { useApplicationStore } from "@/store/applicationStore";
import { ApplicationStatus } from "@/types/application"; 

// Bileşenler
import { InterviewDetails } from "@/components/interview/InterviewDetails";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { InterviewPublishControl } from "@/components/interview/InterviewPublishControl"; 
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApplicationListItem {
    id: string; 
    interviewId: string;
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
  
  // Store'lar
  const { selectedInterview, getInterviewById, loading: interviewLoading } = useInterviewStore();
  const { items, getApplicationsByInterviewId, loading: appLoading } = useApplicationStore();
  
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ TÜM HOOK'LAR EN ÜSTTE OLMALI
  
  // Verileri Yükle
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      console.log("🚀 Mülakat ve Başvurular Yükleniyor... ID:", id);
      setPageLoading(true);
      setError(null); 
      try {
        await Promise.all([
            getInterviewById(id),
            getApplicationsByInterviewId(id)
        ]);
        console.log("✅ Veri çekme isteği tamamlandı.");
      } catch (err: any) {
        console.error("❌ Veri çekme hatası:", err);        
        setError(err.message || "Mülakat bilgileri yüklenirken hata oluştu.");
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [id, getInterviewById, getApplicationsByInterviewId]);

  // Debug Log Hook'u (Return'den ÖNCE olmalı)
  useEffect(() => {
    console.log("📦 STORE GÜNCELLENDİ - Items:", items);
  }, [items]);

  // 2️⃣ CONDITIONAL RETURN'LER (HOOK'LARDAN SONRA)

  // Loading Durumu
  if (pageLoading && !selectedInterview) return <LoadingSpinner />;

  // Hata Durumu
  if (error) {
    return (
        <div className="container mx-auto p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!selectedInterview) {
    return <div className="container mx-auto p-4 text-gray-500">Mülakat bulunamadı.</div>;
  }

  // 3️⃣ MAPPING VE RENDER
  const applicationsWithDetails: ApplicationListItem[] = items.map((app: any) => ({
    id: app._id || app.id,
    interviewId: selectedInterview._id || "",
    candidateName: app.candidate ? `${app.candidate.name} ${app.candidate.surname}` : "Bilinmeyen Aday", 
    email: app.candidate?.email || "", 
    status: app.status,
    submissionDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString("tr-TR") : "-", 
    aiScore: app.generalAIAnalysis?.overallScore ?? 0, 
    interviewTitle: selectedInterview.title, 
  }));

 return (
    <div className="container mx-auto px-4 py-8 space-y-8 fade-in animate-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{selectedInterview.title}</h1>
            <p className="text-muted-foreground mt-1">
                {selectedInterview?.description?.substring(0, 100)}...
            </p>
        </div>
        <div className="flex items-center gap-3">
            <Badge variant={selectedInterview.status === 'published' ? 'default' : 'secondary'} className="text-sm px-3 py-1 capitalize">
                {selectedInterview.status === 'draft' ? 'Taslak' : 
                 selectedInterview.status === 'published' ? 'Yayında' : 
                 selectedInterview.status}
            </Badge>
        </div>
      </div>

      {/* 2. BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <InterviewDetails interview={selectedInterview} />
        </div>
        <div className="space-y-6">
           <InterviewPublishControl interview={selectedInterview} />
           <div className="bg-muted/30 rounded-lg p-4 border flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Toplam Başvuru
                </div>
                <span className="text-2xl font-bold">{items.length}</span>
           </div>
        </div>
      </div>

      {/* 3. TABLE */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Başvurular</h2>
        </div>
        <div className="bg-card rounded-lg border shadow-sm">
            <ApplicationList 
                applications={applicationsWithDetails} 
                isLoading={appLoading} 
            />
        </div>
      </div>
    </div>
  );
}