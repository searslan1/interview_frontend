"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress"; // Eğer projenizde yoksa basit div kullanılabilir
import { Interview, InterviewQuestion } from "@/types/interview";
import { Clock, Calendar, Briefcase, BrainCircuit, Eye, Mic, Activity, MessageSquare, CheckCircle2, XCircle } from "lucide-react";

interface InterviewDetailsProps {
  interview: Interview;
}

export function InterviewDetails({ interview }: InterviewDetailsProps) {
  // ✅ DÜZELTME: Süre Hesabı (Saniye -> Dakika)
  const totalDurationSeconds = interview.questions.reduce((sum, q) => sum + (q.duration || 0), 0);
  const durationMinutes = Math.floor(totalDurationSeconds / 60);
  const durationSeconds = totalDurationSeconds % 60;
  
  const formattedDuration = durationMinutes > 0 
    ? `${durationMinutes} dk ${durationSeconds > 0 ? `${durationSeconds} sn` : ""}`
    : `${durationSeconds} sn`;

  // Zorluk seviyesine göre renk belirleme
  const getComplexityColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "advanced": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. GENEL BİLGİLER KARTI */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">Genel Bilgiler</CardTitle>
                <CardDescription className="mt-1">{interview.description || "Açıklama girilmemiş."}</CardDescription>
            </div>
            <Badge variant={interview.status === "published" ? "default" : "secondary"} className="capitalize">
                {interview.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Son Başvuru:</span>
                <span className="font-medium">
                    {new Date(interview.expirationDate).toLocaleDateString("tr-TR")}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tahmini Süre:</span>
                <span className="font-medium">{formattedDuration}</span>
            </div>
            <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mülakat Tipi:</span>
                <span className="font-medium capitalize">{interview.type?.replace("-", " ") || "Video"}</span>
            </div>
             <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Kişilik Envanteri:</span>
                <Badge variant="outline">{interview.stages.personalityTest ? "Var" : "Yok"}</Badge>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. POZİSYON & YETKİNLİK KARTI */}
          <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Pozisyon ve Yetkinlikler
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {interview.position ? (
                    <>
                        <div>
                            <p className="font-semibold text-lg">{interview.position.title}</p>
                            <p className="text-sm text-muted-foreground">{interview.position.department || "Departman Belirtilmemiş"}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                            <p className="text-sm font-medium">Değerlendirme Ağırlıkları</p>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Teknik Yetkinlik</span>
                                    <span>{interview.position.competencyWeights?.technical || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${interview.position.competencyWeights?.technical || 0}%` }} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>İletişim</span>
                                    <span>{interview.position.competencyWeights?.communication || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${interview.position.competencyWeights?.communication || 0}%` }} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Problem Çözme</span>
                                    <span>{interview.position.competencyWeights?.problem_solving || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: `${interview.position.competencyWeights?.problem_solving || 0}%` }} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">Pozisyon bilgisi girilmemiş.</p>
                )}
            </CardContent>
          </Card>

          {/* 3. AI ANALİZ AYARLARI KARTI */}
          <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-purple-600" />
                    AI Analiz Yapılandırması
                </CardTitle>
            </CardHeader>
            <CardContent>
                {interview.aiAnalysisSettings ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Otomatik Puanlama</span>
                            </div>
                            {interview.aiAnalysisSettings.useAutomaticScoring ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-gray-300" />}
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium">Göz Teması & Mimik</span>
                            </div>
                            {(interview.aiAnalysisSettings.gestureAnalysis || interview.aiAnalysisSettings.eyeContactAnalysis) 
                                ? <CheckCircle2 className="h-5 w-5 text-green-500" /> 
                                : <XCircle className="h-5 w-5 text-gray-300" />
                            }
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Mic className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">Ses & Ton Analizi</span>
                            </div>
                            {(interview.aiAnalysisSettings.speechAnalysis || interview.aiAnalysisSettings.tonalAnalysis)
                                ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                                : <XCircle className="h-5 w-5 text-gray-300" />
                            }
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                             <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">Kelime Eşleşme Puanı</span>
                            </div>
                            <Badge variant="outline">
                                {interview.aiAnalysisSettings.keywordMatchScore ? "Aktif" : "Pasif"}
                            </Badge>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">AI ayarları yapılandırılmamış.</p>
                )}
            </CardContent>
          </Card>
      </div>

      {/* 4. SORULAR LİSTESİ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mülakat Soruları ({interview.questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interview.questions.map((question: InterviewQuestion, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full p-0">
                            {question.order}
                        </Badge>
                        <h4 className="font-semibold text-sm md:text-base">{question.questionText}</h4>
                    </div>
                    <Badge className={getComplexityColor(question.aiMetadata.complexityLevel)}>
                        {question.aiMetadata.complexityLevel}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Beklenen Cevap</span>
                        <p className="text-muted-foreground line-clamp-2">{question.expectedAnswer}</p>
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between border-b pb-1">
                            <span className="text-xs font-semibold text-muted-foreground">Süre</span>
                            <span>{question.duration} sn</span>
                         </div>
                         <div className="flex justify-between border-b pb-1">
                            <span className="text-xs font-semibold text-muted-foreground">Anahtar Kelimeler</span>
                            <span className="text-xs text-right truncate max-w-[200px]">{question.keywords.join(", ")}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Yetenekler</span>
                            <span className="text-xs text-right truncate max-w-[200px]">{question.aiMetadata.requiredSkills.join(", ")}</span>
                         </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}