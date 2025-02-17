"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock } from "lucide-react";
import type { Interview, InterviewApplicant, InterviewStatus } from "@/types/interview";

interface InterviewCardProps {
  interview: Interview;
  isFeatured?: boolean;
}

// ✅ Durumlara uygun badge renkleri
const statusColors: Record<InterviewStatus, string> = {
  active: "bg-green-500 text-white",
  completed: "bg-gray-500 text-white",
  published: "bg-blue-500 text-white",
  draft: "bg-yellow-500 text-white",
  inactive: "bg-red-500 text-white",
};

export function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Başlık ve Açıklama */}
        <h3 className="text-lg font-semibold mb-2">{interview.title}</h3>
        {interview.questions.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {interview.questions.length} soru içeriyor.
          </p>
        )}

        {/* Tarih Kontrolü */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {interview.expirationDate
              ? new Date(interview.expirationDate).toLocaleDateString()
              : "Belirtilmemiş"}
          </span>
        </div>

        {/* Katılımcı Sayısı */}
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {interview.stages.personalityTest ? "Kişilik Testi Var" : "Sadece Soru Seti"} | {interview.questions.length} soru
          </span>
        </div>

        {/* Süre Bilgisi */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{interview.questions.reduce((total, q) => total + q.duration, 0) || 0} dakika</span>
        </div>

        {/* Durum Bilgisi */}
        <Badge className={statusColors[interview.status]}>
          {interview.status ?? "Bilinmiyor"}
        </Badge>

        {/* Başvuran Sayısı */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Başvuran Sayısı:</h4>
          <p className="text-sm">{interview.questions.length ?? 0} kişi başvurdu</p>
        </div>

        {/* Son Başvuran Bilgisi */}
        {interview.questions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Son Başvuran:</h4>
            <p className="text-sm">{interview.questions[0].questionText ?? "Bilinmiyor"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
