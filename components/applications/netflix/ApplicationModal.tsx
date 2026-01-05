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
import type { Application, GeneralAIAnalysis } from "@/types/application";
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store";
import { useApplicationStore } from "@/store/applicationStore";

interface ApplicationModalProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateClick?: (candidateId: string) => void;
}

// Soru tipi için interface
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();
  const { updateStatus } = useApplicationStore();

  // Video kontrolü
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
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
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Soru listesi oluştur
  const questionSegments: QuestionSegment[] = application?.responses?.map((response, index) => ({
    id: response.questionId,
    questionText: `Soru ${index + 1}`,
    videoUrl: response.videoUrl,
    duration: response.duration,
    isAnalyzed: true,
  })) || [];

  // Soruya git
  const goToQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setIsLoadingAnalysis(true);
    // Simüle loading
    setTimeout(() => setIsLoadingAnalysis(false), 500);
  };

  // Favori toggle
  const toggleFavorite = () => {
    if (application) {
      if (isFavorite(application._id)) {
        removeFavorite(application._id);
      } else {
        addFavorite({
          id: application._id,
          name: `${application.candidate.name} ${application.candidate.surname}`,
          position: "Aday",
          score: application.generalAIAnalysis?.overallScore ?? 0,
        });
      }
    }
  };

  // Durum güncelle
  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected' | 'pending') => {
    if (application?._id) {
      await updateStatus(application._id, newStatus);
    }
  };

  // Zaman formatla
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!application) return null;

  const aiAnalysis = application.generalAIAnalysis;
  const currentVideo = questionSegments[selectedQuestionIndex]?.videoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-0 h-[95vh] bg-background overflow-hidden border-0">
        <div className="relative h-full flex flex-col">
          {/* ========== HEADER ========== */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-6">
            <div className="flex items-start justify-between">
              {/* Aday Bilgileri */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer
                             hover:bg-primary/30 transition-colors"
                  onClick={() => onCandidateClick?.(application.candidate.name)}
                >
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 
                    className="text-2xl font-bold text-white cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onCandidateClick?.(application.candidate.name)}
                  >
                    {application.candidate.name} {application.candidate.surname}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-gray-300">
                    <span className="flex items-center gap-1 text-sm">
                      <Mail className="h-4 w-4" />
                      {application.candidate.email}
                    </span>
                    {application.candidate.phone && (
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4" />
                        {application.candidate.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center gap-2">
                {/* AI Skor Badge */}
                {aiAnalysis?.overallScore && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <span className="text-xl font-bold text-white">{aiAnalysis.overallScore}</span>
                    <span className="text-sm text-gray-300">AI Skoru</span>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className={cn(
                    "text-white hover:bg-white/10",
                    isFavorite(application._id) && "text-yellow-400"
                  )}
                >
                  <Star className={cn("h-6 w-6", isFavorite(application._id) && "fill-yellow-400")} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-24">
            {/* Sol: Video Player */}
            <div className="lg:w-2/3 flex flex-col">
              {/* Video Area */}
              <div className="relative bg-black aspect-video">
                {currentVideo ? (
                  <video
                    ref={videoRef}
                    src={currentVideo}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Video mevcut değil</p>
                      <p className="text-sm text-gray-400">Bu soru için video yanıtı bulunmuyor</p>
                    </div>
                  </div>
                )}

                {/* Video Controls Overlay */}
                {currentVideo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Sol Kontroller */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => goToQuestion(Math.max(0, selectedQuestionIndex - 1))}
                          disabled={selectedQuestionIndex === 0}
                          className="text-white hover:bg-white/10"
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="text-white hover:bg-white/10"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => goToQuestion(Math.min(questionSegments.length - 1, selectedQuestionIndex + 1))}
                          disabled={selectedQuestionIndex === questionSegments.length - 1}
                          className="text-white hover:bg-white/10"
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>

                        <span className="text-sm text-white ml-2">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      {/* Sağ Kontroller */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/10"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <div className="w-24">
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Soru Listesi */}
              <div className="p-4 border-t border-border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mülakat Soruları ({questionSegments.length})
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {questionSegments.map((segment, index) => (
                    <Button
                      key={segment.id}
                      variant={selectedQuestionIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToQuestion(index)}
                      className={cn(
                        "flex-shrink-0",
                        selectedQuestionIndex === index && "ring-2 ring-primary"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {segment.videoUrl ? (
                          <Play className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        Soru {index + 1}
                        {segment.duration && (
                          <span className="text-xs opacity-70">
                            ({Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')})
                          </span>
                        )}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: Detay Paneli */}
            <div className="lg:w-1/3 border-l border-border flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Genel Bakış
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analysis"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    AI Analizi
                  </TabsTrigger>
                  <TabsTrigger 
                    value="question"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Soru Detayı
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                  {/* GENEL BAKIŞ */}
                  <TabsContent value="overview" className="p-4 space-y-4 mt-0">
                    {/* Durum Kartı */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Başvuru Durumu</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Durum</span>
                          <Badge variant="outline">{formatStatus(application.status)}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Başvuru Tarihi</span>
                          <span className="text-sm">{formatDate(application.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Yanıt Sayısı</span>
                          <span className="text-sm">{application.responses?.length || 0}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Hızlı Aksiyonlar */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Hızlı Aksiyonlar</CardTitle>
                      </CardHeader>
                      <CardContent className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusUpdate('accepted')}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Kabul Et
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate('rejected')}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reddet
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Kişilik Testi */}
                    {application.personalityTestResults && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Kişilik Testi
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {application.personalityTestResults.scores && 
                            Object.entries(application.personalityTestResults.scores).map(([key, value]) => (
                              <div key={key}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="capitalize">{formatPersonalityKey(key)}</span>
                                  <span>{value}%</span>
                                </div>
                                <Progress value={value} className="h-2" />
                              </div>
                            ))
                          }
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* AI ANALİZİ */}
                  <TabsContent value="analysis" className="p-4 space-y-4 mt-0">
                    {isLoadingAnalysis ? (
                      <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : aiAnalysis ? (
                      <>
                        {/* Genel Skor */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Genel AI Skoru</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-center">
                              <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-muted"
                                  />
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={`${(aiAnalysis.overallScore || 0) * 3.52} 352`}
                                    className="text-primary"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-3xl font-bold">{aiAnalysis.overallScore || 0}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Alt Skorlar */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Detaylı Skorlar</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <ScoreBar 
                              label="Teknik Beceriler" 
                              value={aiAnalysis.technicalSkillsScore} 
                              icon={<Lightbulb className="h-4 w-4" />}
                            />
                            <ScoreBar 
                              label="İletişim" 
                              value={aiAnalysis.communicationScore} 
                              icon={<MessageSquare className="h-4 w-4" />}
                            />
                            <ScoreBar 
                              label="Problem Çözme" 
                              value={aiAnalysis.problemSolvingScore} 
                              icon={<Brain className="h-4 w-4" />}
                            />
                            {aiAnalysis.personalityMatchScore && (
                              <ScoreBar 
                                label="Kişilik Uyumu" 
                                value={aiAnalysis.personalityMatchScore} 
                                icon={<User className="h-4 w-4" />}
                              />
                            )}
                          </CardContent>
                        </Card>

                        {/* Güçlü Yönler */}
                        {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-green-600">Güçlü Yönler</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {aiAnalysis.strengths.map((strength, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {/* Geliştirilebilir Alanlar */}
                        {aiAnalysis.areasForImprovement && aiAnalysis.areasForImprovement.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-amber-600">Gelişim Alanları</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                {aiAnalysis.areasForImprovement.map((item, index) => (
                                  <li key={index} className="text-sm">
                                    <p className="font-medium">{item.area}</p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                      {item.recommendedAction}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {/* Öneri */}
                        {aiAnalysis.recommendation && (
                          <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">AI Önerisi</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">{aiAnalysis.recommendation}</p>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">AI analizi henüz hazır değil</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Analiz hazırlandığında burada görüntülenecek
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* SORU DETAYI */}
                  <TabsContent value="question" className="p-4 space-y-4 mt-0">
                    {questionSegments[selectedQuestionIndex] ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Soru {selectedQuestionIndex + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Soru Metni</h4>
                            <p className="text-sm text-muted-foreground">
                              {questionSegments[selectedQuestionIndex].questionText}
                            </p>
                          </div>

                          {/* Metin Yanıtı varsa göster */}
                          {application.responses?.[selectedQuestionIndex]?.textAnswer && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Metin Yanıtı</h4>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                {application.responses[selectedQuestionIndex].textAnswer}
                              </p>
                            </div>
                          )}

                          {/* Soru Analizi */}
                          <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Soru Analizi
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Bu soru için detaylı AI analizi yükleniyor...
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Soru seçilmedi</p>
                      </div>
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

// ========== YARDIMCI COMPONENTLER ==========

function ScoreBar({ label, value, icon }: { label: string; value?: number; icon: React.ReactNode }) {
  const score = value ?? 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="font-medium">{score}%</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}

// ========== YARDIMCI FONKSİYONLAR ==========

function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    pending: "Beklemede",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    rejected: "Reddedildi",
    accepted: "Kabul Edildi",
    awaiting_video_responses: "Video Bekleniyor",
    awaiting_ai_analysis: "AI Analizi Bekleniyor",
  };
  return statusMap[status] || status;
}

function formatPersonalityKey(key: string) {
  const keyMap: Record<string, string> = {
    openness: "Açıklık",
    conscientiousness: "Sorumluluk",
    extraversion: "Dışa Dönüklük",
    agreeableness: "Uyumluluk",
    neuroticism: "Duygusal Denge",
  };
  return keyMap[key] || key;
}
