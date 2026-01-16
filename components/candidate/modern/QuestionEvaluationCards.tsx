"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Quote,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { ApplicationResponse, Application } from "@/types/application";
import { cn } from "@/lib/utils";

interface QuestionEvaluationCardsProps {
  application: Application;
  activeQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

// Sentiment badge helper
const getSentimentBadge = (score: number | undefined) => {
  if (!score) return null;
  
  if (score >= 80) return {
    label: "Olumlu Sentiment",
    className: "bg-green-500/20 text-green-300 border-green-500/20"
  };
  if (score >= 60) return {
    label: "Nötr Sentiment",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/20"
  };
  if (score >= 40) return {
    label: "Karışık Sentiment",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20"
  };
  return {
    label: "Dikkat Gerektiren",
    className: "bg-red-500/20 text-red-300 border-red-500/20"
  };
};

// Tek bir soru kartı
interface QuestionCardProps {
  response: ApplicationResponse;
  questionIndex: number;
  isActive: boolean;
  questionText?: string;
  aiResult?: any; // Backend'den populate edilen AI sonucu
  onClick: () => void;
}

function QuestionCard({ 
  response, 
  questionIndex, 
  isActive, 
  questionText,
  aiResult,
  onClick 
}: QuestionCardProps) {
  const isCompleted = response.aiStatus === 'completed';
  const isAnalyzing = response.aiStatus === 'processing';
  const isPending = response.aiStatus === 'idle' || !response.videoUrl;
  
  // Skor ve sentiment
  const score = aiResult?.overallScore || response.aiScore;
  const sentiment = getSentimentBadge(score);
  
  // Transkript önizleme
  const transcriptPreview = response.textAnswer 
    ? response.textAnswer.slice(0, 200) + (response.textAnswer.length > 200 ? '...' : '')
    : null;
  
  // AI Insight mesajı
  const aiInsight = useMemo(() => {
    if (aiResult?.commentary?.overallAssessment) {
      return aiResult.commentary.overallAssessment.slice(0, 150) + '...';
    }
    if (score && score >= 70) {
      return "Aday bu soruda güçlü bir performans sergilemiş. Yanıtlar tutarlı ve pozisyona uygun.";
    }
    if (score && score >= 50) {
      return "Yanıtlar genel olarak tatmin edici. Bazı alanlarda geliştirme potansiyeli mevcut.";
    }
    return null;
  }, [aiResult, score]);

  // Duration display
  const durationDisplay = response.duration 
    ? `${Math.floor(response.duration / 60)}:${(response.duration % 60).toString().padStart(2, '0')}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: questionIndex * 0.1 }}
      onClick={onClick}
      className={cn(
        "glass-panel p-6 rounded-xl cursor-pointer transition-all group",
        isActive && "question-card-active",
        isCompleted && !isActive && "question-card-positive",
        isAnalyzing && "question-card-analyzing",
        isPending && "question-card-pending"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider flex items-center gap-2",
            isActive ? "text-purple-400" : "text-muted-foreground"
          )}>
            {isActive && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
            Soru {questionIndex + 1}
            {durationDisplay && <span className="opacity-60">• {durationDisplay}</span>}
            {isActive && " • Aktif"}
          </span>
          
          <h4 className={cn(
            "text-base font-semibold mt-1 group-hover:text-primary transition-colors line-clamp-2",
            isActive ? "text-foreground" : isPending ? "text-muted-foreground" : "text-foreground"
          )}>
            {questionText || `Mülakat Sorusu ${questionIndex + 1}`}
          </h4>
        </div>

        {/* Status Badge */}
        {isCompleted && sentiment && (
          <span className={cn(
            "px-3 py-1 text-xs font-bold rounded-full border shrink-0 ml-4",
            sentiment.className
          )}>
            {sentiment.label}
          </span>
        )}
        
        {isAnalyzing && (
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/20 flex items-center gap-2 shrink-0 ml-4">
            <Loader2 className="h-3 w-3 animate-spin" />
            Analiz Ediliyor...
          </span>
        )}
        
        {isPending && (
          <span className="px-3 py-1 bg-muted/20 text-muted-foreground text-xs font-bold rounded-full border border-border/30 flex items-center gap-2 shrink-0 ml-4">
            <Clock className="h-3 w-3" />
            Beklemede
          </span>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcript Preview */}
        <div className="lg:col-span-2 relative">
          {transcriptPreview ? (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border/50 rounded" />
              <p className={cn(
                "text-sm leading-relaxed pl-4",
                isActive ? "text-foreground" : "text-muted-foreground italic"
              )}>
                <Quote className="h-4 w-4 inline-block mr-2 opacity-50" />
                {transcriptPreview}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic pl-4">
              Henüz yanıt kaydedilmedi...
            </p>
          )}
        </div>

        {/* AI Insight Box */}
        <div className={cn(
          "rounded-xl p-4 border relative overflow-hidden",
          isCompleted 
            ? "bg-primary/5 border-primary/20" 
            : "bg-muted/10 border-border/30"
        )}>
          {isCompleted && (
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Brain className="h-8 w-8" />
            </div>
          )}
          
          <p className={cn(
            "text-xs font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider",
            isCompleted ? "text-primary" : "text-muted-foreground"
          )}>
            {isCompleted ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                AI Insight
              </>
            ) : isAnalyzing ? (
              <>
                <Sparkles className="h-3 w-3 animate-pulse" />
                Canlı Geri Bildirim
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                Bekleniyor
              </>
            )}
          </p>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            {aiInsight || (isAnalyzing 
              ? "Yanıt analiz ediliyor. Yapay zeka değerlendirmesi kısa sürede hazır olacak."
              : "Video yanıtı bekleniyor. Analiz video yüklendikten sonra başlayacak."
            )}
          </p>
          
          {isCompleted && score && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Skor</span>
              <span className={cn(
                "text-sm font-bold",
                score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
              )}>
                {score}/100
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expand Indicator */}
      <div className={cn(
        "flex items-center justify-end mt-4 text-xs transition-opacity",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <span className="text-muted-foreground mr-1">Detayları gör</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
}

export function QuestionEvaluationCards({ 
  application,
  activeQuestionIndex,
  onQuestionSelect
}: QuestionEvaluationCardsProps) {
  const responses = application.responses || [];
  const aiResults = application.aiAnalysisResults || [];
  
  // Soru metinlerini al (interview'dan)
  const interviewData = typeof application.interviewId === 'object' ? application.interviewId : null;
  
  // AI sonuçlarını questionId'ye göre eşle
  const aiResultsMap = useMemo(() => {
    const map = new Map();
    aiResults.forEach((result: any) => {
      if (result && result.questionId) {
        map.set(result.questionId, result);
      }
    });
    return map;
  }, [aiResults]);

  if (responses.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Henüz Soru Yanıtı Yok</h3>
        <p className="text-sm text-muted-foreground">
          Aday mülakat sorularına yanıt verdiğinde burada değerlendirme kartları görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-bold text-foreground">
          Soru Bazlı AI Değerlendirmesi
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {responses.filter(r => r.aiStatus === 'completed').length} / {responses.length} analiz tamamlandı
        </span>
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {responses.map((response, index) => (
          <QuestionCard
            key={response.questionId}
            response={response}
            questionIndex={index}
            isActive={index === activeQuestionIndex}
            aiResult={aiResultsMap.get(response.questionId)}
            onClick={() => onQuestionSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}
