"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// Components
import { ApplicationCard } from "@/components/applications/netflix/ApplicationCard";
import { ApplicationModal } from "@/components/applications/netflix/ApplicationModal";
import { NetflixFilterBar } from "@/components/applications/netflix/NetflixFilterBar";
import { ApplicationRow } from "@/components/applications/netflix/ApplicationRow";

// UI Components
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  List as ListIcon, 
  Users,
  TrendingUp,
  Star
} from "lucide-react";

// Stores
import { useApplicationStore } from "@/store/applicationStore";
import { useInterviewStore } from "@/store/interviewStore";
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";

// Types
import type { Application } from "@/types/application";

// View Modes
type ViewMode = "netflix" | "grid" | "list";

export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL'den view mode al veya default olarak netflix kullan
  const initialViewMode = (searchParams.get("view") as ViewMode) || "netflix";

  // State
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  // Stores
  const { 
    items: applications, 
    fetchApplications, 
    loading, 
    filters,
    setFilters,
    pagination 
  } = useApplicationStore();
  
  const { interviews, fetchInterviews } = useInterviewStore();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

  // Initial fetch
  useEffect(() => {
    fetchApplications();
    fetchInterviews();
  }, [fetchApplications, fetchInterviews]);

  // Positions from interviews (Filtre barı için)
  const positions = useMemo(() => {
    return interviews.map((interview) => ({
      id: interview._id,
      title: interview.title,
      department: interview.position?.department,
    }));
  }, [interviews]);

  // ========== DATA GROUPING (Netflix Modu İçin) ==========

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
  }, [applications]);

  const highScoreApplications = useMemo(() => {
    return [...applications]
      .filter((app) => (app.generalAIAnalysis?.overallScore ?? 0) >= 70)
      .sort((a, b) => 
        (b.generalAIAnalysis?.overallScore ?? 0) - (a.generalAIAnalysis?.overallScore ?? 0)
      )
      .slice(0, 20);
  }, [applications]);

  const favoriteApplications = useMemo(() => {
    const favoriteIds = favorites.map((f) => f.id);
    return applications.filter((app) => favoriteIds.includes(app._id));
  }, [applications, favorites]);

  const pendingApplications = useMemo(() => {
    return applications.filter((app) => app.status === "pending");
  }, [applications]);

  // Pozisyon Bazlı Gruplandırma (Type Guard ile güvenli hale getirildi)
  const applicationsByPosition = useMemo(() => {
    const grouped: Record<string, { title: string; applications: Application[] }> = {};

    interviews.forEach((interview) => {
      const positionApps = applications.filter(
        (app) => {
            // interviewId string de olabilir obje de (populate durumuna göre)
            const appId = typeof app.interviewId === 'string' 
                ? app.interviewId 
                : app.interviewId._id;
            return appId === interview._id;
        }
      );
      if (positionApps.length > 0) {
        grouped[interview._id] = {
          title: interview.title,
          applications: positionApps,
        };
      }
    });

    return grouped;
  }, [applications, interviews]);

  // ========== HANDLERS ==========

  const handleSelectApplication = useCallback((application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  }, []);

  const handleFavoriteToggle = useCallback((application: Application) => {
    if (isFavorite(application._id)) {
      removeFavorite(application._id);
    } else {
      addFavorite({
        id: application._id,
        name: `${application.candidate.name} ${application.candidate.surname}`,
        position: "Aday", 
        score: application.generalAIAnalysis?.overallScore ?? 0,
      });
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const handleCandidateClick = useCallback((candidateId: string) => {
    router.push(`/candidates/${candidateId}`);
  }, [router]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    const url = new URL(window.location.href);
    url.searchParams.set("view", mode);
    router.replace(url.pathname + url.search);
  };

  // ========== RENDER HELPERS ==========

  const renderApplicationCard = useCallback((application: Application) => (
    <ApplicationCard
      key={application._id}
      application={application}
      onSelect={handleSelectApplication}
      onFavoriteToggle={handleFavoriteToggle}
      isFavorite={isFavorite(application._id)}
    />
  ), [handleSelectApplication, handleFavoriteToggle, isFavorite]);

  // Loading state
  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* 1. Üst Kısım: Filtreler ve Header */}
      <NetflixFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        positions={positions}
        totalCount={pagination.total}
        filteredCount={applications.length}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Başvurular</h1>
            <p className="text-muted-foreground mt-1">
              Tüm başvuruları inceleyin ve değerlendirin
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "netflix" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("netflix")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Gruplu</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("grid")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Kartlar</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className="gap-2"
            >
              <ListIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Ana İçerik Alanı */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === "netflix" ? (
          // ========== NETFLIX VIEW ==========
          <div className="space-y-2">
            {pendingApplications.length > 0 && (
              <ApplicationRow
                title="Değerlendirme Bekleyenler"
                subtitle="Aksiyon almanız gerekenler"
                items={pendingApplications}
                renderItem={renderApplicationCard}
              />
            )}

            <ApplicationRow
              title="Son Gelenler"
              subtitle="En yeni başvurular"
              items={recentApplications}
              renderItem={renderApplicationCard}
              emptyMessage="Henüz başvuru yok"
            />

            {favoriteApplications.length > 0 && (
              <ApplicationRow
                title="Favorilerim"
                subtitle="İşaretledikleriniz"
                items={favoriteApplications}
                renderItem={renderApplicationCard}
              />
            )}
            
            {Object.entries(applicationsByPosition).map(([id, data]) => (
              <ApplicationRow
                key={id}
                title={data.title}
                subtitle="Bu pozisyona yapılan başvurular"
                items={data.applications}
                renderItem={renderApplicationCard}
              />
            ))}
             
             {applications.length === 0 && !loading && (
                 <div className="text-center py-20 text-muted-foreground">
                    Görüntülenecek başvuru bulunamadı.
                 </div>
             )}
          </div>

        ) : viewMode === "grid" ? (
          // ========== GRID VIEW ==========
          <div className="container mx-auto px-4">
             {applications.length === 0 ? (
               <div className="text-center py-20 text-muted-foreground">Kayıt bulunamadı.</div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {applications.map((application) => renderApplicationCard(application))}
                </div>
             )}
          </div>

        ) : (
          // ========== LIST VIEW ==========
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Aday</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Mülakat</th>
                    <th className="text-left p-4 font-medium">Durum</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">AI Skoru</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">Tarih</th>
                    <th className="text-right p-4 font-medium">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleSelectApplication(application)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {application.candidate.name} {application.candidate.surname}
                            </p>
                            <p className="text-sm text-muted-foreground hidden sm:block">
                              {application.candidate.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm hidden md:table-cell">
                         {typeof application.interviewId === 'object' 
                            ? application.interviewId.title 
                            : interviews.find(i => i._id === application.interviewId)?.title || '-'}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        {application.generalAIAnalysis?.overallScore ? (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className={`font-bold ${application.generalAIAnalysis.overallScore >= 70 ? 'text-green-600' : ''}`}>
                              {application.generalAIAnalysis.overallScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                        {new Date(application.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(application);
                          }}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFavorite(application._id)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Filtrelerinize uygun başvuru bulunamadı.
                  </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Ortak Modal */}
      <ApplicationModal
        application={selectedApplication}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCandidateClick={handleCandidateClick}
      />
    </main>
  );
}

// Status Badge Helper
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        awaiting_video_responses: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        awaiting_ai_analysis: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };

    const labels: Record<string, string> = {
        pending: "Beklemede",
        in_progress: "İşlemde",
        completed: "Tamamlandı",
        rejected: "Reddedildi",
        accepted: "Kabul Edildi",
        awaiting_video_responses: "Video Bekleniyor",
        awaiting_ai_analysis: "Analiz Bekleniyor",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {labels[status] || status}
        </span>
    );
}