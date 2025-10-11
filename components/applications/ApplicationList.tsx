import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/types/application";

interface ApplicationListProps {
  applications: Application[];
  lastApplicationRef?: (node: HTMLTableRowElement | null) => void;
}

// 🚀 GÜNCELLEME 1: Yeni durumlar için renkler eklendi
const statusColors: Record<Application["status"], string> = {
  pending: "bg-yellow-500 text-white",
  in_progress: "bg-blue-500 text-white",
  completed: "bg-green-700 text-white",
  rejected: "bg-red-500 text-white",
  accepted: "bg-green-500 text-white",
  // AI ve Video Bekleme Durumu
  awaiting_video_responses: "bg-purple-600 text-white",
  awaiting_ai_analysis: "bg-orange-500 text-white animate-pulse", // Analiz bekleme durumu için dikkat çekici bir renk
};

export const ApplicationList = forwardRef<HTMLTableRowElement, ApplicationListProps>(
  ({ applications, lastApplicationRef }, ref) => {
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
                  <TableHead>Mülakat ID</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Başvuru Tarihi</TableHead>
                  <TableHead>AI Skoru</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application, index) => (
                  <TableRow
                    key={application._id}
                    ref={index === applications.length - 1 ? lastApplicationRef : null}
                  >
                    <TableCell>
                      {application.candidate.name} {application.candidate.surname}
                    </TableCell>
                    <TableCell>{application.interviewId}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[application.status]}>
                        {formatStatus(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(application.createdAt)}</TableCell>
                    <TableCell>{application.generalAIAnalysis?.overallScore ?? "N/A"}</TableCell>
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

// Yardımcı fonksiyonlar (Aynı kalır)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 🚀 GÜNCELLEME 2: Yeni durumlar için metin çevirileri eklendi
function formatStatus(status: Application["status"]) {
  const statusMap = {
    pending: "Bekliyor",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    rejected: "Reddedildi",
    accepted: "Kabul Edildi",
    awaiting_video_responses: "Video Bekleniyor", // Adaydan video yanıtı bekleniyor
    awaiting_ai_analysis: "AI Analizi Bekleniyor", // Video yüklendi, analiz kuyrukta
  };

  return statusMap[status] || status;
}