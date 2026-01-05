"use client";

import { useCallback, useEffect } from "react";
import { useInterviewStore } from "@/store/interviewStore";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { InterviewCard } from "@/components/interview/InterviewCard";
import { InterviewSlider } from "@/components/dashboard/InterviewSlider";
import { ApplicationSlider } from "@/components/dashboard/ApplicationSlider";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { InterviewCalendar } from "@/components/dashboard/InterviewCalendar";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { ChatAssistant } from "@/components/dashboard/ChatAssistant";
import { FavoriteCandidates } from "@/components/dashboard/FavoriteCandidates";
import { Interview } from "@/types/interview";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { interviews, fetchInterviews, loading } = useInterviewStore();

  const fetchData = useCallback(() => {
    fetchInterviews();
  }, [fetchInterviews]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);   
  
  // Örnek: Düzenleme modalını açan
  const handleEdit = useCallback((interviewToEdit: Interview) => {
    console.log("Dashboard'dan Düzenleme Aksiyonu Tetiklendi:", interviewToEdit._id);
  }, []);

  // Örnek: Süre uzatma modalını açan
  const handleExtendDuration = useCallback((interviewToExtend: Interview) => {
    console.log("Dashboard'dan Süre Uzatma Aksiyonu Tetiklendi:", interviewToExtend._id);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <LayoutDashboard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">İK Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Günlük özet ve hızlı aksiyonlar
          </p>
        </div>
      </div>

      {/* KPI Kartları */}
      <OverviewStats />

      {/* Mülakat & Takvim Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {loading ? (
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        ) : interviews?.length > 0 ? (
          <InterviewCard 
            interview={interviews[0]} 
            isFeatured={true} 
            onEdit={handleEdit}
            onExtendDuration={handleExtendDuration}
          />
        ) : null}
        <InterviewCalendar />
      </div>

      {/* Aktif Mülakatlar Slider */}
      <InterviewSlider />

      {/* Son Başvurular Slider */}
      <ApplicationSlider />

      {/* Grafikler */}
      <DashboardCharts />

      {/* Favori Adaylar & Bildirimler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FavoriteCandidates />
        <NotificationPanel />
      </div>

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </main>
  );
}
