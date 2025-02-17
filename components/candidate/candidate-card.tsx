"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Link, FileText } from "lucide-react";
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";
import type { Candidate } from "@/types/candidate";

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

  const toggleFavorite = () => {
    if (isFavorite(candidate.id)) {
      removeFavorite(candidate.id);
    } else {
      addFavorite({
        id: candidate.id,
        name: candidate.name,
        position: candidate.appliedPosition,
        score: candidate.interviews.length > 0 ? candidate.interviews[0].score : 0, // En son mülakat skoru
      });
    }
  };

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
            <span className="text-sm">{candidate.appliedPosition}</span>
            <Badge
              variant={candidate.interviews.length > 0 && candidate.interviews[0].score >= 70 ? "default" : "secondary"}
            >
              {candidate.interviews.length > 0
                ? `Mülakat Skoru: ${candidate.interviews[0].score}`
                : "Mülakat Yapılmadı"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Başvuru Tarihi: {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "Bilinmiyor"}
          </div>

          {/* 🔗 Sosyal Medya ve Özgeçmiş Bağlantıları */}
          <div className="flex gap-2 mt-2">
            {candidate.resumeUrl && (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-blue-500 hover:underline"
              >
                <FileText className="w-4 h-4 mr-1" /> CV
              </a>
            )}
            {candidate.linkedInProfile && (
              <a
                href={candidate.linkedInProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-blue-500 hover:underline"
              >
                <Link className="w-4 h-4 mr-1" /> LinkedIn
              </a>
            )}
            {candidate.github && (
              <a
                href={candidate.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-blue-500 hover:underline"
              >
                <Link className="w-4 h-4 mr-1" /> GitHub
              </a>
            )}
            {candidate.portfolio && (
              <a
                href={candidate.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-blue-500 hover:underline"
              >
                <Link className="w-4 h-4 mr-1" /> Portfolio
              </a>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold">AI Skoru: {candidate.interviews.length > 0 ? candidate.interviews[0].score : "N/A"}</span>
            <Button variant="ghost" size="sm" onClick={toggleFavorite}>
              <Star className={`h-4 w-4 ${isFavorite(candidate.id) ? "fill-yellow-400" : ""}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
