"use client";

import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/types/application";

interface ApplicationListProps {
  applications: Application[];
  lastApplicationRef?: (node: HTMLTableRowElement | null) => void;
}

const statusColors: Record<Application["status"], string> = {
  pending: "bg-yellow-500 text-white",
  in_progress: "bg-blue-500 text-white",
  completed: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
  accepted: "bg-green-500 text-white",
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

// ✅ Yardımcı fonksiyonlar eklendi
function formatDate(dateString: string) {
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
  };

  return statusMap[status] || status;
}
