"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  AlertCircle,
  FileCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Modern Bileşenler
import { 
  CandidateSidebar, 
  ModernVideoPlayer, 
  AIInsightsPanel,
  QuestionEvaluationCards 
} from "@/components/candidate/modern";

// Legacy Bileşenler
import { CandidateManagement } from "@/components/candidate/candidate-management";
import { VideoTranscript } from "@/components/candidate/video-transcript";

// Stores & Hooks
import { useApplicationStore } from "@/store/applicationStore";
import { useApplicationAnalysisStatus } from "@/hooks/useApplicationAnalysisStatus";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // ID'yi güvenli bir şekilde alıyoruz
  const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;

  // State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Hook ile veriyi çek (Polling desteği ile)
  const { application, isLoading, isPolling, error } = useApplicationAnalysisStatus(applicationId);

  // Store actions
  const { toggleFavoriteAction, updateStatus } = useApplicationStore();

  // Aktif yanıt
  const activeResponse = useMemo(() => {
    return application?.responses?.[activeQuestionIndex];
  }, [application?.responses, activeQuestionIndex]);

  // Favori toggle
  const toggleFavorite = () => {
    if (!application) return;
    toggleFavoriteAction(application._id, !application.isFavorite);
  };

  // Durum güncelleme
  const handleStatusUpdate = async (status: 'accepted' | 'rejected' | 'archived') => {
    if (!application) return;
    await updateStatus(application._id, status);
  };

  // ----------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Animated Blobs */}
        <div className="blob w-96 h-96 bg-purple-600/20 rounded-full -top-20 -left-20" />
        <div className="blob w-[500px] h-[500px] bg-blue-600/10 rounded-full -bottom-40 -right-40" style={{ animationDelay: '-2s' }} />
        
        <div className="relative z-10 text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <LoadingSpinner size="lg" className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Aday Analizi Yükleniyor</h2>
            <p className="text-muted-foreground">Lütfen bekleyin...</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ERROR STATE
  // ----------------------------------------------------
  if (error || !application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="blob w-96 h-96 bg-red-600/10 rounded-full -top-20 -left-20" />
        
        <div className="relative z-10 glass-panel rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold text-foreground mb-2">Başvuru Bulunamadı</h2>
          <p className="text-muted-foreground mb-6">
            İstediğiniz başvuruya ulaşılamıyor veya görüntüleme yetkiniz yok.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AWAITING STATE (Video veya AI Analizi Bekleniyor)
  // ----------------------------------------------------
  if (application.status === 'awaiting_ai_analysis' || application.status === 'awaiting_video_responses') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Animated Blobs */}
        <div className="blob w-96 h-96 bg-purple-600/20 rounded-full -top-20 -left-20" />
        <div className="blob w-[400px] h-[400px] bg-blue-600/15 rounded-full top-1/4 right-1/4" style={{ animationDelay: '-2s' }} />
        <div className="blob w-64 h-64 bg-pink-500/10 rounded-full bottom-1/4 left-1/3" style={{ animationDelay: '-4s' }} />
        
        <div className="relative z-10 glass-panel rounded-2xl p-8 max-w-lg text-center">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin opacity-20" />
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {application.status === 'awaiting_video_responses' 
              ? 'Video Yüklemesi Bekleniyor' 
              : 'Yapay Zeka Analizi Yapılıyor'}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {application.status === 'awaiting_video_responses'
              ? 'Aday henüz tüm video yanıtlarını yüklemedi. Yanıtlar tamamlandığında otomatik olarak analiz başlayacak.'
              : 'Video yanıtları yapay zeka tarafından analiz ediliyor. Bu işlem videonun uzunluğuna göre 1-3 dakika sürebilir.'}
          </p>

          <div className="glass-card rounded-xl p-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Durum otomatik olarak kontrol ediliyor
              {isPolling && (
                <span className="font-medium text-primary animate-pulse">(Güncelleniyor)</span>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Listeye Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN VIEW - Modern Candidate Analysis
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob w-96 h-96 bg-purple-600/10 rounded-full -top-12 -left-12 fixed" />
      <div className="blob w-[500px] h-[500px] bg-blue-600/5 rounded-full -bottom-24 -right-24 fixed" style={{ animationDelay: '-2s' }} />
      <div className="blob w-64 h-64 bg-pink-500/5 rounded-full top-1/3 right-1/4 fixed" style={{ animationDelay: '-4s' }} />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-border/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="h-6 w-px bg-border" />
            
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                Aday Analizi
                <span className="text-muted-foreground text-sm font-normal">
                  / {typeof application.interviewId === 'object' 
                      ? application.interviewId.title 
                      : 'Mülakat'}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Download Report */}
            <Button
              variant="outline"
              size="sm"
              className="glass-card text-xs"
            >
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>

            {/* Status Actions */}
            {application.status !== 'accepted' && application.status !== 'rejected' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleStatusUpdate('rejected')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reddet
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate('accepted')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Kabul Et
                </Button>
              </div>
            )}

            {/* Status Badge */}
            {application.status === 'accepted' && (
              <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                ✓ Kabul Edildi
              </span>
            )}
            {application.status === 'rejected' && (
              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
                ✗ Reddedildi
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar - Candidate Info */}
          <aside className="w-full lg:w-80 shrink-0">
            <CandidateSidebar 
              application={application}
              onToggleFavorite={toggleFavorite}
            />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6 min-w-0">
            
            {/* Video Player & AI Insights Row */}
            {application.responses && application.responses.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Video Player - 2/3 */}
                <div className="xl:col-span-2">
                  <ModernVideoPlayer
                    responses={application.responses}
                    activeQuestionIndex={activeQuestionIndex}
                    onQuestionChange={setActiveQuestionIndex}
                  />
                </div>

                {/* AI Insights Panel - 1/3 */}
                <div className="xl:col-span-1">
                  <AIInsightsPanel
                    activeResponse={activeResponse}
                    activeQuestionIndex={activeQuestionIndex}
                    generalAnalysis={application.generalAIAnalysis}
                    totalQuestions={application.responses.length}
                  />
                </div>
              </div>
            )}

            {/* Transcript Section */}
            {activeResponse?.textAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Soru {activeQuestionIndex + 1} - Transkript
                </h3>
                <VideoTranscript transcript={activeResponse.textAnswer} />
              </motion.div>
            )}

            {/* Question Evaluation Cards */}
            <QuestionEvaluationCards
              application={application}
              activeQuestionIndex={activeQuestionIndex}
              onQuestionSelect={setActiveQuestionIndex}
            />

            {/* Management Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CandidateManagement application={application} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}