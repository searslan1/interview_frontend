"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCandidateStore } from "@/store/candidateStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, User, CheckCircle, ListChecks, Archive, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateStatus } from "@/types/candidate";

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

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const { selectedCandidate, fetchCandidateById, isLoadingDetail } = useCandidateStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (interviewId) {
      fetchCandidateById(interviewId);
    }
  }, [interviewId, fetchCandidateById]);

  const candidate = selectedCandidate;

  if (isLoadingDetail) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!candidate) {
    return <div className="min-h-screen bg-background flex flex-col items-center justify-center"><h1 className="text-2xl font-bold mb-4">Aday bulunamadı</h1><Button onClick={() => router.push('/candidates')}><ArrowLeft className="mr-2 h-4 w-4" />Adaylara Dön</Button></div>;
  }

  const status = statusConfig[candidate.status] || statusConfig.active;

  return (
    <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8"><div className="mb-6"><Button variant="ghost" onClick={() => router.push('/candidates')} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" />Geri</Button><div className="flex items-start justify-between"><div className="flex items-start gap-4"><Avatar className="h-16 w-16"><AvatarFallback className="text-xl bg-primary/10">{getInitials(candidate.name, candidate.surname)}</AvatarFallback></Avatar><div><h1 className="text-3xl font-bold">{candidate.fullName}</h1><div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">{candidate.email && <div className="flex items-center gap-1"><Mail className="h-4 w-4" />{candidate.email}</div>}{candidate.phone && <div className="flex items-center gap-1"><Phone className="h-4 w-4" />{candidate.phone}</div>}</div></div></div><Badge className={cn(status.bgColor, status.color, "gap-1")}>{status.icon}{status.label}</Badge></div></div>{candidate.scoreSummary && <Card className="mb-6"><CardHeader><CardTitle>AI Analiz Skorları</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div><div className="text-sm text-muted-foreground mb-1">Genel Skor</div><div className={cn("text-2xl font-bold", getScoreColor(candidate.scoreSummary.avgOverallScore))}>{candidate.scoreSummary.avgOverallScore?.toFixed(0) || 0}</div></div><div><div className="text-sm text-muted-foreground mb-1">Teknik</div><div className={cn("text-2xl font-bold", getScoreColor(candidate.scoreSummary.avgTechnicalScore))}>{candidate.scoreSummary.avgTechnicalScore?.toFixed(0) || 0}</div></div><div><div className="text-sm text-muted-foreground mb-1">İletişim</div><div className={cn("text-2xl font-bold", getScoreColor(candidate.scoreSummary.avgCommunicationScore))}>{candidate.scoreSummary.avgCommunicationScore?.toFixed(0) || 0}</div></div><div><div className="text-sm text-muted-foreground mb-1">Problem Çözme</div><div className={cn("text-2xl font-bold", getScoreColor(candidate.scoreSummary.avgProblemSolvingScore))}>{candidate.scoreSummary.avgProblemSolvingScore?.toFixed(0) || 0}</div></div></div></CardContent></Card>}<Tabs value={activeTab} onValueChange={setActiveTab}><TabsList><TabsTrigger value="overview">Genel Bakış</TabsTrigger><TabsTrigger value="experience">Deneyim</TabsTrigger><TabsTrigger value="education">Eğitim</TabsTrigger><TabsTrigger value="notes">Notlar</TabsTrigger></TabsList><TabsContent value="overview" className="space-y-4 mt-4"><Card><CardHeader><CardTitle>Özet</CardTitle></CardHeader><CardContent><div className="grid gap-4"><div><div className="text-sm font-medium mb-1">Son Mülakat</div><div className="text-sm text-muted-foreground">{candidate.lastInterviewTitle || '-'} • {formatDate(candidate.lastInterviewDate)}</div></div><div><div className="text-sm font-medium mb-1">Toplam Mülakat</div><div className="text-sm text-muted-foreground">{candidate.scoreSummary?.totalInterviews || 0} mülakat</div></div></div></CardContent></Card></TabsContent><TabsContent value="experience" className="space-y-4 mt-4">{candidate.experience && candidate.experience.length > 0 ? candidate.experience.map((exp, idx) => <Card key={idx}><CardContent className="pt-6"><div className="flex items-start gap-3"><Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" /><div><h3 className="font-semibold">{exp.position}</h3><p className="text-sm text-muted-foreground">{exp.company}</p><p className="text-xs text-muted-foreground mt-1">{exp.duration}</p>{exp.responsibilities && <p className="text-sm mt-2">{exp.responsibilities}</p>}</div></div></CardContent></Card>) : <Card><CardContent className="py-8 text-center text-muted-foreground">Deneyim bilgisi bulunmamaktadır.</CardContent></Card>}</TabsContent><TabsContent value="education" className="space-y-4 mt-4">{candidate.education && candidate.education.length > 0 ? candidate.education.map((edu, idx) => <Card key={idx}><CardContent className="pt-6"><div className="flex items-start gap-3"><Calendar className="h-5 w-5 text-muted-foreground mt-0.5" /><div><h3 className="font-semibold">{edu.school}</h3><p className="text-sm text-muted-foreground">{edu.degree}</p>{edu.graduationYear && <p className="text-xs text-muted-foreground mt-1">{edu.graduationYear}</p>}</div></div></CardContent></Card>) : <Card><CardContent className="py-8 text-center text-muted-foreground">Eğitim bilgisi bulunmamaktadır.</CardContent></Card>}</TabsContent><TabsContent value="notes" className="space-y-4 mt-4">{candidate.notes && candidate.notes.length > 0 ? candidate.notes.map((note) => <Card key={note._id}><CardContent className="pt-6"><div className="space-y-2"><div className="flex items-center justify-between"><span className="font-medium">{note.authorName}</span><span className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</span></div><p className="text-sm">{note.content}</p></div></CardContent></Card>) : <Card><CardContent className="py-8 text-center text-muted-foreground">Henüz not eklenmemiş.</CardContent></Card>}</TabsContent></Tabs></div></div>
  );
}
