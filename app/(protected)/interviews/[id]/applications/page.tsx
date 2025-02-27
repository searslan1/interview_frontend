"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { AdvancedFilters } from "@/components/applications/AdvancedFilters";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApplicationStore } from "@/store/applicationStore";
import { useInterviewStore } from "@/store/interviewStore";


export default function InterviewApplicationsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; 
  const [filters, setFilters] = useState({});
  const { interviews, fetchAllInterviews } = useInterviewStore();
  const { applications, isLoading, fetchApplications, getApplicationsByInterviewId } = useApplicationStore();
  const [personalityTypes, setPersonalityTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchAllInterviews(); 
    fetchApplications();
    setPersonalityTypes(["INTJ", "ENTJ", "INFJ", "ENFJ", "ISTJ", "ESTJ", "ISFJ", "ESFJ"]); 
  }, []);

  const formattedApplications = getApplicationsByInterviewId(id).map((app) => ({
    id: app.id,
    interviewId: app.interviewId,
    candidateName: `${app.candidate.name} ${app.candidate.surname}`,
    email: app.candidate.email,
    status: app.status,
    submissionDate: new Date(app.submissionDate).toISOString().split("T")[0],
    aiScore: app.aiEvaluation?.overallScore ?? 0,
    interviewTitle: interviews.find((i) => i.id === app.interviewId)?.title || "Bilinmeyen Mülakat",
  }));

  const intObserver = useRef<IntersectionObserver>();
  const lastApplicationRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (!node || !intObserver.current) return;

      intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchApplications();
        }
      });

      intObserver.current.observe(node);
    },
    [fetchApplications]
  );

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!formattedApplications.length) return <div>Henüz başvuru yok.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">Mülakat Başvuruları</h1>
        <AdvancedFilters
          onFilterChange={handleFilterChange}
          interviews={interviews}
          personalityTypes={personalityTypes}
        />
        <ApplicationList applications={formattedApplications} lastApplicationRef={lastApplicationRef} />
      </main>
    </div>
  );
}
