"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useInterviewStore } from "@/store/interviewStore"

interface CandidateDetailCardProps {
  application: any
  onClose: () => void
}

export function CandidateDetailCard({ application, onClose }: CandidateDetailCardProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const updateApplicationStatus = useInterviewStore((state) => state.updateApplicationStatus)

  const handleStatusUpdate = (newStatus: string) => {
    updateApplicationStatus(application.id, newStatus)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{application.name}</CardTitle>
        <Button onClick={onClose} variant="ghost">
          Kapat
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p>Başvuru Tarihi: {new Date(application.applicationDate).toLocaleDateString()}</p>
          <Badge>{application.status}</Badge>
        </div>
        <div>
          <h3 className="font-semibold">Video Mülakat</h3>
          {application.videoResponses.length > 0 ? (
            <>
              <video src={application.videoResponses[currentVideoIndex].url} controls className="w-full" />
              <div className="flex justify-between mt-2">
                <Button
                  onClick={() => setCurrentVideoIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentVideoIndex === 0}
                >
                  Önceki
                </Button>
                <Button
                  onClick={() =>
                    setCurrentVideoIndex((prev) => Math.min(application.videoResponses.length - 1, prev + 1))
                  }
                  disabled={currentVideoIndex === application.videoResponses.length - 1}
                >
                  Sonraki
                </Button>
              </div>
            </>
          ) : (
            <p>Video cevap bulunmamaktadır.</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold">AI Analiz Sonuçları</h3>
          <p>{application.aiAnalysis}</p>
        </div>
        {application.personalityTestResult && (
          <div>
            <h3 className="font-semibold">Kişilik Testi Sonucu</h3>
            <p>{application.personalityTestResult}</p>
          </div>
        )}
        <div className="flex space-x-2">
          <Button onClick={() => handleStatusUpdate("olumlu")}>Olumlu</Button>
          <Button onClick={() => handleStatusUpdate("olumsuz")}>Olumsuz</Button>
          <Button onClick={() => handleStatusUpdate("beklemede")}>Beklemede</Button>
        </div>
      </CardContent>
    </Card>
  )
}

