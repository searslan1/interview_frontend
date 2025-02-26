"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Application } from "@/types/application";

interface CandidateDetailCardProps {
  application: Application;
  onClose: () => void;
}

export function CandidateDetailCard({ application, onClose }: CandidateDetailCardProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // ✅ Durumu değiştirecek bir API isteği buraya eklenebilir.
  const handleStatusUpdate = (newStatus: Application["status"]) => {
    console.log(`Başvuru durumu güncellendi: ${newStatus}`);
    // Burada bir API isteği yapılabilir (örn. PATCH /applications/:id)
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>
          {application.candidate.name} {application.candidate.surname}
        </CardTitle>
        <Button onClick={onClose} variant="ghost">
          Kapat
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Başvuru Bilgileri */}
        <div>
          <p>
            <strong>Başvuru Tarihi:</strong> {formatDate(application.createdAt)}
          </p>
          <Badge className={getStatusBadge(application.status)}>
            {formatStatus(application.status)}
          </Badge>
        </div>

        {/* Video Mülakat */}
        <div>
          <h3 className="font-semibold">Video Mülakat</h3>
          {application.aiAnalysisResults.length > 0 ? (
            <>
              <video
                src={`/videos/${application.aiAnalysisResults[currentVideoIndex]}.mp4`} // ✅ Video URL yapısı düzenlendi
                controls
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <Button
                  onClick={() => setCurrentVideoIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentVideoIndex === 0}
                >
                  Önceki
                </Button>
                <Button
                  onClick={() =>
                    setCurrentVideoIndex((prev) => Math.min(application.aiAnalysisResults.length - 1, prev + 1))
                  }
                  disabled={currentVideoIndex === application.aiAnalysisResults.length - 1}
                >
                  Sonraki
                </Button>
              </div>
            </>
          ) : (
            <p>Video cevap bulunmamaktadır.</p>
          )}
        </div>

        {/* AI Analiz Sonuçları */}
        <div>
          <h3 className="font-semibold">AI Analiz Sonuçları</h3>
          <p>
            <strong>Genel Skor:</strong> {application.generalAIAnalysis?.overallScore ?? "N/A"}
          </p>
          <p>
            <strong>Teknik Skor:</strong> {application.generalAIAnalysis?.technicalSkillsScore ?? "N/A"}
          </p>
          <p>
            <strong>İletişim Skoru:</strong> {application.generalAIAnalysis?.communicationScore ?? "N/A"}
          </p>
          <p>
            <strong>Problem Çözme Skoru:</strong> {application.generalAIAnalysis?.problemSolvingScore ?? "N/A"}
          </p>
        </div>

        {/* Kişilik Testi Sonucu */}
        {application.personalityTestResults && (
          <div>
            <h3 className="font-semibold">Kişilik Testi Sonucu</h3>
            <p>
              <strong>Kişilik Uyum Skoru:</strong> {application.personalityTestResults.personalityFit ?? "N/A"}
            </p>
          </div>
        )}

        {/* Durum Güncelleme Butonları */}
        <div className="flex space-x-2">
          <Button onClick={() => handleStatusUpdate("accepted")} className="bg-green-500 text-white">
            Olumlu
          </Button>
          <Button onClick={() => handleStatusUpdate("rejected")} className="bg-red-500 text-white">
            Olumsuz
          </Button>
          <Button onClick={() => handleStatusUpdate("pending")} className="bg-yellow-500 text-white">
            Beklemede
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ✅ Durum renkleri
function getStatusBadge(status: Application["status"]) {
  const statusClasses: Record<Application["status"], string> = {
    accepted: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
    pending: "bg-yellow-500 text-white",
    in_progress: "bg-blue-500 text-white",
    completed: "bg-green-500 text-white",
  };
  return statusClasses[status] || "bg-gray-500 text-white";
}

// ✅ Status için Türkçe dönüşüm
function formatStatus(status: Application["status"]) {
  const statusMap: Record<Application["status"], string> = {
    pending: "Beklemede",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    rejected: "Reddedildi",
    accepted: "Kabul Edildi",
  };
  return statusMap[status] || status;
}

// ✅ Tarih formatını düzenleme fonksiyonu
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
