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

export default function DashboardPage() {
  const { interviews, fetchInterviews, loading } = useInterviewStore();

  const fetchData = useCallback(() => {
    fetchInterviews();
  }, [fetchInterviews]); // ✅ Bağımlılığı sabit tutuyoruz
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);   
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">İK Dashboard</h1>
      <OverviewStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : interviews?.length > 0 ? (
          <InterviewCard interview={interviews[0]} isFeatured={true} />
        ) : (
          <p>Henüz mülakat bulunmuyor.</p>
        )}
        <InterviewCalendar />
      </div>

      {interviews?.length > 0 && <InterviewSlider />} {/* ✅ Slider sadece veri varsa gösterilecek */}
      <ApplicationSlider />
      <DashboardCharts />
      <FavoriteCandidates />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <NotificationPanel />
        <ChatAssistant />
      </div>
    </main>
  );
}
