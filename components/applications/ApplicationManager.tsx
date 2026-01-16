"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CandidateDetailCard } from "@/components/applications/candidate-detail-card";
import useApplicationStore from "@/store/applicationStore"; // Zustand store
import type { Application } from "@/types/application";

interface ApplicationManagerProps {
  interviewId: string; // ✅ useParams() ile gelen ID string'dir.
}

export function ApplicationManager({ interviewId }: ApplicationManagerProps) {
  const { applications, fetchApplications } = useApplicationStore();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (applications.length === 0) {
      fetchApplications(); // Eğer başvurular yüklü değilse API çağrısı yap
    }
  }, [fetchApplications, applications.length]);

  // ✅ Belirtilen `interviewId` ile filtreleme frontend'de yapılıyor
  const filteredApplications = applications.filter((app) => app.interviewId === interviewId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Başvurular</h2>

      {filteredApplications.length === 0 ? (
        <p>Henüz başvuru bulunmamaktadır.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {filteredApplications.map((application) => (
            <Card key={application._id} className="flex-shrink-0 w-64 glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{application.candidate.name} {application.candidate.surname}</h3>
                <p className="text-sm mb-2 text-muted-foreground">Başvuru: {formatDate(application.createdAt)}</p>
                <StatusBadge status={application.status} />
                <Button className="mt-4 w-full" onClick={() => setSelectedApplication(application)}>
                  Detaylar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedApplication && (
        <CandidateDetailCard
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </motion.div>
  );
}

// ✅ Tarih formatını düzenleme fonksiyonu
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
