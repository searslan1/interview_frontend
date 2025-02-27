"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock } from "lucide-react";
import type { Interview, InterviewStatus } from "@/types/interview";

// ✅ Durumlara uygun badge renkleri
const statusColors: Record<InterviewStatus, string> = {
  active: "bg-green-500 text-white",
  completed: "bg-gray-500 text-white",
  published: "bg-blue-500 text-white",
  draft: "bg-yellow-500 text-white",
  inactive: "bg-red-500 text-white",
};

interface InterviewCardProps {
  interview: Interview;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const router = useRouter();

  // ✅ Mülakat süresini hesapla (Boş array hatası önlendi)
  const totalDuration = interview.questions?.reduce((total, q) => total + q.duration, 0) || 0;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => router.push(`/interviews/${interview._id}`)}
    >
      <CardContent className="p-4">
        {/* Başlık ve Açıklama */}
        <h3 className="text-lg font-semibold mb-2">{interview.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {interview.questions?.length ?? 0} soru içeriyor.
        </p>

        {/* Tarih Bilgisi */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {interview.expirationDate
              ? new Date(interview.expirationDate).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Belirtilmemiş"}
          </span>
        </div>

        {/* Katılımcı Bilgisi */}
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {interview.stages.personalityTest ? "Kişilik Testi Var" : "Sadece Soru Seti"} | {interview.questions?.length ?? 0} soru
          </span>
        </div>

        {/* Süre Bilgisi */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{totalDuration} dakika</span>
        </div>

        {/* Durum Bilgisi */}
        <Badge className={statusColors[interview.status]}>
          {interview.status ?? "Bilinmiyor"}
        </Badge>
      </CardContent>
    </Card>
  );
}
