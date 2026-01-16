"use client";

import { useState, useEffect } from "react";
import { useApplicationStore } from "@/store/applicationStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Clock, Filter, Search, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Application } from "@/types/application";

export default function PendingApplicationsPage() {
  const { items: applications, loading, fetchApplications } = useApplicationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sadece pending durumundaki başvuruları getir
  useEffect(() => {
    fetchApplications({
      status: 'pending',
      sortBy,
      sortOrder,
      limit: 50
    });
  }, [fetchApplications, sortBy, sortOrder]);

  // Arama ve filtreleme
  const filteredApplications = applications.filter(app => {
    // Sadece pending durumundakileri göster
    if (app.status !== 'pending') return false;
    
    // Arama terimi kontrolü
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.candidateInfo.fullName?.toLowerCase().includes(searchLower) ||
        app.candidateInfo.email?.toLowerCase().includes(searchLower) ||
        app.candidateInfo.phone?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} gün önce`;
    if (diffHours > 0) return `${diffHours} saat önce`;
    if (diffMins > 0) return `${diffMins} dakika önce`;
    return "Az önce";
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <PageHeader
          title="Bekleyen Başvurular"
          description="OTP doğrulaması bekleyen başvuruları inceleyin"
        />
        <div className="flex-1 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Bekleyen Başvurular"
        description={`${filteredApplications.length} adet OTP bekleyen başvuru`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Başvurular", href: "/applications" },
          { label: "Bekleyen" }
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Filtreleme ve Arama */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Ad, email veya telefon ile arayın..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "createdAt" | "updatedAt")}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Oluşturulma Tarihi</SelectItem>
                  <SelectItem value="updatedAt">Güncellenme Tarihi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">En Yeni</SelectItem>
                  <SelectItem value="asc">En Eski</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* İstatistik Kartı */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bekleyen Toplam</p>
                  <p className="text-2xl font-bold">{filteredApplications.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bugün Oluşturulan</p>
                  <p className="text-2xl font-bold">
                    {filteredApplications.filter(app => 
                      new Date(app.createdAt).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <FileQuestion className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">7 Gün+</p>
                  <p className="text-2xl font-bold">
                    {filteredApplications.filter(app => {
                      const daysDiff = Math.floor(
                        (new Date().getTime() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return daysDiff >= 7;
                    }).length}
                  </p>
                </div>
                <Filter className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Başvuru Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Bekleyen Başvurular</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Bekleyen başvuru bulunamadı"
                description={
                  searchTerm 
                    ? "Arama kriterlerinize uygun başvuru bulunamadı." 
                    : "Henüz OTP bekleyen başvuru yok."
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-700 font-semibold">
                            {application.candidateInfo.fullName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        
                        {/* Bilgiler */}
                        <div className="space-y-1">
                          <h3 className="font-semibold">
                            {application.candidateInfo.fullName || 'İsimsiz Aday'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {application.candidateInfo.email}
                          </p>
                          {application.candidateInfo.phone && (
                            <p className="text-sm text-muted-foreground">
                              {application.candidateInfo.phone}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(application.createdAt)} oluşturuldu
                          </p>
                        </div>
                      </div>
                      
                      {/* Durum ve Aksiyon */}
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Clock className="h-3 w-3 mr-1" />
                          OTP Bekliyor
                        </Badge>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`/applications/${application._id}`, '_blank')}
                        >
                          Detayları Gör
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}