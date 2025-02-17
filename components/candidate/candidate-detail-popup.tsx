"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/candidate/video-player"
import { AIReport } from "@/components/candidate/ai-report"
import { QuestionReview } from "@/components/interview/question-review"

interface CandidateDetailPopupProps {
  applicationId: number
  onClose: () => void
}

export function CandidateDetailPopup({ applicationId, onClose }: CandidateDetailPopupProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Mock data for the candidate
  const candidate = {
    name: "John Doe",
    status: "İnceleniyor",
    aiScore: 85,
    personalityType: "INTJ",
    videoUrl: "https://example.com/interview-video.mp4",
  }

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className={`max-w-full ${isFullScreen ? "h-screen" : "max-h-[90vh]"} overflow-hidden`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex justify-between items-center">
                <span>{candidate.name}</span>
                <Button onClick={() => setIsFullScreen(!isFullScreen)}>{isFullScreen ? "Küçült" : "Tam Ekran"}</Button>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Badge variant={candidate.status === "Tamamlandı" ? "default" : "secondary"}>{candidate.status}</Badge>
              <span className="ml-2">AI Skoru: {candidate.aiScore}</span>
              <span className="ml-2">Kişilik: {candidate.personalityType}</span>
            </div>
            <Tabs defaultValue="video" className="mt-6">
              <TabsList>
                <TabsTrigger value="video">Video Mülakat</TabsTrigger>
                <TabsTrigger value="ai-report">AI Raporu</TabsTrigger>
                <TabsTrigger value="questions">Soru Bazlı İnceleme</TabsTrigger>
              </TabsList>
              <TabsContent value="video">
                <VideoPlayer videoUrl={candidate.videoUrl} />
              </TabsContent>
              <TabsContent value="ai-report">
                <AIReport applicationId={applicationId} />
              </TabsContent>
              <TabsContent value="questions">
                <QuestionReview applicationId={applicationId} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  )
}

