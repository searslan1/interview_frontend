"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"

// Components
import { VideoPlayer } from "@/components/candidate/video-player"
import { AIGeneralAnalysis } from "@/components/candidate/ai-general-analysis"
import { AIDetailedReports } from "@/components/candidate/ai-detailed-reports"
import { CandidateManagement } from "@/components/candidate/candidate-management"
import { VideoTranscript } from "@/components/candidate/video-transcript"

// UI & Types
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" 
import { Application, ApplicationResponse } from "@/types/application" 

interface CandidateDetailReviewProps {
  application: Application
}

export function CandidateDetailReview({ application }: CandidateDetailReviewProps) {
  // Video State
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Tab State (Default: İlk soru)
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    application.responses?.[0]?.questionId || ''
  );

  // Video Handler'ları
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleFullScreenToggle = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  // Active Question Değişimi & Fullscreen Listener
  useEffect(() => {
    // Eğer activeQuestionId boşsa ve yanıtlar varsa, ilkini seç
    if (!activeQuestionId && application.responses?.length > 0) {
        setActiveQuestionId(application.responses[0].questionId);
    }
    
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange)
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [application.responses, activeQuestionId])
  
  // Aktif sorunun verilerini bul
  const activeResponse = useMemo<ApplicationResponse | undefined>(() => {
    return application.responses?.find(r => r.questionId === activeQuestionId);
  }, [application.responses, activeQuestionId]);

  const activeVideoUrl = activeResponse?.videoUrl || "";
  const activeTranscript = activeResponse?.textAnswer || "";

  // Response kontrolü
  const hasResponses = application.responses && application.responses.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Yanıt yoksa bilgilendirme göster ama sayfayı tamamen boşaltma */}
        {!hasResponses ? (
          <div className="space-y-8">
            {/* Durum Bilgisi */}
            <div className="bg-muted/50 border rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📹</div>
              <h3 className="text-lg font-semibold mb-2">Henüz Video Yanıtı Yok</h3>
              <p className="text-muted-foreground mb-4">
                Aday henüz mülakat sorularına video yanıtlarını yüklemedi.
              </p>
              <div className="inline-flex items-center gap-2 text-sm bg-background px-3 py-1 rounded-full border">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Durum: {application.status === 'awaiting_video_responses' ? 'Video Bekleniyor' : 
                        application.status === 'pending' ? 'Beklemede' : 
                        application.status === 'otp_verified' ? 'OTP Doğrulandı' : application.status}
              </div>
            </div>

            {/* Mevcut Aday Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <span>👤</span> Aday Bilgileri
                </h4>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ad Soyad</dt>
                    <dd className="font-medium">{application.candidate?.name} {application.candidate?.surname}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">E-posta</dt>
                    <dd className="font-medium">{application.candidate?.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Telefon</dt>
                    <dd className="font-medium">{application.candidate?.phone || '-'}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <span>📋</span> Başvuru Detayları
                </h4>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Başvuru Tarihi</dt>
                    <dd className="font-medium">
                      {application.createdAt ? new Date(application.createdAt).toLocaleDateString('tr-TR') : '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mülakat</dt>
                    <dd className="font-medium">
                      {typeof application.interviewId === 'object' ? application.interviewId.title : '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Durum</dt>
                    <dd className="font-medium capitalize">{application.status}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Yönetim Paneli - responses olmasa da göster */}
            <div className="mt-8">
              <CandidateManagement application={application} />
            </div>
          </div>
        ) : (
          <>
            {/* 1. TAB MENÜSÜ (Sorular) */}
            <Tabs value={activeQuestionId} onValueChange={setActiveQuestionId} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                {application.responses.map((response, index) => (
                  <TabsTrigger key={response.questionId} value={response.questionId}>
                    Soru {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {application.responses.map((response) => (
                <TabsContent key={response.questionId} value={response.questionId} className="mt-6 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* SOL: Video ve Transkript */}
                    <div className="space-y-6">
                      <div className="rounded-xl overflow-hidden shadow-sm border bg-black/5">
                        <VideoPlayer
                          videoUrl={response.videoUrl || ""}
                          ref={videoRef}
                          onTimeUpdate={handleTimeUpdate}
                          onFullScreenToggle={handleFullScreenToggle}
                        />
                      </div>
                      <VideoTranscript transcript={response.textAnswer || "Transkript bulunamadı."} />
                    </div>

                    {/* SAĞ: Bu Soruya Ait Detaylı AI Raporu */}
                    <div>
                      <AIDetailedReports 
                        application={application}
                        activeQuestionId={activeQuestionId} 
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            {/* 2. GENEL ANALİZ ÖZETİ */}
            <div className="mt-12">
              <AIGeneralAnalysis application={application} /> 
            </div>
            
            {/* 3. YÖNETİM PANELİ (Durum Güncelleme vb.) */}
            <div className="mt-12">
              <CandidateManagement application={application} />
            </div>
          </>
        )}

      </motion.div>
    </div>
  )
}