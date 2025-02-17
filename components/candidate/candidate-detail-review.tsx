"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { VideoPlayer } from "@/components/candidate/video-player"
import { AIGeneralAnalysis } from "@/components/candidate/ai-general-analysis"
import { AIDetailedReports } from "@/components/candidate/ai-detailed-reports"
import { QuestionReview } from "@/components/interview/question-review"
import { CandidateManagement } from "@/components/candidate/candidate-management"

interface CandidateDetailReviewProps {
  candidate: any // Replace with a proper type
}

export function CandidateDetailReview({ candidate }: CandidateDetailReviewProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <section className="relative">
          <VideoPlayer
            videoUrl={candidate.videoUrl}
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onFullScreenToggle={handleFullScreenToggle}
          />
          <AIGeneralAnalysis candidate={candidate} currentTime={currentTime} />
        </section>

        <AIDetailedReports candidate={candidate} />

        <QuestionReview candidate={candidate} currentTime={currentTime} />

        <CandidateManagement candidate={candidate} />
      </motion.div>
    </div>
  )
}

