"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store"

interface CandidateCardProps {
  candidate: {
    id: string
    name: string
    position: string
    applicationDate: string
    status: string
    aiScore: number
  }
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore()

  const toggleFavorite = () => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{candidate.name}</CardTitle>
        <Avatar className="h-9 w-9">
          <AvatarImage src={`https://i.pravatar.cc/36?u=${candidate.id}`} alt={candidate.name} />
          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">{candidate.position}</span>
            <Badge variant={candidate.status === "Olumlu" ? "success" : "secondary"}>{candidate.status}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">Başvuru: {candidate.applicationDate}</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">AI Skoru: {candidate.aiScore}</span>
            <Button variant="ghost" size="sm" onClick={toggleFavorite}>
              <Star className={`h-4 w-4 ${isFavorite(candidate.id) ? "fill-yellow-400" : ""}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

