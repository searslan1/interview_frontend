"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Application } from "@/types/application";
import useApplicationStore from "../../store/applicationStore"; // Güvenilirlik için göreceli yol
import { useToast } from "@/components/ui/use-toast";

interface CandidateDetailCardProps {
  application: Application;
  onClose: () => void;
}

// updateStatus'un beklediği sınırlı durumlar
type UpdatableStatus = 'pending' | 'rejected' | 'accepted';

export function CandidateDetailCard({ application, onClose }: CandidateDetailCardProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { updateStatus, loading } = useApplicationStore(); 
  const { toast } = useToast();

  // ✅ DÜZELTME: Sadece updatable status tipleri kabul ediliyor.
  const handleStatusUpdate = async (newStatus: UpdatableStatus) => {
    if (!application._id || loading) return;

    try {
        await updateStatus(application._id, newStatus);
        
        toast({
            title: "Durum Güncellendi",
            description: `Başvuru durumu başarıyla "${ (newStatus)}" olarak ayarlandı.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Hata",
            description: "Başvuru durumu güncellenirken bir sorun oluştu.",
        });
    }
  };
  
  // ✅ DÜZELTME: Video yanıtları için kontrol dizisi (URL'i olanlar)
  const videoResponses = application.responses.filter(r => r.videoUrl); // Tip uyumsuzluğu düzeltildi


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
          <StatusBadge status={application.status} className="mt-2" />
        </div>

        {/* Video Mülakat */}
        <div>
          <h3 className="font-semibold">Video Mülakat</h3>
          {videoResponses.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-2">
                Soru {currentVideoIndex + 1} / {videoResponses.length}
              </p>
              
              <video
                // ✅ DÜZELTME: Video kaynağı responses dizisinden 'videoUrl' ile çekiliyor
                src={videoResponses[currentVideoIndex].videoUrl} 
                controls
                className="w-full rounded-lg shadow-md"
              />
              <div className="flex justify-between mt-2">
                <Button
                  onClick={() => setCurrentVideoIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentVideoIndex === 0}
                >
                  Önceki Soru
                </Button>
                <Button
                  onClick={() =>
                    setCurrentVideoIndex((prev) => Math.min(videoResponses.length - 1, prev + 1))
                  }
                  disabled={currentVideoIndex === videoResponses.length - 1}
                >
                  Sonraki Soru
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Video cevap bulunmamaktadır veya AI analizi beklenmektedir.</p>
          )}
        </div>

        {/* AI Analiz Sonuçları */}
        {application.generalAIAnalysis && (
            <div className="border-t pt-4">
            <h3 className="font-semibold text-lg text-purple-700">🤖 AI Analiz Özeti</h3>
            <p className="text-sm">
                <strong>Genel Skor:</strong> <span className="font-bold text-xl">{application.generalAIAnalysis?.overallScore ?? "N/A"}</span>/100
            </p>
            <p>
                <strong>Teknik Skor:</strong> {application.generalAIAnalysis?.technicalSkillsScore ?? "N/A"}
            </p>
            
            <h4 className="font-medium mt-3 text-gray-700">Önerilen Gelişim Alanları:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
                {application.generalAIAnalysis.areasForImprovement?.map((item, index) => (
                    <li key={index} className="py-1">
                        **{item.area}**: {item.recommendedAction}
                    </li>
                ))}
            </ul>
            </div>
        )}

        {/* Kişilik Testi Sonucu */}
        {application.personalityTestResults && application.personalityTestResults.completed && (
          <div className="border-t pt-4">
            <h3 className="font-semibold">🧠 Kişilik Testi Sonucu</h3>
            <p>
              <strong>Kişilik Uyum Skoru:</strong> {application.personalityTestResults.personalityFit ?? "N/A"}
            </p>
          </div>
        )}

        {/* Durum Güncelleme Butonları */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button 
            // ✅ DÜZELTME: Sadece updatable status gönderiliyor
            onClick={() => handleStatusUpdate("accepted")} 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading && application.status !== 'accepted' ? "Kaydediliyor..." : "Kabul Et"}
          </Button>
          <Button 
            // ✅ DÜZELTME: Sadece updatable status gönderiliyor
            onClick={() => handleStatusUpdate("rejected")} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            Reddet
          </Button>
          <Button 
            // ✅ DÜZELTME: Sadece updatable status gönderiliyor
            onClick={() => handleStatusUpdate("pending")} 
            variant="secondary"
            disabled={loading}
          >
            Beklemeye Al
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Tarih formatını düzenleme fonksiyonu
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
