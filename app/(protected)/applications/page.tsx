"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// Components
import { ApplicationCard } from "@/components/applications/netflix/ApplicationCard";
import { ApplicationModal } from "@/components/applications/netflix/ApplicationModal";
import { ApplicationRow } from "@/components/applications/netflix/ApplicationRow";

// UI Components
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  LayoutGrid, 
  List as ListIcon, 
  Users,
  TrendingUp,
  Star,
  FileQuestion,
  Sparkles
} from "lucide-react";

// Stores
import { useApplicationStore } from "@/store/applicationStore";
import { useInterviewStore } from "@/store/interviewStore";

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
    toggleFavoriteAction
  } = useApplicationStore();
  
  const { interviews, fetchInterviews } = useInterviewStore();

  // Initial fetch - sadece component mount olduğunda
  useEffect(() => {
    fetchApplications({ reset: true });
    fetchInterviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Positions from interviews (Filter bar için)
  const positions = useMemo(() => {
    return interviews.map((interview) => ({
      id: interview._id,
      title: interview.title,
      department: interview.position?.department,
    }));
  }, [interviews]);

  // ========== DATA GROUPING (Netflix Mode) ==========
  // Frontend'de minimal işlem - sadece görünüm için gruplandırma
  
  const groupedApplications = useMemo(() => {
    if (viewMode !== 'netflix') return null;
    
    // Pozisyona göre grupla
    const byPosition = new Map<string, { title: string; apps: Application[] }>();
    
    applications.forEach((app) => {
      const interviewId = typeof app.interviewId === 'string' 
        ? app.interviewId 
        : app.interviewId._id;
      
      const interview = interviews.find(i => i._id === interviewId);
      if (!interview) return;
      
      if (!byPosition.has(interviewId)) {
        byPosition.set(interviewId, { title: interview.title, apps: [] });
      }
      byPosition.get(interviewId)!.apps.push(app);
    });
    
    return Array.from(byPosition.entries()).map(([id, data]) => ({
      id,
      title: data.title,
      applications: data.apps
    }));
  }, [applications, interviews, viewMode]);

  // ========== HANDLERS ==========

  const handleSelectApplication = useCallback((application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  }, []);

  const handleFavoriteToggle = useCallback(async (application: Application) => {
    const isFav = application.favoriteBy?.includes('current-user') || false;
    await toggleFavoriteAction(application._id, !isFav);
  }, [toggleFavoriteAction]);

  const handleCandidateClick = useCallback((candidateId: string) => {
    router.push(`/candidates/${candidateId}`);
  }, [router]);

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
      isFavorite={application.favoriteBy?.includes('current-user') || false}
    />
  ), [handleSelectApplication, handleFavoriteToggle]);

  // Initial loading (sayfa ilk yüklenirken)
  const isInitialLoading = loading && applications.length === 0;
  
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground">Başvurular yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Page Header - Glass Style */}
      <div className="glass-header sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Başvurular</h1>
              <p className="text-sm text-muted-foreground">
                {applications.length} başvuru
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 backdrop-blur-sm">
              <Button
                variant={viewMode === "netflix" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("netflix")}
                className={`gap-2 rounded-lg ${viewMode === "netflix" ? "shadow-md" : ""}`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Gruplu</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("grid")}
                className={`gap-2 rounded-lg ${viewMode === "grid" ? "shadow-md" : ""}`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Kartlar</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("list")}
                className={`gap-2 rounded-lg ${viewMode === "list" ? "shadow-md" : ""}`}
              >
                <ListIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Liste</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik Alanı (Scrollable) */}
      <div className="flex-1 overflow-y-auto pb-8">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-12"
        >
        {viewMode === "netflix" ? (
          // ========== NETFLIX VIEW ==========
          <div className="space-y-6">
            {loading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-6 w-48 ml-4" />
                    <div className="flex gap-4 px-4 overflow-hidden">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-64 w-64 shrink-0 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Başvuru Bulunamadı</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Henüz hiç başvuru alınmamış. Mülakat linklerini paylaşarak adayları davet edin.
                </p>
              </div>
            ) : (
              // Grouped applications
              groupedApplications?.map((group) => (
                <ApplicationRow
                  key={group.id}
                  title={group.title}
                  subtitle={`${group.applications.length} başvuru`}
                  items={group.applications}
                  renderItem={renderApplicationCard}
                />
              ))
            )}
          </div>

        ) : viewMode === "grid" ? (
          // ========== GRID VIEW ==========
          <div className="container mx-auto px-4">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Başvuru Bulunamadı</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Henüz hiç başvuru alınmamış.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {applications.map((application) => renderApplicationCard(application))}
              </div>
            )}
          </div>

        ) : (
          // ========== LIST VIEW ==========
          <div className="container mx-auto px-4">
            {loading ? (
              // Loading skeleton
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-4 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            ) : applications.length === 0 ? (
              // Empty state
              <div className="bg-card rounded-lg border border-border p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Başvuru Bulunamadı</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    {filters.query || filters.status !== 'all' || filters.interviewId
                      ? 'Filtre kriterlerinize uygun başvuru bulunamadı.'
                      : 'Henüz hiç başvuru alınmamış.'}
                  </p>
                  {(filters.query || filters.status !== 'all' || filters.interviewId) && (
                    <Button variant="outline" onClick={() => handleFilterChange({})}>
                      Filtreleri Temizle
                    </Button>
                  )}
                </div>
              </div>
            ) : (
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
                                application.favoriteBy?.includes('current-user')
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
              </div>
            )}
          </div>
        )}
        </motion.div>
      </div>

      {/* Modal (Portal - dışarıda) */}
      <ApplicationModal
        application={selectedApplication}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCandidateClick={handleCandidateClick}
      />
    </main>
  );
}