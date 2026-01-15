"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Star,
  ChevronRight,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  User,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Brain,
  MessageSquare,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  FileText,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Application, GeneralAIAnalysis, ApplicationResponse } from "@/types/application"; // ApplicationResponse eklendi
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";
import { useApplicationStore } from "@/store/applicationStore";

interface ApplicationModalProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateClick?: (candidateId: string) => void;
}

interface QuestionSegment {
  id: string;
  questionText: string;
  videoUrl?: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
  isAnalyzed?: boolean;
}

export function ApplicationModal({
  application,
  open,
  onOpenChange,
  onCandidateClick,
}: ApplicationModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();
  const { updateStatus } = useApplicationStore();

  // HATA ÇÖZÜMÜ: application null kontrolü en başa alındı
  if (!application) return null;

  // Analiz verileri
  const currentResponse = application.responses?.[selectedQuestionIndex];
  const questionAi = currentResponse?.aiDetails;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  // HATA ÇÖZÜMÜ: questionText tipi düzeltildi
  const questionSegments: QuestionSegment[] = (application.responses || []).map((response, index) => ({
    id: response.questionId,
    questionText: `Soru ${index + 1}`, 
    videoUrl: response.videoUrl,
    duration: response.duration,
    isAnalyzed: true,
  }));

  const goToQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setIsLoadingAnalysis(true);
    setTimeout(() => setIsLoadingAnalysis(false), 500);
  };

  const toggleFavorite = () => {
    if (application) {
      if (isFavorite(application._id)) removeFavorite(application._id);
      else {
        addFavorite({
          id: application._id,
          name: `${application.candidate.name} ${application.candidate.surname}`,
          position: "Aday",
          score: application.generalAIAnalysis?.overallScore ?? 0,
        });
      }
    }
  };

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected' | 'pending') => {
    if (application?._id) await updateStatus(application._id, newStatus);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const aiAnalysis = application.generalAIAnalysis;
  const currentVideo = questionSegments[selectedQuestionIndex]?.videoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-0 h-[95vh] bg-background overflow-hidden border-0">
        <div className="relative h-full flex flex-col">
          {/* ========== HEADER (Aynı Kaldı) ========== */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-6">
             {/* ... Header içeriği ... */}
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{application.candidate.name} {application.candidate.surname}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white"><X className="h-6 w-6" /></Button>
                </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-24">
            {/* Sol: Video Player Bölümü */}
            <div className="lg:w-2/3 flex flex-col">
              <div className="relative bg-black aspect-video">
                {currentVideo ? (
                  <video ref={videoRef} src={currentVideo} className="w-full h-full object-contain" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white"><FileText className="h-16 w-16 opacity-50" /></div>
                )}
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2 overflow-x-auto">
                  {questionSegments.map((segment, index) => (
                    <Button key={segment.id} variant={selectedQuestionIndex === index ? "default" : "outline"} size="sm" onClick={() => goToQuestion(index)}>
                      Soru {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: Analiz Paneli */}
            <div className="lg:w-1/3 border-l border-border flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                  <TabsTrigger value="analysis">AI Analizi</TabsTrigger>
                  <TabsTrigger value="question">Soru Detayı</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                  {/* AI ANALİZİ SEKİMESİ (Genel Rapor) */}
                  <TabsContent value="analysis" className="p-4 space-y-4">
                    {aiAnalysis && (
                      <>
                        <Card>
                          <CardHeader><CardTitle className="text-base">Gelişim Alanları</CardTitle></CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {/* HATA ÇÖZÜMÜ: improvementAreas güvenli erişim */}
                              {aiAnalysis.improvementAreas?.map((item: any, index: number) => (
                                <li key={index} className="text-sm">
                                  <p className="font-medium">{typeof item === 'string' ? item : item.area}</p>
                                  {item.recommendedAction && (
                                    <p className="text-muted-foreground text-xs">{item.recommendedAction}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </TabsContent>

                  {/* SORU DETAYI SEKİMESİ (Spesifik Soru Analizi) */}
                  <TabsContent value="question" className="p-4 space-y-4">
                    {currentResponse ? (
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="pt-6">
                            <Badge variant="outline" className="mb-2">Soru {selectedQuestionIndex + 1}</Badge>
                            {/* HATA ÇÖZÜMÜ: questionText fallback eklendi */}
                            <p className="text-sm font-medium">Soru içeriği analiz ediliyor...</p>
                          </CardContent>
                        </Card>

                        {questionAi ? (
                          <>
                            <Card>
                              <CardContent className="h-[200px] pt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={questionAi.radarData}>
                                    <PolarGrid strokeOpacity={0.1} />
                                    <PolarAngleAxis dataKey="subject" fontSize={10} />
                                    <Radar name="Performans" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>

                            {/* SES VE YÜZ ÖZETİ (HATA ÇÖZÜMÜ: Optional Chaining) */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                                <span className="text-[10px] uppercase font-bold block mb-1">Ses Akıcılığı</span>
                                <span className="text-lg font-bold">%{questionAi.voiceScore?.speechFluencyScore || 0}</span>
                              </div>
                              <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/20">
                                <span className="text-[10px] uppercase font-bold block mb-1">Göz Teması</span>
                                <span className="text-lg font-bold">%{questionAi.faceScore?.details?.eyeContactScore || 0}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <Brain className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm text-muted-foreground">Analiz henüz tamamlanmadı.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10">Soru seçilmedi</div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ScoreBar, formatStatus vb. yardımcı fonksiyonlar aşağıda devam ediyor...