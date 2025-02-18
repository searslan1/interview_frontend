"use client";

import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ApplicationListProps {
  applications: Array<{
    id: string;
    candidateName: string;
    email: string;
    status: "pending" | "in_progress" | "completed" | "rejected" | "accepted"; 
    submissionDate: string;
    aiScore: number;
    interviewTitle: string;
  }>;
  lastApplicationRef?: (node: HTMLTableRowElement | null) => void; // ✅ `lastApplicationRef` opsiyonel hale getirildi
}

const statusColors: Record<ApplicationListProps["applications"][0]["status"], string> = {
  pending: "bg-yellow-500 text-white",
  in_progress: "bg-blue-500 text-white",
  completed: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
  accepted: "bg-green-500 text-white",
};

// ✅ `forwardRef` ile `lastApplicationRef` desteklendi
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
                  <TableHead>Mülakat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Başvuru Tarihi</TableHead>
                  <TableHead>AI Skoru</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application, index) => (
                  <TableRow key={application.id} ref={index === applications.length - 1 ? lastApplicationRef : null}>
                    <TableCell>{application.candidateName}</TableCell>
                    <TableCell>{application.interviewTitle}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[application.status]}>{application.status}</Badge>
                    </TableCell>
                    <TableCell>{application.submissionDate}</TableCell>
                    <TableCell>{application.aiScore || "N/A"}</TableCell> 
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

ApplicationList.displayName = "ApplicationList"; // ✅ `forwardRef` kullanıldığı için displayName eklendi
