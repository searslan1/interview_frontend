"use client";

import { useEffect } from "react";
import { useInterviewStore } from "@/store/interview-store";
import Header from "@/components/header";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { InterviewCard } from "@/components/InterviewCard";
import { InterviewSlider } from "@/components/dashboard/InterviewSlider";
import { ApplicationSlider } from "@/components/dashboard/ApplicationSlider";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { InterviewCalendar } from "@/components/dashboard/InterviewCalendar";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { ChatAssistant } from "@/components/dashboard/ChatAssistant";
import { FavoriteCandidates } from "@/components/dashboard/FavoriteCandidates";

export default function DashboardPage() {
  const { interviews, fetchInterviews, isLoading } = useInterviewStore();

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">İK Dashboard</h1>
        <OverviewStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {isLoading ? (
            <p>Yükleniyor...</p>
          ) : interviews.length > 0 ? (
            <InterviewCard interview={interviews[0]} isFeatured={true} />
          ) : (
            <p>Henüz mülakat bulunmuyor.</p>
          )}
          <InterviewCalendar />
        </div>

        <InterviewSlider />
        <ApplicationSlider />
        <DashboardCharts />
        <FavoriteCandidates />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <NotificationPanel />
          <ChatAssistant />
        </div>
      </main>
    </div>
  );
}
