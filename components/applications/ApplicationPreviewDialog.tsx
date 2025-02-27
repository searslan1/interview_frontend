"use client";

import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, VolumeX, X, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import useApplicationStore from "@/store/applicationStore";
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";

interface ApplicationPreviewDialogProps {
  applicationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationPreviewDialog({ applicationId, open, onOpenChange }: ApplicationPreviewDialogProps) {
  const { application, fetchApplication } = useApplicationStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open && applicationId) {
      fetchApplication(applicationId);
    }
  }, [open, applicationId, fetchApplication]);

  if (!application) return null;

  const toggleFavorite = () => {
    if (application) {
      if (isFavorite(application._id)) {
        removeFavorite(application._id);
      } else {
        addFavorite({
          id: application._id,
          name: application.candidate.name,
          position: "Aday", // Pozisyon backend'de yoksa statik bir değer
          score: application.generalAIAnalysis?.overallScore ?? 0,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 h-[90vh] bg-black/95 text-white overflow-hidden">
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{application.candidate.name} {application.candidate.surname}</h2>
                <p className="text-gray-400">{application.candidate.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className={`text-white ${isFavorite(application._id) ? "text-yellow-400" : ""}`}
                >
                  <Star className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                src="/placeholder-video.mp4" // Gerçek video URL'si backend'den gelmeli
                className="w-full h-full object-contain bg-black"
              />
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="overview" className="h-full">
              <div className="border-b border-white/10">
                <TabsList className="bg-transparent border-b border-white/10">
                  <TabsTrigger value="overview" className="text-white">Genel Bakış</TabsTrigger>
                  <TabsTrigger value="responses" className="text-white">Yanıtlar</TabsTrigger>
                  <TabsTrigger value="analysis" className="text-white">AI Analizi</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[calc(90vh-600px)] px-4">
                {/* Overview */}
                <TabsContent value="overview" className="mt-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Başvuru Bilgileri</h3>
                        <Badge variant="outline">{formatStatus(application.status)}</Badge>
                      </div>
                      <div className="mt-2 text-gray-400">
                        <p><strong>AI Skoru:</strong> {application.generalAIAnalysis?.overallScore ?? "N/A"}</p>
                        <p><strong>Kişilik Tipi:</strong> {application.personalityTestResults?.personalityFit ?? "Bilinmiyor"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Responses */}
                <TabsContent value="responses" className="mt-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">Mülakat Yanıtları</h3>
                      {application.responses.length > 0 ? (
                        application.responses.map((response) => (
                          <div key={response.questionId} className="mt-2">
                            <p className="text-gray-400"><strong>Soru ID:</strong> {response.questionId}</p>
                            <p className="text-white">{response.textAnswer ?? "Yanıt yok"}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">Henüz yanıt verilmemiş.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* AI Analysis */}
                <TabsContent value="analysis" className="mt-4">
                  <div className="grid gap-4">
                    {Object.entries(application.generalAIAnalysis || {}).map(([key, value]) => (
                      <Card key={key} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{formatAIKey(key)}</h3>
                            <span className="text-2xl font-bold">{value as number}%</span>
                          </div>
                          <Progress value={Number(value)} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Yardımcı Fonksiyonlar
function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    pending: "Beklemede",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    rejected: "Reddedildi",
    accepted: "Kabul Edildi",
  };
  return statusMap[status] || status;
}

function formatAIKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").trim().replace(/\b\w/g, (l) => l.toUpperCase());
}
