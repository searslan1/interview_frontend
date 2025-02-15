import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Candidate } from "@/mockdata/candidates"
import { useCandidateStore } from "@/store/candidateStore"

interface CandidateDetailsProps {
  candidate: Candidate
  onClose: () => void
}

export function CandidateDetails({ candidate, onClose }: CandidateDetailsProps) {
  const updateCandidateStatus = useCandidateStore((state) => state.updateCandidateStatus)

  const handleStatusChange = (newStatus: Candidate["status"]) => {
    updateCandidateStatus(candidate.id, newStatus)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{candidate.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-semibold">İletişim Bilgileri</h3>
            <p>Email: {candidate.email}</p>
            <p>Telefon: {candidate.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Başvuru Bilgileri</h3>
            <p>Pozisyon: {candidate.appliedPosition}</p>
            <p>Başvuru Tarihi: {candidate.applicationDate}</p>
            <div>
              Durum: <Badge>{candidate.status}</Badge>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Mülakat Skorları</h3>
            <p>Teknik Beceriler: {candidate.interviewScores.technicalSkills}</p>
            <p>İletişim Becerileri: {candidate.interviewScores.communicationSkills}</p>
            <p>Problem Çözme: {candidate.interviewScores.problemSolving}</p>
            <p>Kültürel Uyum: {candidate.interviewScores.culturalFit}</p>
          </div>
          <div>
            <h3 className="font-semibold">Diğer Bilgiler</h3>
            <p>Kişilik Tipi: {candidate.personalityType}</p>
            <p>AI Skoru: {candidate.aiScore}</p>
          </div>
          <div>
            <h3 className="font-semibold">Durum Güncelleme</h3>
            <div className="flex space-x-2 mt-2">
              <Button onClick={() => handleStatusChange("pending")}>Beklemede</Button>
              <Button onClick={() => handleStatusChange("interviewing")}>Mülakat Aşamasında</Button>
              <Button onClick={() => handleStatusChange("offered")}>Teklif Ver</Button>
              <Button onClick={() => handleStatusChange("rejected")}>Reddet</Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={onClose}>Kapat</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

