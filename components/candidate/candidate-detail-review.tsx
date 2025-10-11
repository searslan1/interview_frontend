"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { VideoPlayer } from "@/components/candidate/video-player"
import { AIGeneralAnalysis } from "@/components/candidate/ai-general-analysis"
import { AIDetailedReports } from "@/components/candidate/ai-detailed-reports"
import { CandidateManagement } from "@/components/candidate/candidate-management"
import { VideoTranscript } from "@/components/candidate/video-transcript"; // Modüler bileşen import edildi
import { Application, ApplicationResponse } from "@/types/application" 
import { Card, CardContent } from "@/components/ui/card" 
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" 

interface CandidateDetailReviewProps {
  application: Application // Tip Application
}

export function CandidateDetailReview({ application }: CandidateDetailReviewProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    application.responses[0]?.questionId || ''
  );

  // 🚀 HATA ÇÖZÜMÜ 1: Eksik fonksiyonlar buraya eklendi
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
  // ----------------------------------------------------

  useEffect(() => {
    if (application.responses.length > 0 && !activeQuestionId) {
        setActiveQuestionId(application.responses[0].questionId);
    }
    
    // Fullscreen değişim dinleyicisi de burada kalır
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [application.responses, activeQuestionId])
  
  const activeResponse = useMemo<ApplicationResponse | undefined>(() => {
    return application.responses.find(r => r.questionId === activeQuestionId);
  }, [application.responses, activeQuestionId]);

  const activeVideoUrl = activeResponse?.videoUrl || "";
  const activeTranscript = activeResponse?.textAnswer || "";
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Soru Seçimi (Tabs) */}
        <Tabs value={activeQuestionId} onValueChange={setActiveQuestionId}>
          <TabsList className="w-full">
            {application.responses.map((response, index) => (
              <TabsTrigger key={response.questionId} value={response.questionId}>
                Soru {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {application.responses.map((response) => (
            <TabsContent key={response.questionId} value={response.questionId} className="mt-4">
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Video Oynatıcı ve Transkripsiyon */}
                <div>
                  <VideoPlayer
                    videoUrl={activeVideoUrl}
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate} // ✅ Kapsam hatası çözüldü
                    onFullScreenToggle={handleFullScreenToggle} // ✅ Kapsam hatası çözüldü
                  />
                  <VideoTranscript transcript={activeTranscript} />
                </div>

                {/* 2. Detaylı AI Raporları (Seçilen Soruya Özel) */}
                <div>
                    <AIDetailedReports 
                        // 🚀 HATA ÇÖZÜMÜ 2: Prop adı 'candidate' olarak düzeltildi
                        candidate={application as any} // Alt bileşen 'candidate' beklediği için 'application' gönderildi
                        activeQuestionId={activeQuestionId} 
                    />
                </div>
              </section>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Genel Analiz (Tüm Videoların Özeti) */}
        <AIGeneralAnalysis application={application} /> 
        
        {/* Yönetim Araçları */}
        <CandidateManagement 
            // 🚀 HATA ÇÖZÜMÜ 2: Prop adı 'candidate' olarak düzeltildi
            candidate={application as any} 
        />
      </motion.div>
    </div>
  )
}