"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CandidateDetailReview } from "@/components/candidate/candidate-detail-review"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store"

export default function CandidateDetailPage() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState<any>(null)
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore()

  useEffect(() => {
    // In a real application, you would fetch the candidate data here
    // For now, we'll use mock data
    setCandidate({
      id,
      name: "John Doe",
      position: "Senior Software Engineer",
      status: "İnceleniyor",
      aiScore: 85,
      personalityType: "INTJ",
      videoUrl: "https://example.com/interview-video.mp4",
    })
  }, [id])

  const toggleFavorite = () => {
    if (candidate) {
      if (isFavorite(candidate.id)) {
        removeFavorite(candidate.id)
      } else {
        addFavorite({
          id: candidate.id,
          name: candidate.name,
          position: candidate.position,
          score: candidate.aiScore,
        })
      }
    }
  }

  if (!candidate) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite(candidate.id) ? "text-yellow-400" : ""}
            >
              <Star className="h-6 w-6" />
            </Button>
          </div>
          <CandidateDetailReview candidate={candidate} />
        </div>
      </main>
    </div>
  )
}

