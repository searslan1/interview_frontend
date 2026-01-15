"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCandidateStore } from "@/store/candidateStore";
import * as candidateService from "@/services/candidateService"; 

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import {
  X, Star, Mail, Phone, Calendar, Briefcase, Video, MessageSquare,
  AlertTriangle, Plus, Loader2, Users, CheckCircle, ListChecks, Archive, User, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate, CandidateStatus, CandidateScoreSummary } from "@/types/candidate";

interface CandidateDetailPanelProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoriteToggle: () => void;
  isLoading?: boolean;
}

const statusConfig: Record<CandidateStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  active: { label: "Aktif", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30", icon: <User className="h-4 w-4" /> },
  reviewed: { label: "İncelendi", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30", icon: <CheckCircle className="h-4 w-4" /> },
  shortlisted: { label: "Kısa Liste", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30", icon: <ListChecks className="h-4 w-4" /> },
  archived: { label: "Arşiv", color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-800", icon: <Archive className="h-4 w-4" /> },
  rejected: { label: "Reddedildi", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30", icon: <XCircle className="h-4 w-4" /> },
};

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function getInitials(name: string, surname: string): string {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
}

function getScoreColor(score?: number): string {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

export function CandidateDetailPanel({
  candidate,
  isOpen,
  onClose,
  onFavoriteToggle,
  isLoading
}: CandidateDetailPanelProps) {
  const { updateStatus, addNote } = useCandidateStore();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Extra Data
  const [interviews, setInterviews] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);

  useEffect(() => {
    if (isOpen && candidate && !isLoading) {
      const fetchExtras = async () => {
        setIsLoadingExtras(true);
        try {
            const candidateId = candidate.id || candidate._id;
            const [interviewsRes, duplicatesRes] = await Promise.all([
                candidateService.getCandidateInterviews(candidateId),
                candidateService.getPotentialDuplicates(candidateId)
            ]);
            setInterviews(interviewsRes || []);
            setDuplicates(duplicatesRes || []);
        } catch (error) {
          console.error("Error fetching extras:", error);
        } finally {
          setIsLoadingExtras(false);
        }
      };
      
      fetchExtras();
    } else if (!isOpen) {
       setActiveTab("overview");
       setNewNote("");
       setInterviews([]);
       setDuplicates([]);
    }
  }, [isOpen, candidate, isLoading]);

  const handleAddNote = async () => {
    if (!candidate || !newNote.trim()) return;
    setIsAddingNote(true);
    try {
      await addNote(candidate.id || candidate._id, newNote.trim());
      setNewNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const status = candidate ? (statusConfig[candidate.status] || statusConfig.active) : statusConfig.active;
  
  // ✅ DÜZELTME BURADA: Varsayılan objeyi tip güvenli hale getirdik
  const scoreSummary: CandidateScoreSummary = candidate?.scoreSummary || { 
      totalInterviews: 0, 
      completedInterviews: 0,
      avgOverallScore: undefined,
      avgTechnicalScore: undefined,
      avgCommunicationScore: undefined 
  };
  
  const notes = candidate?.notes || [];

  return (
    <TooltipProvider>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* --- HEADER --- */}
              <div className="flex items-start justify-between p-6 border-b bg-muted/10">
                {isLoading || !candidate ? (
                    <div className="flex items-center gap-4 w-full">
                        <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2 flex-1">
                            <div className="h-6 w-1/3 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                            <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xl">
                            {getInitials(candidate.name, candidate.surname)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight">
                                {candidate.name} {candidate.surname}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                                onClick={onFavoriteToggle}
                            >
                                <Star
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    candidate.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                )}
                                />
                            </Button>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                                variant="outline"
                                className={cn(
                                "flex items-center gap-1 px-2 py-0.5",
                                status.color,
                                status.bgColor,
                                "border-transparent"
                                )}
                            >
                                {status.icon}
                                {status.label}
                            </Badge>
                            {candidate.lastInterviewTitle && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {candidate.lastInterviewTitle}
                                </span>
                            )}
                            </div>
                        </div>
                    </div>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* --- CONTENT --- */}
              {isLoading || !candidate ? (
                  <div className="p-8 flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                      <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                      <p>Aday detayları yükleniyor...</p>
                  </div>
              ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-4 border-b">
                    <TabsList className="w-full justify-start h-10 bg-transparent p-0 gap-6">
                        <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Özet</TabsTrigger>
                        <TabsTrigger value="interviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">
                            Mülakatlar <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{scoreSummary.totalInterviews || 0}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">
                            Notlar <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{notes.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="matches" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">
                            Eşleşmeler {duplicates.length > 0 && <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-[10px]">{duplicates.length}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                    </div>

                    <ScrollArea className="flex-1">
                    <div className="p-6 pb-20">
                        {/* Özet Tab */}
                        <TabsContent value="overview" className="mt-0 space-y-6 focus-visible:outline-none">
                            <Card>
                                <CardHeader className="pb-3"><CardTitle className="text-base">İletişim</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{candidate.primaryEmail}</span>
                                    {candidate.emailAliases && candidate.emailAliases.length > 0 && (
                                        <Badge variant="outline" className="text-[10px]">+{candidate.emailAliases.length} alias</Badge>
                                    )}
                                </div>
                                {candidate.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{candidate.phone}</span>
                                    </div>
                                )}
                                </CardContent>
                            </Card>

                             {/* Deneyim & Eğitim */}
                             {(candidate.experience?.length > 0 || candidate.education?.length > 0) && (
                                <Card>
                                    <CardHeader className="pb-3"><CardTitle className="text-base">Özgeçmiş Özeti</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {candidate.experience?.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                                    <Briefcase className="h-3.5 w-3.5" /> Deneyim
                                                </h4>
                                                {candidate.experience.map((exp: any, i: number) => (
                                                    <div key={i} className="text-sm border-l-2 pl-3 py-1">
                                                        <p className="font-medium">{exp.position}</p>
                                                        <p className="text-muted-foreground text-xs">{exp.company} • {exp.isCurrent ? "Devam Ediyor" : "Geçmiş"}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {candidate.education?.length > 0 && (
                                            <div className="space-y-2 pt-2">
                                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5" /> Eğitim
                                                </h4>
                                                {candidate.education.map((edu: any, i: number) => (
                                                    <div key={i} className="text-sm border-l-2 pl-3 py-1">
                                                        <p className="font-medium">{edu.school}</p>
                                                        <p className="text-muted-foreground text-xs">{edu.department} {edu.degree ? `(${edu.degree})` : ''}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Skor Özeti */}
                            <Card>
                                <CardHeader className="pb-3"><CardTitle className="text-base">Genel Performans</CardTitle></CardHeader>
                                <CardContent>
                                <div className="flex items-center justify-center gap-8 py-2">
                                    <div className="text-center">
                                        <div className={cn("text-4xl font-bold mb-1", getScoreColor(scoreSummary.avgOverallScore))}>
                                            {scoreSummary.avgOverallScore ?? "-"}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Ortalama Skor</p>
                                    </div>
                                    <Separator orientation="vertical" className="h-12" />
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-4 justify-between min-w-[140px]">
                                            <span className="text-muted-foreground">Teknik</span>
                                            <span className={cn("font-medium", getScoreColor(scoreSummary.avgTechnicalScore))}>
                                                {scoreSummary.avgTechnicalScore ?? "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3"><CardTitle className="text-base">Durum Değiştir</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {(Object.keys(statusConfig) as CandidateStatus[]).map((statusKey) => (
                                            <Button
                                                key={statusKey}
                                                variant={candidate.status === statusKey ? "default" : "outline"}
                                                size="sm"
                                                className="gap-1.5"
                                                onClick={() => updateStatus(candidate.id || candidate._id, statusKey)}
                                                disabled={candidate.status === statusKey}
                                            >
                                                {statusConfig[statusKey].icon}
                                                {statusConfig[statusKey].label}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="interviews" className="mt-0 space-y-4 focus-visible:outline-none">
                        {isLoadingExtras ? (
                            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : interviews.length > 0 ? (
                            interviews.map((interview, idx) => (
                                <Card key={idx} className="hover:border-primary/50 transition-colors cursor-pointer">
                                    <CardContent className="pt-4 pb-4 flex items-center justify-between">
                                        <div>
                                        <h4 className="font-medium text-sm">{interview.interviewTitle}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5">{interview.status}</Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {formatDate(interview.appliedAt)}
                                            </span>
                                        </div>
                                        </div>
                                        {interview.scores?.overallScore && (
                                        <div className={cn("text-lg font-bold", getScoreColor(interview.scores.overallScore))}>
                                            {interview.scores.overallScore}
                                        </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                                <Video className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p>Kayıtlı mülakat bulunamadı.</p>
                            </div>
                        )}
                        </TabsContent>

                        <TabsContent value="notes" className="mt-0 space-y-6 focus-visible:outline-none">
                            <Card>
                                <CardContent className="pt-4">
                                    <Textarea 
                                    placeholder="Aday hakkında not ekleyin..." 
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="resize-none"
                                    />
                                    <div className="flex justify-end mt-2">
                                    <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim() || isAddingNote}>
                                        {isAddingNote ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin"/> : <Plus className="h-3.5 w-3.5 mr-2"/>}
                                        Not Ekle
                                    </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                {notes.length > 0 ? (
                                    notes.map((note) => (
                                    <div key={note._id} className="group relative pl-4 border-l-2 border-muted hover:border-primary transition-colors py-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">{note.authorName}</span>
                                            <span>•</span>
                                            <span>{formatDate(note.createdAt)}</span>
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    Henüz not eklenmemiş.
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="matches" className="mt-0 space-y-4 focus-visible:outline-none">
                             {isLoadingExtras ? (
                                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                             ) : duplicates.length > 0 ? (
                                duplicates.map((dup, idx) => (
                                    <Card key={idx}><CardContent className="pt-4">{dup.name} (%{dup.matchScore})</CardContent></Card>
                                ))
                             ) : (
                                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                                    <p>Benzer kayıt bulunamadı.</p>
                                </div>
                             )}
                        </TabsContent>
                    </div>
                    </ScrollArea>
                  </Tabs>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}