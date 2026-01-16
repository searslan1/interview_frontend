"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Clock,
  Plus,
  Edit,
  Trash2,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Application, GeneralAIAnalysis, ApplicationResponse } from "@/types/application"; // ApplicationResponse eklendi
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/store/authStore";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const [newNote, setNewNote] = useState("");
  const [rating, setRating] = useState(0);

  const { updateStatus, addNote, updateRating, toggleFavoriteAction } = useApplicationStore();
  const { user } = useAuthStore();
  const router = useRouter();

  // ✅ Favori durumunu hesapla (favoriteBy array'inden)
  const isFavorite = useMemo(() => {
    if (!application?.favoriteBy || !user?._id) return false;
    return application.favoriteBy.includes(user._id);
  }, [application?.favoriteBy, user?._id]);

  // Rating'i application'dan al
  useEffect(() => {
    if (application) {
      setRating(application.hrReview?.rating || 0);
    }
  }, [application?._id]);

  // HATA ÇÖZÜMÜ: Hook'lardan sonra early return
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

  const toggleFavoriteHandler = () => {
    if (application) {
      // ✅ Backend entegreli favori toggle (isFavorite useMemo'dan geliyor)
      toggleFavoriteAction(application._id, !isFavorite);
    }
  };

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected' | 'pending' | 'archived') => {
    if (application?._id) await updateStatus(application._id, newStatus);
  };

  const handleAddNote = async () => {
    if (!application?._id || !newNote.trim()) return;
    try {
      await addNote(application._id, newNote.trim(), false);
      setNewNote("");
    } catch (error) {
      console.error("Not eklenirken hata:", error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    if (!application?._id) return;
    setRating(newRating);
    try {
      await updateRating(application._id, newRating);
    } catch (error) {
      console.error("Rating güncellenirken hata:", error);
    }
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
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      router.push(`/applications/${application._id}`);
                    }}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">Detaylı Görünüm</span>
                  </Button>
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
                  {/* GENEL BAKIŞ SEKMESİ (Aday Bilgileri) */}
                  <TabsContent value="overview" className="p-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Aday Bilgileri</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Ad Soyad</p>
                            <p className="font-medium">{application.candidate.name} {application.candidate.surname}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">E-posta</p>
                            <p className="font-medium">{application.candidate.email}</p>
                          </div>
                        </div>

                        {application.candidate.phone && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Telefon</p>
                              <p className="font-medium">{application.candidate.phone}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Başvuru Tarihi</p>
                            <p className="font-medium">{formatDate(application.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Durum</p>
                            <Badge variant="outline">{application.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Genel Skoru */}
                    {aiAnalysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">AI Değerlendirme Özeti</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Genel Skor</span>
                            <span className="text-2xl font-bold text-primary">
                              {aiAnalysis.overallScore || 0}
                            </span>
                          </div>
                          
                          {aiAnalysis.technicalSkillsScore !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Teknik Beceriler</span>
                                <span className="font-medium">{aiAnalysis.technicalSkillsScore}</span>
                              </div>
                              <Progress value={aiAnalysis.technicalSkillsScore} className="h-2" />
                            </div>
                          )}

                          {aiAnalysis.communicationScore !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">İletişim</span>
                                <span className="font-medium">{aiAnalysis.communicationScore}</span>
                              </div>
                              <Progress value={aiAnalysis.communicationScore} className="h-2" />
                            </div>
                          )}

                          {aiAnalysis.problemSolvingScore !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Problem Çözme</span>
                                <span className="font-medium">{aiAnalysis.problemSolvingScore}</span>
                              </div>
                              <Progress value={aiAnalysis.problemSolvingScore} className="h-2" />
                            </div>
                          )}

                          {aiAnalysis.recommendation && (
                            <div className="pt-3 border-t">
                              <p className="text-sm text-muted-foreground mb-1">Öneri</p>
                              <p className="text-sm">{aiAnalysis.recommendation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Güçlü Yönler */}
                    {aiAnalysis?.strengths && aiAnalysis.strengths.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            Güçlü Yönler
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysis.strengths.map((strength, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Aksiyon Butonları */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleStatusUpdate('accepted')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Kabul Et
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleStatusUpdate('rejected')}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Reddet
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleStatusUpdate('archived')}
                      >
                        <Archive className="h-4 w-4" />
                        Arşivle
                      </Button>
                    </div>

                    {/* HR Rating */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">İK Değerlendirme</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Puan:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRatingChange(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={cn(
                                    "h-5 w-5 transition-colors cursor-pointer",
                                    (rating || application.hrReview?.rating || 0) >= star
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-sm font-medium ml-2">
                            {rating || application.hrReview?.rating || 0} / 5
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* HR Notes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          İK Notları
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Mevcut Notlar */}
                        {application.hrNotes && application.hrNotes.length > 0 ? (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {application.hrNotes.map((note) => (
                              <div
                                key={note._id}
                                className="p-3 bg-muted/50 rounded-lg text-sm"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium text-xs">
                                    {note.userName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(note.createdAt).toLocaleDateString("tr-TR")}
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Henüz not eklenmemiş</p>
                        )}

                        {/* Yeni Not Ekleme */}
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Yeni not ekle..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="min-h-[60px]"
                          />
                          <Button
                            size="sm"
                            onClick={handleAddNote}
                            disabled={!newNote.trim()}
                            className="w-full gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Not Ekle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

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