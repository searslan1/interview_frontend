"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CandidateDetailCard } from "@/components/candidate/candidate-detail-card";
import { useApplicationStore } from "@/store/application-store"; // API verilerini çekmek için store kullanıyoruz.
import type { Application } from "@/types/application";

interface ApplicationManagerProps {
  interviewId: string; // ✅ `useParams()` ile gelen ID her zaman string'dir.
}

export function ApplicationManager({ interviewId }: ApplicationManagerProps) {
  const { fetchApplications, getApplicationsByInterviewId } = useApplicationStore();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications(); // API'den başvuruları çek
  }, [fetchApplications]);

  const applications: Application[] = getApplicationsByInterviewId(interviewId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Başvurular</h2>
      {applications.length === 0 ? (
        <p>Henüz başvuru bulunmamaktadır.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {applications.map((application) => (
            <Card key={application.id} className="flex-shrink-0 w-64 bg-gray-800 text-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{application.candidate.name}</h3>
                <p className="text-sm mb-2">Başvuru: {new Date(application.submissionDate).toLocaleDateString()}</p>
                <Badge
                  variant={
                    application.status === "accepted"
                      ? "default"
                      : application.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {application.status === "accepted"
                    ? "Olumlu"
                    : application.status === "rejected"
                      ? "Olumsuz"
                      : "Beklemede"}
                </Badge>
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
