import { forwardRef } from "react";
import { useRouter } from "next/navigation"; // ✅ Yönlendirme için gerekli
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Application, ApplicationStatus } from "@/types/application"; // Sadece tip çevirileri için gerekli
import { Loader2, Eye } from "lucide-react";

// ✅ YENİ TİP TANIM: Component'in ihtiyacı olan sadeleştirilmiş alanlar
// Bu tip, app/[id]/applications/page.tsx içinde tanımladığınız ApplicationListItem ile eşleşmelidir.
export interface ApplicationListItem {
    id: string; // app.id
    interviewId: string;
    candidateName: string; // app.candidate.name + app.candidate.surname
    email: string;
       status: ApplicationStatus; 
    submissionDate: string; 
    aiScore: number | string; 
    interviewTitle: string;
}

interface ApplicationListProps {
  applications: ApplicationListItem[];
  lastApplicationRef?: (node: HTMLTableRowElement | null) => void;
  isLoading?: boolean;
  
}

const statusColors: Record<Application["status"], string> = {
  pending: "bg-yellow-500 text-white",
  in_progress: "bg-blue-500 text-white",
  completed: "bg-green-700 text-white",
  rejected: "bg-red-500 text-white",
  accepted: "bg-green-500 text-white",
  awaiting_video_responses: "bg-purple-600 text-white",
  awaiting_ai_analysis: "bg-orange-500 text-white animate-pulse",
};

export const ApplicationList = forwardRef<HTMLTableRowElement, ApplicationListProps>(
  ({ applications, lastApplicationRef, isLoading }, ref) => { // ✅ isLoading burada karşılandı
    const router = useRouter();

    // 1️⃣ LOADING DURUMU KONTROLÜ
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Başvurular</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                    <p>Başvurular yükleniyor...</p>
                </CardContent>
            </Card>
        );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Başvurular</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-gray-500">Henüz başvuru bulunmamaktadır.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aday Adı</TableHead>
                  <TableHead>Mülakat Adı</TableHead> {/* ✅ Mülakat ID yerine Adı gösteriliyor */}
                  <TableHead>Durum</TableHead>
                  <TableHead>Başvuru Tarihi</TableHead>
                  <TableHead>AI Skoru</TableHead>
                  <TableHead className="text-right">İşlem</TableHead> {/* ✅ İşlem kolonu eklendi */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* application'ın tipi artık ApplicationListItem'dır */}
                {applications.map((application, index) => ( 
                  <TableRow
                    key={application.id} // ✅ _id yerine id kullanıldı (ApplicationListItem tipine göre)
                    ref={index === applications.length - 1 ? lastApplicationRef : null}
                  >
                    <TableCell>
                      {application.candidateName} {/* ✅ candidate objesine gerek kalmadı */}
                    </TableCell>
                    <TableCell>{application.interviewTitle}</TableCell> {/* ✅ interviewId yerine Title kullanıldı */}
                    <TableCell>
                      <Badge className={statusColors[application.status]}>
                        {formatStatus(application.status)}
                      </Badge>
                    </TableCell>
                    {/* ✅ createdAt yerine submissionDate kullanıldı (Artık formatlanmış string) */}
                    <TableCell>{application.submissionDate}</TableCell> 
                    <TableCell>{application.aiScore ?? "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }
);

ApplicationList.displayName = "ApplicationList";

// Yardımcı fonksiyonlar (Artık sadece formatStatus gerekli, formatDate artık kullanılmıyor)
function formatDate(dateString: string) {
    // Bu fonksiyon artık kullanılmayacak, çünkü tarih Page.tsx'te formatlanıp gönderiliyor.
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatStatus(status: Application["status"]) {
  const statusMap = {
    pending: "Bekliyor",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    rejected: "Reddedildi",
    accepted: "Kabul Edildi",
    awaiting_video_responses: "Video Bekleniyor",
    awaiting_ai_analysis: "AI Analizi Bekleniyor",
  };

  return statusMap[status] || status;
}
