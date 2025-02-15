"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock } from "lucide-react"
import type { Interview } from "@/types/interview"

interface InterviewCardProps {
  interview: Interview
  isFeatured?: boolean;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{interview.title}</h3>
        {interview.description && (
          <p className="text-sm text-gray-500 mb-4">{interview.description}</p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {interview.expirationDate.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {interview.currentParticipants} / {interview.maxParticipants ?? "Sınırsız"}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{interview.totalDuration ?? 0} dakika</span>
        </div>
        <Badge variant={interview.status === "active" ? "default" : "secondary"}>
          {interview.status === "active" ? "Aktif" : "Pasif"}
        </Badge>
        
        {/* Başvuru sayısını gösterelim */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Başvuran Sayısı:</h4>
          <p className="text-sm">{interview.applicantsCount} kişi başvurdu</p>
        </div>

        {/* Eğer applicants dizisi varsa ve boş değilse son başvuranı gösterelim */}
        {interview.applicants && interview.applicants.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Son Başvuran:</h4>
            <p className="text-sm">{interview.applicants[0].name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
