"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Building2, 
  Sparkles,
  GraduationCap,
  Briefcase,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Application } from "@/types/application";
import { cn } from "@/lib/utils";

interface CandidateSidebarProps {
  application: Application;
  onToggleFavorite?: () => void;
}

export function CandidateSidebar({ application, onToggleFavorite }: CandidateSidebarProps) {
  const { candidate, generalAIAnalysis } = application;
  
  // Genel AI skorunu hesapla
  const overallScore = useMemo(() => {
    return generalAIAnalysis?.overallScore || 0;
  }, [generalAIAnalysis]);

  // Skor rengini belirle
  const scoreColor = useMemo(() => {
    if (overallScore >= 80) return "from-green-400 to-emerald-500";
    if (overallScore >= 60) return "from-blue-400 to-cyan-500";
    if (overallScore >= 40) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  }, [overallScore]);

  // Deneyimleri al
  const experiences = application.experience || [];

  // Yetenekleri çıkar (AI analizinden veya pozisyondan)
  const skills = useMemo(() => {
    const interviewData = typeof application.interviewId === 'object' ? application.interviewId : null;
    // Pozisyondan veya AI'dan gelen yetenekler
    const aiSkills = generalAIAnalysis?.strengths || [];
    return aiSkills.slice(0, 6);
  }, [application.interviewId, generalAIAnalysis]);

  // İlk harfleri al (avatar için)
  const initials = useMemo(() => {
    const first = candidate?.name?.[0] || "";
    const last = candidate?.surname?.[0] || "";
    return (first + last).toUpperCase();
  }, [candidate]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-2xl p-6 flex flex-col gap-6 h-fit sticky top-24"
    >
      {/* Profil Başlığı */}
      <div className="text-center relative">
        <div className="relative inline-block">
          {/* Avatar Ring */}
          <div className={cn(
            "w-24 h-24 rounded-full p-1 mx-auto shadow-xl",
            `bg-gradient-to-tr ${scoreColor}`
          )}>
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-4 border-background">
              <span className="text-2xl font-bold text-gradient">{initials}</span>
            </div>
          </div>
          
          {/* Match Score Badge */}
          {overallScore > 0 && (
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-background shadow-lg">
              {Math.round(overallScore)}% MATCH
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-foreground mt-4">
          {candidate?.name} {candidate?.surname}
        </h2>
        
        <p className="text-sm text-primary font-medium">
          {typeof application.interviewId === 'object' 
            ? application.interviewId.title 
            : 'Aday'}
        </p>

        {/* İletişim Butonları */}
        <div className="flex justify-center gap-3 mt-5">
          {candidate?.email && (
            <Button
              variant="outline"
              size="icon"
              className="glass-card rounded-xl h-10 w-10"
              asChild
            >
              <a href={`mailto:${candidate.email}`} title={candidate.email}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
          
          {candidate?.phone && (
            <Button
              variant="outline"
              size="icon"
              className="glass-card rounded-xl h-10 w-10"
              asChild
            >
              <a href={`tel:${candidate.phone}`} title={candidate.phone}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}

          {/* Favori Butonu */}
          {onToggleFavorite && (
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFavorite}
              className={cn(
                "glass-card rounded-xl h-10 w-10 transition-all",
                application.isFavorite 
                  ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" 
                  : ""
              )}
            >
              <Star className={cn(
                "h-4 w-4",
                application.isFavorite && "fill-yellow-500"
              )} />
            </Button>
          )}
        </div>
      </div>

      {/* Deneyim Bölümü */}
      {experiences.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Briefcase className="h-3 w-3" />
            Deneyim
          </h3>
          <div className="space-y-4">
            {experiences.slice(0, 2).map((exp, index) => (
              <div key={index} className="flex gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  index === 0 
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/20" 
                    : "bg-purple-500/20 text-purple-400 border-purple-500/20"
                )}>
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">
                    {exp.company || 'Şirket'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exp.position || 'Pozisyon'} • {exp.duration || 'Süre belirtilmemiş'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eğitim Bölümü */}
      {candidate?.education && candidate.education.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <GraduationCap className="h-3 w-3" />
            Eğitim
          </h3>
          <div className="space-y-3">
            {candidate.education.slice(0, 2).map((edu, index) => (
              <div key={index} className="text-sm">
                <p className="text-foreground font-medium">{edu.school}</p>
                <p className="text-xs text-muted-foreground">
                  {edu.degree}
                  {edu.graduationYear && ` • ${edu.graduationYear}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yetenekler */}
      {skills.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Güçlü Yönler
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className={cn(
                  "skill-badge",
                  index % 3 === 0 && "skill-badge-blue",
                  index % 3 === 1 && "skill-badge-purple",
                  index % 3 === 2 && "skill-badge-green"
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Özet */}
      {generalAIAnalysis?.recommendation && (
        <div className="glass-card rounded-xl p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <h3 className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            AI Özeti
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
            {generalAIAnalysis.recommendation}
          </p>
        </div>
      )}

      {/* Aday Bilgileri (Fallback - deneyim yoksa) */}
      {experiences.length === 0 && !candidate?.education && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            İletişim Bilgileri
          </h3>
          <dl className="space-y-2 text-sm">
            {candidate?.email && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">E-posta</dt>
                <dd className="font-medium truncate ml-2">{candidate.email}</dd>
              </div>
            )}
            {candidate?.phone && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Telefon</dt>
                <dd className="font-medium">{candidate.phone}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </motion.div>
  );
}
