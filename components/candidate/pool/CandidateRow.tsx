"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  MoreVertical,
  User,
  Briefcase,
  Calendar,
  TrendingUp,
  Video,
  Archive,
  CheckCircle,
  ListChecks,
  ChevronRight,
  XCircle, // Rejected ikonu için
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate, CandidateStatus } from "@/types/candidate";

interface CandidateRowProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  onFavoriteToggle: (candidateId: string) => void;
  isFavorite: boolean;
  onStatusChange?: (candidateId: string, status: CandidateStatus) => void;
}

// ✅ Status konfigürasyonu (Backend ile uyumlu)
const statusConfig: Record<CandidateStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}> = {
  active: {
    label: "Aktif",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: <User className="h-3 w-3" />,
  },
  reviewed: {
    label: "İncelendi",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  shortlisted: {
    label: "Kısa Liste",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: <ListChecks className="h-3 w-3" />,
  },
  archived: {
    label: "Arşiv",
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    icon: <Archive className="h-3 w-3" />,
  },
  rejected: { // ✅ Eklendi
    label: "Reddedildi",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: <XCircle className="h-3 w-3" />,
  },
};

// Skor rengi hesapla
function getScoreColor(score?: number): string {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

// Avatar için baş harfler
function getInitials(name: string, surname: string): string {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
}

// Tarih formatla
function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Kısa tarih formatı
function formatShortDate(dateString?: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function CandidateRow({
  candidate,
  onSelect,
  onFavoriteToggle,
  isFavorite,
  onStatusChange,
}: CandidateRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback status handler
  const status = statusConfig[candidate.status] || statusConfig.active;

  // ✅ Veri erişimi düzeltildi
  const overallScore = candidate.scoreSummary?.avgOverallScore;
  const interviewCount = candidate.scoreSummary?.totalInterviews || 0;
  const lastPosition = candidate.lastInterviewTitle;

  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "group relative flex items-center gap-4 p-4 rounded-lg border border-border",
          "bg-card hover:bg-muted/50 cursor-pointer transition-all duration-200",
          isHovered && "shadow-md border-primary/30"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(candidate)}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.15 }}
      >
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-12 w-12">
            {/* Backend avatar dönmüyor olabilir, ileride eklenebilir */}
            {/* <AvatarImage src={candidate.avatar} alt={candidate.name} /> */}
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(candidate.name, candidate.surname)}
            </AvatarFallback>
          </Avatar>
          
          {isFavorite && (
            <div className="absolute -top-1 -right-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>

        {/* Ana Bilgiler */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">
              {candidate.name} {candidate.surname}
            </h3>
            {/* Durum Badge */}
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 text-xs",
                status.color,
                status.bgColor,
                "border-transparent"
              )}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>
          
          {/* Alt bilgiler */}
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            {/* Son Pozisyon / Mülakat */}
            {lastPosition && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                    {lastPosition}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Son mülakat: {lastPosition}</TooltipContent>
              </Tooltip>
            )}
            
            {/* Email */}
            <span className="hidden md:flex items-center gap-1 truncate">
              {candidate.primaryEmail}
            </span>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Mülakat Sayısı */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-sm">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{interviewCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Toplam mülakat sayısı</TooltipContent>
          </Tooltip>

          {/* Son Mülakat Tarihi */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-[80px]">
                <Calendar className="h-4 w-4" />
                <span>{formatShortDate(candidate.lastInterviewDate)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Son mülakat tarihi: {formatDate(candidate.lastInterviewDate)}
            </TooltipContent>
          </Tooltip>

          {/* Ortalama AI Skoru */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 min-w-[60px]">
                <TrendingUp className={cn("h-4 w-4", getScoreColor(overallScore))} />
                <span className={cn("font-bold text-lg", getScoreColor(overallScore))}>
                  {overallScore ?? "-"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ortalama AI Skoru</p>
              <p className="text-xs text-muted-foreground">
                Tüm mülakatların ağırlıklı ortalaması
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Aksiyonlar */}
        <div className="flex items-center gap-2">
          {/* Favori Butonu */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
              isFavorite && "opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(candidate._id);
            }}
          >
            <Star
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )}
            />
          </Button>

          {/* Daha Fazla Menü */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onSelect(candidate);
              }}>
                <User className="h-4 w-4 mr-2" />
                Profili Görüntüle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(candidate._id);
              }}>
                <Star className={cn("h-4 w-4 mr-2", isFavorite && "fill-yellow-400")} />
                {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Durum Değiştirme (Eğer handler varsa) */}
              {onStatusChange && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onStatusChange(candidate._id, "reviewed"); }}
                    disabled={candidate.status === "reviewed"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    İncelendi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onStatusChange(candidate._id, "shortlisted"); }}
                    disabled={candidate.status === "shortlisted"}
                  >
                    <ListChecks className="h-4 w-4 mr-2" />
                    Kısa Liste
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onStatusChange(candidate._id, "archived"); }}
                    disabled={candidate.status === "archived"}
                  >
                     <Archive className="h-4 w-4 mr-2" />
                     Arşivle
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onStatusChange(candidate._id, "rejected"); }}
                    disabled={candidate.status === "rejected"}
                    className="text-destructive focus:text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reddet
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </TooltipProvider>
  );
}