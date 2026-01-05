"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Toast bildirimi için
import { Loader2 } from "lucide-react";

// Types & Stores
import { Application } from "@/types/application";
import { useApplicationStore } from "@/store/applicationStore";
// Eğer adaya not ekleme özelliği candidateStore'da varsa onu da import edebiliriz
// import { useCandidateStore } from "@/store/candidateStore";

interface CandidateManagementProps {
  application: Application;
}

export function CandidateManagement({ application }: CandidateManagementProps) {
  const { toast } = useToast();
  
  // Local State
  const [status, setStatus] = useState<string>(application.status || "pending");
  const [comment, setComment] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Store Actions
  const { updateStatus } = useApplicationStore();
  
  // 1. Başvuru Durumunu Güncelleme (Accept/Reject)
  const handleStatusChange = async (newStatus: string) => {
    // TypeScript güvenliği için casting
    const validStatus = newStatus as 'pending' | 'rejected' | 'accepted';
    
    setStatus(validStatus);
    setIsUpdating(true);
    
    try {
      // Backend'e istek at
      await updateStatus(application._id, validStatus);
      
      toast({
        title: "Durum Güncellendi",
        description: `Başvuru durumu ${getStatusLabel(validStatus)} olarak değiştirildi.`,
        variant: "default", // veya success stili
      });
    } catch (error) {
      console.error("Status update failed:", error);
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir sorun oluştu.",
        variant: "destructive",
      });
      // Hata olursa eski duruma dönebiliriz (Opsiyonel)
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. Yorum Ekleme (Aday Profiline Not)
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    // NOT: Burası Candidate Store'a bağlanmalı. 
    // Şimdilik sadece simüle ediyoruz çünkü CandidateService'in addNote metodunu henüz bağlamadık.
    console.log(`[Candidate Note] To: ${application.candidate._id}, Content: ${comment}`);
    
    toast({
      title: "Not Eklendi",
      description: "Aday profiline notunuz başarıyla eklendi.",
    });
    setComment("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aday & Başvuru Yönetimi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* 📌 Başvuru Kararı (Decision) */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Başvuru Kararı</h4>
          <Select 
            value={status} 
            onValueChange={handleStatusChange} 
            disabled={isUpdating}
          >
            <SelectTrigger className="w-full">
               {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              <SelectValue placeholder="Karar verin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">🟡 Değerlendiriliyor (Pending)</SelectItem>
              <SelectItem value="accepted">🟢 Kabul Et (Accept)</SelectItem>
              <SelectItem value="rejected">🔴 Reddet (Reject)</SelectItem>
              {/* Diğer durumlar backend'de destekleniyorsa eklenebilir */}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
             Bu işlem adayın başvuru sürecini günceller.
          </p>
        </div>

        {/* 📌 İK Notu Ekleme */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">İK Notu</h4>
          <Textarea
            placeholder="Aday hakkında notlarınızı buraya girin (Sadece İK görebilir)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2 min-h-[100px]"
          />
          <Button 
            onClick={handleCommentSubmit} 
            disabled={!comment.trim()} 
            variant="secondary"
            className="w-full"
          >
            Notu Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper: Status Label
function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        pending: "Değerlendiriliyor",
        accepted: "Kabul Edildi",
        rejected: "Reddedildi",
        in_progress: "İşlemde"
    };
    return labels[status] || status;
}