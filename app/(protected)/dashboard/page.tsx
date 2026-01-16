"use client";

import { useCallback, useEffect } from "react";
import { useInterviewStore } from "@/store/interviewStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { InterviewCard } from "@/components/interview/InterviewCard";
import { InterviewSlider } from "@/components/dashboard/InterviewSlider";
import { ApplicationSlider } from "@/components/dashboard/ApplicationSlider";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { InterviewCalendar } from "@/components/dashboard/InterviewCalendar";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { ChatAssistant } from "@/components/dashboard/ChatAssistant";
import { FavoriteCandidates } from "@/components/dashboard/FavoriteCandidates";
import { PageHeader } from "@/components/layout/PageHeader";
import { Interview } from "@/types/interview";
import { LayoutDashboard, TrendingUp, Calendar, Users, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { interviews, fetchInterviews, loading: interviewsLoading } = useInterviewStore();
  const { loading: dashboardLoading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchInterviews();
    fetchDashboardData();
  }, [fetchInterviews, fetchDashboardData]);   
  
  // Interview actions
  const handleEdit = useCallback((interviewToEdit: Interview) => {
    console.log("🔧 Dashboard edit action:", interviewToEdit._id);
  }, []);

  const handleExtendDuration = useCallback((interviewToExtend: Interview) => {
    console.log("⏱️ Dashboard extend duration:", interviewToExtend._id);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Overview Stats */}
          <OverviewStats />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Interviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Son Mülakatlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {interviewsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <InterviewSlider 
                      interviews={interviews} 
                      onEdit={handleEdit}
                      onExtendDuration={handleExtendDuration}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Son Başvurular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationSlider />
                </CardContent>
              </Card>

              {/* Charts */}
              <DashboardCharts />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Calendar */}
              <InterviewCalendar />
              
              {/* Notifications */}
              <NotificationPanel />
              
              {/* Favorite Candidates */}
              <FavoriteCandidates />
              
              {/* AI Assistant */}
              <ChatAssistant />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
