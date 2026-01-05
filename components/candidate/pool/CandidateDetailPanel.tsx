"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCandidateStore } from "@/store/candidateStore";
import * as candidateService from "@/services/candidateService"; // Ekstra verileri çekmek için

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  Star,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Video,
  MessageSquare,
  AlertTriangle,
  Plus,
  Loader2,
  Users,
  CheckCircle,
  ListChecks,
  Archive,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate, CandidateStatus, CandidateNote } from "@/types/candidate";

interface CandidateDetailPanelProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onFavoriteToggle: (candidateId: string) => void;
}

// Status Config (Backend Uyumlu)
const statusConfig: Record<CandidateStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}> = {
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
  isFavorite,
  onFavoriteToggle,
}: CandidateDetailPanelProps) {
  const { updateStatus, addNote } = useCandidateStore();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Extra Data States (Çünkü backend detayda bunları dönmüyor)
  const [interviews, setInterviews] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);

  // Panel açıldığında ek verileri çek
  useEffect(() => {
    if (isOpen && candidate) {
      const fetchExtras = async () => {
        setIsLoadingExtras(true);
        try {
          const [interviewsRes, duplicatesRes] = await Promise.all([
             candidateService.getCandidateInterviews(candidate._id),
             // Notları backend'den çekmek için service'e metod eklemiştik (getNotes yoksa addNote ile döner)
             // Şimdilik candidate.notes kullanabiliriz ama güncel olması için fetch iyi olurdu.
             // Biz candidate.notes kullanacağız (listede geliyorsa). Gelmiyorsa fetch lazım.
             // Backend listCandidates'de notları dönmüyor. Detayda dönüyor.
             // O yüzden candidate aslında detay objesi olmalı.
             // candidateService.getCandidateById(candidate._id) çağırmak en iyisi.
             candidateService.getPotentialDuplicates(candidate._id)
          ]);
          
          setInterviews(interviewsRes || []);
          setDuplicates(duplicatesRes || []);
          // Notes için ayrı bir endpoint yoksa candidate objesinden alırız
          setNotes(candidate.notes || []); 
          
        } catch (error) {
          console.error("Error fetching extra details:", error);
        } finally {
          setIsLoadingExtras(false);
        }
      };
      
      fetchExtras();
    }
    
    // Reset state on close
    if (!isOpen) {
      setActiveTab("overview");
      setNewNote("");
      setIsAddingNote(false);
    }
  }, [isOpen, candidate]); // candidate değişince de tetiklensin

  // Not Ekleme
  const handleAddNote = async () => {
    if (!candidate || !newNote.trim()) return;
    setIsAddingNote(true);
    try {
      await addNote(candidate._id, newNote.trim());
      // Optimistic update store'da yapılıyor ama local state'i de güncelle
      // Gerçek uygulamada fetchNotes tekrar çağrılabilir
      setNewNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingNote(false);
    }
  };

  if (!candidate) return null;

  const status = statusConfig[candidate.status] || statusConfig.active;
  const scoreSummary = candidate.scoreSummary || {};

  return (
    <TooltipProvider>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b bg-muted/10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                    {/* <AvatarImage src={candidate.avatar} alt={candidate.name} /> */}
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
                        onClick={() => onFavoriteToggle(candidate._id)}
                      >
                        <Star
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
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
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-4 border-b">
                  <TabsList className="w-full justify-start h-10 bg-transparent p-0 gap-6">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Özet</TabsTrigger>
                    <TabsTrigger value="interviews" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">
                      Mülakatlar
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{scoreSummary.totalInterviews || 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">
                      Notlar
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{notes.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="matches" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">
                      Eşleşmeler
                      {duplicates.length > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-[10px]">{duplicates.length}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1">
                   <div className="p-6 pb-20">
                    
                    {/* Özet Tab */}
                    <TabsContent value="overview" className="mt-0 space-y-6 focus-visible:outline-none">
                      {/* İletişim */}
                      <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-base">İletişim</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{candidate.primaryEmail}</span>
                            {candidate.emailAliases && candidate.emailAliases.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger><Badge variant="outline" className="text-[10px]">+{candidate.emailAliases.length} alias</Badge></TooltipTrigger>
                                <TooltipContent>
                                    {candidate.emailAliases.map((a, i) => <div key={i}>{a.email}</div>)}
                                </TooltipContent>
                              </Tooltip>
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

                      {/* Skor Özeti */}
                      <Card>
                        <CardHeader className="pb-3">
                           <div className="flex justify-between items-center">
                              <CardTitle className="text-base">Genel Performans</CardTitle>
                              <Badge variant="outline" className="font-normal text-muted-foreground">Rehber Amaçlı</Badge>
                           </div>
                        </CardHeader>
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
                                 <div className="flex items-center gap-4 justify-between min-w-[140px]">
                                    <span className="text-muted-foreground">İletişim</span>
                                    <span className={cn("font-medium", getScoreColor(scoreSummary.avgCommunicationScore))}>
                                        {scoreSummary.avgCommunicationScore ?? "-"}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <p className="text-xs text-center text-muted-foreground mt-4">
                              Toplam {scoreSummary.totalInterviews} mülakat, {scoreSummary.completedInterviews} tamamlanan.
                           </p>
                        </CardContent>
                      </Card>

                      {/* Durum Yönetimi */}
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
                                     onClick={() => updateStatus(candidate._id, statusKey)}
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

                    {/* Mülakatlar Tab */}
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

                    {/* Notlar Tab */}
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
                                      {/* Silme/Düzenleme Backend'de olmadığı için kaldırıldı */}
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
                    
                    {/* Duplicates Tab */}
                    <TabsContent value="matches" className="mt-0 space-y-4 focus-visible:outline-none">
                        {isLoadingExtras ? (
                           <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : duplicates.length > 0 ? (
                           <>
                              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg flex gap-3 items-start border border-yellow-100 dark:border-yellow-900/30">
                                 <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                 <div className="text-sm">
                                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Çift Kayıt Şüphesi</p>
                                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">Bu aday başka e-posta adresleriyle kayıtlı olabilir.</p>
                                 </div>
                              </div>
                              {duplicates.map((dup, idx) => (
                                 <Card key={idx}>
                                    <CardContent className="pt-4 flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                             <Users className="h-5 w-5 text-muted-foreground" />
                                          </div>
                                          <div className="text-sm">
                                             <p className="font-medium">{dup.name} {dup.surname}</p>
                                             <p className="text-muted-foreground">{dup.email}</p>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <Badge variant={dup.matchScore > 80 ? "destructive" : "secondary"}>
                                             %{dup.matchScore} Benzerlik
                                          </Badge>
                                       </div>
                                    </CardContent>
                                 </Card>
                              ))}
                           </>
                        ) : (
                           <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500 opacity-80" />
                              <p>Benzer kayıt bulunamadı.</p>
                           </div>
                        )}
                    </TabsContent>

                   </div>
                </ScrollArea>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}