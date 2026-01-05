"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Star, 
  Clock, 
  User, 
  TrendingUp, 
  MoreVertical,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/application";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApplicationCardProps {
  application: Application;
  onSelect: (application: Application) => void;
  onFavoriteToggle?: (application: Application) => void;
  isFavorite?: boolean;
  showInterviewTitle?: boolean;
}

// Status renkleri ve ikonları
const statusConfig: Record<ApplicationStatus, { 
  color: string; 
  bgColor: string; 
  icon: React.ReactNode; 
  label: string;
}> = {
  pending: { 
    color: "text-yellow-500", 
    bgColor: "bg-yellow-500/10", 
    icon: <Clock className="h-3 w-3" />, 
    label: "Beklemede" 
  },
  in_progress: { 
    color: "text-blue-500", 
    bgColor: "bg-blue-500/10", 
    icon: <Loader2 className="h-3 w-3 animate-spin" />, 
    label: "Devam Ediyor" 
  },
  completed: { 
    color: "text-green-500", 
    bgColor: "bg-green-500/10", 
    icon: <CheckCircle2 className="h-3 w-3" />, 
    label: "Tamamlandı" 
  },
  rejected: { 
    color: "text-red-500", 
    bgColor: "bg-red-500/10", 
    icon: <AlertCircle className="h-3 w-3" />, 
    label: "Reddedildi" 
  },
  accepted: { 
    color: "text-emerald-500", 
    bgColor: "bg-emerald-500/10", 
    icon: <CheckCircle2 className="h-3 w-3" />, 
    label: "Kabul Edildi" 
  },
  awaiting_video_responses: { 
    color: "text-purple-500", 
    bgColor: "bg-purple-500/10", 
    icon: <Video className="h-3 w-3" />, 
    label: "Video Bekleniyor" 
  },
  awaiting_ai_analysis: { 
    color: "text-orange-500", 
    bgColor: "bg-orange-500/10", 
    icon: <Loader2 className="h-3 w-3 animate-spin" />, 
    label: "AI Analizi Bekleniyor" 
  },
};

// AI skor rengini belirle
function getScoreColor(score: number | undefined): string {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

// AI skor etiketini belirle
function getScoreLabel(score: number | undefined): string {
  if (!score) return "Analiz Bekleniyor";
  if (score >= 80) return "Mükemmel";
  if (score >= 60) return "İyi";
  if (score >= 40) return "Orta";
  return "Düşük";
}

export function ApplicationCard({
  application,
  onSelect,
  onFavoriteToggle,
  isFavorite = false,
  showInterviewTitle = false,
}: ApplicationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const aiScore = application.generalAIAnalysis?.overallScore;
  const status = statusConfig[application.status];
  const hasVideo = application.responses?.some(r => r.videoUrl);

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <TooltipProvider>
      <motion.div
        className="relative w-[280px] cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.2 }}
        onClick={() => onSelect(application)}
      >
        {/* Card Container */}
        <div className={cn(
          "relative rounded-lg overflow-hidden bg-card border border-border",
          "transition-shadow duration-300",
          isHovered && "shadow-xl shadow-black/20 border-primary/50"
        )}>
          {/* Thumbnail / Visual Area */}
          <div className="relative h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
            {/* Avatar ve İsim */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-center px-4 line-clamp-1">
                {application.candidate.name} {application.candidate.surname}
              </h3>
            </div>

            {/* AI Skor Badge (Sağ Üst) */}
            {aiScore !== undefined && (
              <div className="absolute top-3 right-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full",
                      "bg-background/80 backdrop-blur-sm border border-border"
                    )}>
                      <TrendingUp className={cn("h-3.5 w-3.5", getScoreColor(aiScore))} />
                      <span className={cn("text-sm font-bold", getScoreColor(aiScore))}>
                        {aiScore}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Skoru: {getScoreLabel(aiScore)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Favori Butonu (Sol Üst) */}
            {onFavoriteToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(application);
                }}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm 
                           border border-border hover:bg-background transition-colors"
              >
                <Star className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )} />
              </button>
            )}

            {/* Video Badge */}
            {hasVideo && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              </div>
            )}

            {/* Hover Overlay with Play Button */}
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  size="lg" 
                  className="rounded-full h-14 w-14 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(application);
                  }}
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {/* Status ve Tarih */}
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-1",
                  status.color,
                  status.bgColor,
                  "border-transparent"
                )}
              >
                {status.icon}
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(application.createdAt)}
              </span>
            </div>

            {/* E-posta */}
            <p className="text-sm text-muted-foreground truncate">
              {application.candidate.email}
            </p>

            {/* Mülakat Başlığı (Opsiyonel) */}
            {showInterviewTitle && application.interviewId && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                Mülakat: {application.interviewId}
              </p>
            )}

            {/* Alt Bilgiler */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              {/* Yanıt Sayısı */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{application.responses?.length || 0} yanıt</span>
              </div>

              {/* Aksiyonlar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onSelect(application);
                  }}>
                    <Play className="h-4 w-4 mr-2" />
                    Detayları Gör
                  </DropdownMenuItem>
                  {onFavoriteToggle && (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteToggle(application);
                    }}>
                      <Star className={cn("h-4 w-4 mr-2", isFavorite && "fill-yellow-400")} />
                      {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
