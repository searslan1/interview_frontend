"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Components
import { ApplicationCard } from "@/components/applications/netflix/ApplicationCard";
import { ApplicationModal } from "@/components/applications/netflix/ApplicationModal";

// UI Components
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Archive, 
  Search, 
  RotateCcw, 
  Trash2,
  Users,
  Calendar,
  Inbox,
  RefreshCw,
  ArrowUpFromLine
} from "lucide-react";

// Stores
import { useApplicationStore } from "@/store/applicationStore";
import { useInterviewStore } from "@/store/interviewStore";

// Types
import type { Application } from "@/types/application";

export default function ArchivePage() {
  const router = useRouter();

  // State
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [applicationToRestore, setApplicationToRestore] = useState<Application | null>(null);

  // Stores
  const { 
    items: allApplications, 
    fetchApplications, 
    loading,
    updateStatus
  } = useApplicationStore();
  
  const { interviews, fetchInterviews } = useInterviewStore();

  // Sadece arşivlenmiş başvuruları filtrele
  const archivedApplications = useMemo(() => {
    return allApplications.filter(app => app.status === 'archived');
  }, [allApplications]);

  // Arama filtresi
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return archivedApplications;
    
    const query = searchQuery.toLowerCase();
    return archivedApplications.filter(app => {
      const candidateName = `${app.candidate.name} ${app.candidate.surname}`.toLowerCase();
      const email = app.candidate.email?.toLowerCase() || '';
      const interviewTitle = typeof app.interviewId === 'object' 
        ? app.interviewId.title?.toLowerCase() 
        : '';
      
      return candidateName.includes(query) || 
             email.includes(query) || 
             interviewTitle.includes(query);
    });
  }, [archivedApplications, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchApplications({ reset: true });
    fetchInterviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pozisyonlara göre grupla
  const groupedByPosition = useMemo(() => {
    const groups = new Map<string, { title: string; apps: Application[] }>();
    
    filteredApplications.forEach((app) => {
      const interviewId = typeof app.interviewId === 'string' 
        ? app.interviewId 
        : app.interviewId._id;
      
      const interview = interviews.find(i => i._id === interviewId);
      const title = interview?.title || 'Bilinmeyen Pozisyon';
      
      if (!groups.has(interviewId)) {
        groups.set(interviewId, { title, apps: [] });
      }
      groups.get(interviewId)!.apps.push(app);
    });
    
    return Array.from(groups.entries()).map(([id, data]) => ({
      id,
      title: data.title,
      applications: data.apps
    }));
  }, [filteredApplications, interviews]);

  // ========== HANDLERS ==========

  const handleSelectApplication = useCallback((application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  }, []);

  const handleRestoreClick = useCallback((application: Application, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplicationToRestore(application);
    setRestoreDialogOpen(true);
  }, []);

  const handleRestoreConfirm = useCallback(async () => {
    if (!applicationToRestore) return;
    
    try {
      // Arşivden çıkar - completed durumuna geri al
      await updateStatus(applicationToRestore._id, 'completed');
      setRestoreDialogOpen(false);
      setApplicationToRestore(null);
    } catch (error) {
      console.error('Error restoring application:', error);
    }
  }, [applicationToRestore, updateStatus]);

  const handleCandidateClick = useCallback((candidateId: string) => {
    router.push(`/candidates/${candidateId}`);
  }, [router]);

  const handleRefresh = useCallback(() => {
    fetchApplications({ reset: true });
  }, [fetchApplications]);

  // ========== RENDER ==========

  // Initial loading
  const isInitialLoading = loading && allApplications.length === 0;
  
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground">Arşiv yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Archive className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Arşiv</h1>
                <p className="text-sm text-muted-foreground">
                  {archivedApplications.length} arşivlenmiş başvuru
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Aday, email veya pozisyon ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{archivedApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Toplam Arşiv</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Archive className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{groupedByPosition.length}</p>
                  <p className="text-sm text-muted-foreground">Farklı Pozisyon</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{filteredApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Arama Sonucu</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boş Durum */}
        {archivedApplications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Arşiv Boş</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Henüz arşivlenmiş başvuru bulunmuyor. Başvuruları arşivlemek için 
                başvuru detay sayfasından "Arşive Al" seçeneğini kullanabilirsiniz.
              </p>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sonuç Bulunamadı</h3>
              <p className="text-muted-foreground text-sm">
                "{searchQuery}" aramasına uygun arşivlenmiş başvuru bulunamadı.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Aramayı Temizle
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Pozisyonlara Göre Gruplandırılmış Liste */
          <div className="space-y-8">
            {groupedByPosition.map((group) => (
              <div key={group.id}>
                {/* Grup Başlığı */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold">{group.title}</h2>
                  <Badge variant="secondary">{group.applications.length}</Badge>
                </div>

                {/* Başvuru Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {group.applications.map((application, index) => (
                      <motion.div
                        key={application._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <ArchiveCard
                          application={application}
                          onSelect={handleSelectApplication}
                          onRestore={handleRestoreClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        application={selectedApplication}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCandidateClick={handleCandidateClick}
      />

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Başvuruyu Geri Yükle</AlertDialogTitle>
            <AlertDialogDescription>
              {applicationToRestore && (
                <>
                  <strong>{applicationToRestore.candidate.name} {applicationToRestore.candidate.surname}</strong> 
                  {" "}adlı adayın başvurusunu arşivden çıkarmak istediğinize emin misiniz?
                  <br /><br />
                  Başvuru "Tamamlandı" durumuna geri alınacaktır.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreConfirm}>
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              Geri Yükle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

// ========== ARCHIVE CARD COMPONENT ==========

interface ArchiveCardProps {
  application: Application;
  onSelect: (application: Application) => void;
  onRestore: (application: Application, e: React.MouseEvent) => void;
}

function ArchiveCard({ application, onSelect, onRestore }: ArchiveCardProps) {
  const interviewTitle = typeof application.interviewId === 'object' 
    ? application.interviewId.title 
    : 'Mülakat';

  const archivedDate = application.updatedAt 
    ? new Date(application.updatedAt).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '-';

  const score = application.generalAIAnalysis?.overallScore;

  return (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-all duration-200 border-muted hover:border-primary/30"
      onClick={() => onSelect(application)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {application.candidate.name} {application.candidate.surname}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {application.candidate.email}
            </p>
          </div>
          
          {/* Score Badge */}
          {score !== undefined && (
            <Badge 
              variant={score >= 70 ? "default" : score >= 50 ? "secondary" : "outline"}
              className="ml-2"
            >
              {score}
            </Badge>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {archivedDate}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => onRestore(application, e)}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Geri Yükle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
