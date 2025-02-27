"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { AdvancedFilters } from "@/components/applications/AdvancedFilters";
import { ApplicationPreviewDialog } from "@/components/applications/ApplicationPreviewDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import useApplicationStore from "@/store/applicationStore";

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { applications, fetchApplications, loading } = useApplicationStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const intObserver = useRef<IntersectionObserver>();
  const lastApplicationRef = useCallback(
    (application: HTMLTableRowElement | null) => {
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchApplications(); // Yeni sayfa yükleme desteği için eklenebilir
        }
      });

      if (application) intObserver.current.observe(application);
    },
    [fetchApplications]
  );

  const handleFilterChange = (newFilters: any) => setFilters(newFilters);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container mx-auto px-4 pt-20 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Başvurular</h1>
          <div className="flex space-x-2">
            <AdvancedFilters onFilterChange={handleFilterChange} />
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sıralama seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">En Yeni Başvurular</SelectItem>
                <SelectItem value="createdAt-asc">En Eski Başvurular</SelectItem>
                <SelectItem value="generalAIAnalysis.overallScore-desc">En Yüksek AI Skoru</SelectItem>
                <SelectItem value="generalAIAnalysis.overallScore-asc">En Düşük AI Skoru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ApplicationList applications={applications} lastApplicationRef={lastApplicationRef} />

        {selectedApplication && (
          <ApplicationPreviewDialog
            applicationId={selectedApplication}
            open={!!selectedApplication}
            onOpenChange={() => setSelectedApplication(null)}
          />
        )}
      </motion.div>
    </main>
  );
}
