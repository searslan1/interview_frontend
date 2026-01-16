"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { interviewService } from "@/services/interviewService";
import type { Application } from "@/types/application";

// Status badge mapping
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  completed: { label: "Tamamlandı", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  awaiting_ai_analysis: { label: "AI Analizi Bekleniyor", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  awaiting_video_responses: { label: "Video Bekleniyor", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  in_progress: { label: "Devam Ediyor", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  pending: { label: "Beklemede", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  otp_verified: { label: "OTP Doğrulandı", variant: "outline", icon: <CheckCircle className="h-3 w-3" /> },
  accepted: { label: "Kabul Edildi", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { label: "Reddedildi", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
};

export default function InterviewApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = Array.isArray(params.id) ? params.id[0] : params.id;

  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewTitle, setInterviewTitle] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch applications
  const fetchApplications = async () => {
    if (!interviewId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewService.getInterviewApplications(interviewId, {
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy,
        sortOrder,
      });
      
      setApplications(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
      setInterviewTitle(response.meta.interviewTitle);
    } catch (err: any) {
      console.error("Failed to fetch applications:", err);
      setError(err.response?.data?.message || "Başvurular yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [interviewId, page, statusFilter, sortBy, sortOrder]);

  // Client-side search filtering
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications;
    
    const query = searchQuery.toLowerCase();
    return applications.filter(app => 
      app.candidate?.name?.toLowerCase().includes(query) ||
      app.candidate?.surname?.toLowerCase().includes(query) ||
      app.candidate?.email?.toLowerCase().includes(query)
    );
  }, [applications, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const completed = applications.filter(a => a.status === "completed" || a.status === "accepted").length;
    const pending = applications.filter(a => ["pending", "in_progress", "awaiting_video_responses", "awaiting_ai_analysis", "otp_verified"].includes(a.status)).length;
    const rejected = applications.filter(a => a.status === "rejected").length;
    
    return { completed, pending, rejected, total };
  }, [applications, total]);

  // Navigate to application detail
  const handleViewApplication = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Hata Oluştu</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()}>Geri Dön</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{interviewTitle}</h1>
            <p className="text-muted-foreground">Mülakata başvuran adaylar</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Toplam Başvuru</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Tamamlanan</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Bekleyen</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Reddedilen</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Aday ara (isim, e-posta)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="awaiting_ai_analysis">AI Analizi Bekleniyor</SelectItem>
                  <SelectItem value="awaiting_video_responses">Video Bekleniyor</SelectItem>
                  <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                  <SelectItem value="accepted">Kabul Edildi</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Başvuru Tarihi</SelectItem>
                  <SelectItem value="hrRating">HR Rating</SelectItem>
                  <SelectItem value="status">Durum</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Azalan</SelectItem>
                  <SelectItem value="asc">Artan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Başvurular ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Bu mülakata henüz başvuru yapılmamış.</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aday</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>AI Skoru</TableHead>
                      <TableHead>HR Rating</TableHead>
                      <TableHead>Başvuru Tarihi</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => {
                      const status = statusConfig[app.status] || statusConfig.pending;
                      return (
                        <TableRow key={app._id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {app.candidate?.name} {app.candidate?.surname}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {app.candidate?.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className="gap-1">
                              {status.icon}
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.generalAIAnalysis?.overallScore ? (
                              <span className="font-medium">{app.generalAIAnalysis.overallScore}%</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {app.hrRating ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{app.hrRating}/5</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString('tr-TR') : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewApplication(app._id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Görüntüle
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {total} başvurudan {(page - 1) * limit + 1}-{Math.min(page * limit, total)} arası gösteriliyor
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Önceki
                      </Button>
                      <span className="text-sm">
                        Sayfa {page} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Sonraki
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}