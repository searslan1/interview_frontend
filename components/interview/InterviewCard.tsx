"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Yeni
import {
  DropdownMenu, // Yeni
  DropdownMenuContent, // Yeni
  DropdownMenuItem, // Yeni
  DropdownMenuTrigger, // Yeni
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Users,
  Clock,
  Link, // Link Kopyalama İkonu
  Play, // Yayınlama İkonu
  MoreVertical, // 3 Nokta Menüsü
  Pencil, // Düzenleme
  Trash2, // Silme
  FastForward, // Süre Uzatma
  Eye, // Başvuruları Görüntüle
} from "lucide-react";
import type { Interview, InterviewStatus } from "@/types/interview";
import { useInterviewStore } from "@/store/interviewStore"; // Store import edildi (API çağrısı için)
import { useToast } from "@/components/ui/use-toast"; // Toast (bildirim) için

// --- UX SABİTLERİ ---
const statusColors: Record<InterviewStatus, string> = {
  active: "bg-green-500 text-white",
  completed: "bg-gray-500 text-white",
  published: "bg-blue-500 text-white",
  draft: "bg-yellow-500 text-white",
  inactive: "bg-red-500 text-white",
};

interface InterviewCardProps {
  interview: Interview;
  // Dinamik olarak mülakatların listelendiği sayfanın yönetici fonksiyonunu almalı
  onEdit: (interview: Interview) => void; // Düzenleme için dialog açma fonksiyonu
  onExtendDuration: (interview: Interview) => void; // Süre uzatma dialogu açma
  isFeatured?: boolean; // İsteğe bağlı: Öne çıkarılmış mülakatlar için
}

export function InterviewCard({ interview, onEdit, onExtendDuration }: InterviewCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { publishInterview, deleteInterview } = useInterviewStore(); // API metotları

  const [isLoading, setIsLoading] = useState(false);

  // Mülakat süresini hesapla (Boş array hatası önlendi)
  const totalDuration = interview.questions?.reduce((total, q) => total + q.duration, 0) || 0;

  // 1. Durum: TASLAK (DRAFT) ise Yayınla butonu görünmeli
  const isDraft = interview.status === "draft";
  // 2. Durum: YAYINLANMIŞ (PUBLISHED) ise Kopyala ve Yayından Kaldır görünmeli
  const isPublished = interview.status === "published" || interview.status === "active";

  /**
   * Mülakatı yayınlar ve link oluşturur (Tek butonda iki rota)
   */
  const handlePublish = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Kartın Detay sayfasına yönlendirmesini engelle
    setIsLoading(true);
    try {
      // Backend'deki publishInterview rotası hem PUBLISHED yapar hem de Link oluşturur
      await publishInterview(interview._id); 
      toast({ title: "Başarılı", description: "Mülakat yayınlandı ve link oluşturuldu." });
      // Başarılı olursa listeyi yenilemek için gerekli logic (örneğin useSWR veya useQuery invalidate) buraya gelir.
    } catch (error) {
      toast({ title: "Hata", description: "Yayınlama başarısız oldu.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mülakat Linkini Kopyalar
   */
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (interview.interviewLink?.link) {
      navigator.clipboard.writeText(interview.interviewLink.link);
      toast({ title: "Kopyalandı", description: "Mülakat linki panoya kopyalandı." });
    } else {
       toast({ title: "Uyarı", description: "Mülakat linki henüz oluşturulmamış.", variant: "warning" });
    }
  };
  
  /**
   * Mülakatı soft-delete yapar
   */
  const handleDelete = async () => {
     if (!window.confirm("Bu mülakatı silmek istediğinizden emin misiniz?")) return;

     setIsLoading(true);
     try {
       await deleteInterview(interview._id); 
       toast({ title: "Başarılı", description: "Mülakat silindi." });
       // Listeyi yenileme logic'i
     } catch (error) {
       toast({ title: "Hata", description: "Silme işlemi başarısız oldu.", variant: "destructive" });
     } finally {
       setIsLoading(false);
     }
  };


  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 relative">
      
      {/* 3 NOKTA MENÜSÜ - AKSİYONLAR */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            
            {/* Düzenleme (Sadece Taslak ise işlevli) */}
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); if (isDraft) onEdit(interview); }}
              disabled={isPublished} // Yayınlanmış ise pasif
              className={isPublished ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}
            >
              <Pencil className="mr-2 h-4 w-4" /> 
              {isDraft ? "Düzenle" : "Düzenle (Yayınlanmış)"}
            </DropdownMenuItem>
            
            {/* Süreyi Uzat (Sadece Yayınlanmış ise işlevli) */}
            <DropdownMenuItem 
               onClick={(e) => { e.stopPropagation(); if (isPublished) onExtendDuration(interview); }}
               disabled={isDraft}
               className={isDraft ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}
            >
              <FastForward className="mr-2 h-4 w-4" /> Süreyi Uzat
            </DropdownMenuItem>

            {/* Silme */}
            <DropdownMenuItem 
               onClick={(e) => { e.stopPropagation(); handleDelete(); }}
               className="text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Ana Kart İçeriği - Detaya Yönlendirme */}
      <div 
        className="p-4"
      >
        
        {/* Başlık ve Açıklama */}
        <h3 className="text-lg font-semibold mb-2 pr-10">{interview.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {interview.questions?.length ?? 0} soru içeriyor.
        </p>

        {/* Tarih ve Süre Bilgileri */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{interview.expirationDate ? new Date(interview.expirationDate).toLocaleDateString("tr-TR") : "Süresiz"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalDuration} dakika</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{interview.stages.personalityTest ? "Testli" : "Testsiz"}</span>
          </div>
        </div>

        {/* ALT BÖLÜM: DURUM VE HIZLI AKSİYONLAR */}
        <div className="flex justify-between items-center pt-3 border-t">
          
          {/* Durum Etiketi */}
          <Badge className={statusColors[interview.status]}>
            {interview.status.toUpperCase() ?? "BİLİNMİYOR"}
          </Badge>

          <div className="flex space-x-2">
            
            {/* 👁 BAŞVURULARI GÖR BUTONU */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                router.push(`/interviews/${interview._id}/applications`); 
              }}
              title="Başvuruları Görüntüle"
            >
              <Eye className="h-4 w-4 mr-1" />
              Başvurular
            </Button>
            
            {/* 🔗 LİNK KOPYALAMA İKONU (Sadece Yayınlanmış/Aktif ise) */}
            {isPublished && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
                disabled={isLoading}
                title="Mülakat Linkini Kopyala"
              >
                <Link className="h-4 w-4" />
              </Button>
            )}

            {/* YAYINLA / YAYINDAN KALDIR BUTONU */}
            {isDraft && (
              <Button 
                onClick={handlePublish} 
                disabled={isLoading} 
                title="Yayınla ve Link Oluştur"
              >
                {isLoading ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Yayınla
              </Button>
            )}
            
            {/* Yayınlanmış Mülakatı Yayından Kaldır (Gerekirse) */}
            {/* {isPublished && (
               <Button 
                 variant="secondary"
                 onClick={handleUnpublish} 
                 disabled={isLoading} 
                 title="Yayından Kaldır"
               >
                 Yayından Kaldır
               </Button>
            )} */}
            
          </div>
        </div>
      </div>
    </Card>
  );
}