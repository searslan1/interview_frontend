"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Sparkles, Tag } from "lucide-react";
import { ApplicationResponse, GeneralAIAnalysis } from "@/types/application";
import { cn } from "@/lib/utils";

interface AIInsightsPanelProps {
  activeResponse?: ApplicationResponse;
  activeQuestionIndex: number;
  generalAnalysis?: GeneralAIAnalysis;
  totalQuestions: number;
}

// Duygu analizi için mock veri (Backend'den gelmeli)
const EMOTION_LABELS = {
  confident: { label: "Güvenli", color: "bg-green-500", textColor: "text-green-400" },
  analytical: { label: "Analitik", color: "bg-blue-500", textColor: "text-blue-400" },
  enthusiastic: { label: "Heyecanlı", color: "bg-yellow-500", textColor: "text-yellow-400" },
  calm: { label: "Sakin", color: "bg-cyan-500", textColor: "text-cyan-400" },
  nervous: { label: "Tedirgin", color: "bg-orange-500", textColor: "text-orange-400" },
};

export function AIInsightsPanel({ 
  activeResponse,
  activeQuestionIndex,
  generalAnalysis,
  totalQuestions
}: AIInsightsPanelProps) {
  
  // AI durumunu kontrol et
  const isAnalyzing = activeResponse?.aiStatus === 'processing';
  const hasAnalysis = activeResponse?.aiStatus === 'completed';
  
  // AI detaylarını al
  const aiDetails = activeResponse?.aiDetails;
  
  // Skor hesapla
  const competencyScore = useMemo(() => {
    if (aiDetails?.overallScore) return aiDetails.overallScore;
    if (activeResponse?.aiScore) return activeResponse.aiScore;
    if (generalAnalysis?.overallScore) return generalAnalysis.overallScore / 10; // 100 üzerinden 10'a çevir
    return 0;
  }, [aiDetails, activeResponse, generalAnalysis]);

  // Breakdown skorları
  const breakdown = aiDetails?.breakdown || {
    face: 0,
    voice: 0,
    llm: 0
  };

  // Anahtar kelimeler
  const keywords = useMemo(() => {
    const words: string[] = [];
    
    // Transcription'dan zenginleştirilmiş kelimeleri al
    if (aiDetails?.transcription?.enrichedWords) {
      aiDetails.transcription.enrichedWords
        .filter(w => w.highlightForReview)
        .slice(0, 6)
        .forEach(w => words.push(w.word));
    }
    
    // Fallback: Genel analizden güçlü yönler
    if (words.length === 0 && generalAnalysis?.strengths) {
      generalAnalysis.strengths.slice(0, 4).forEach(s => words.push(s));
    }
    
    return words;
  }, [aiDetails, generalAnalysis]);

  // Duygu tonları (Mock - Backend'den gelecek)
  const emotionalTones = useMemo(() => {
    // AI detaylarından gelen verilere göre hesaplanmalı
    const tones = [
      { key: 'confident', value: breakdown.voice || 75 },
      { key: 'analytical', value: breakdown.llm || 82 },
    ];
    return tones;
  }, [breakdown]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 flex flex-col h-full border-t border-purple-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Brain className={cn(
            "h-5 w-5 text-purple-500",
            isAnalyzing && "animate-pulse"
          )} />
          AI Insights
        </h3>
        <span className={cn(
          "h-2 w-2 rounded-full",
          hasAnalysis ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : 
          isAnalyzing ? "bg-purple-500 animate-pulse" : "bg-muted"
        )} />
      </div>

      <div className="space-y-6 flex-1">
        {/* Current Segment */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">
            Aktif Segment
          </p>
          <p className="text-foreground font-semibold leading-tight">
            Q{activeQuestionIndex + 1}: Soru {activeQuestionIndex + 1} / {totalQuestions}
          </p>
        </div>

        {/* Emotional Tone Analysis */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Duygu Tonu
          </p>
          <div className="space-y-4">
            {emotionalTones.map((tone) => {
              const emotionData = EMOTION_LABELS[tone.key as keyof typeof EMOTION_LABELS] || 
                { label: tone.key, color: "bg-gray-500", textColor: "text-gray-400" };
              
              return (
                <div key={tone.key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground font-medium">{emotionData.label}</span>
                    <span className={cn("font-mono", emotionData.textColor)}>{tone.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${tone.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn("h-full rounded-full", emotionData.color)}
                      style={{ boxShadow: `0 0 10px currentColor` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score Breakdown */}
        {hasAnalysis && aiDetails && (
          <div>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
              Puan Dağılımı
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="glass-card rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Yüz</p>
                <p className="text-lg font-bold text-blue-400">{breakdown.face}</p>
              </div>
              <div className="glass-card rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Ses</p>
                <p className="text-lg font-bold text-purple-400">{breakdown.voice}</p>
              </div>
              <div className="glass-card rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">İçerik</p>
                <p className="text-lg font-bold text-green-400">{breakdown.llm}</p>
              </div>
            </div>
          </div>
        )}

        {/* Keywords Detected */}
        {keywords.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider flex items-center gap-2">
              <Tag className="h-3 w-3" />
              Tespit Edilen Anahtar Kelimeler
            </p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-medium border",
                    index === 0 
                      ? "bg-purple-500/20 border-purple-500/30 text-purple-200 shadow-sm shadow-purple-500/10" 
                      : "bg-muted/10 border-border/50 text-muted-foreground"
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Status Messages */}
        {isAnalyzing && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl animate-pulse">
            <p className="text-xs text-purple-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              Yapay zeka analiz ediyor...
            </p>
          </div>
        )}

        {!hasAnalysis && !isAnalyzing && (
          <div className="p-4 bg-muted/10 border border-border/30 rounded-xl">
            <p className="text-xs text-muted-foreground text-center">
              Bu segment için henüz AI analizi yok
            </p>
          </div>
        )}
      </div>

      {/* Competency Score Footer */}
      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="flex items-end justify-between glass-card p-4 rounded-xl">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
              Yetkinlik Skoru
            </p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {competencyScore > 0 ? competencyScore.toFixed(1) : "—"}
              <span className="text-sm text-muted-foreground font-normal ml-1">/10</span>
            </p>
          </div>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center border",
            competencyScore >= 7 
              ? "bg-green-500/20 border-green-500/30 text-green-400" 
              : competencyScore >= 5 
              ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
              : "bg-muted/20 border-border/30 text-muted-foreground"
          )}>
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
