"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Candidate } from "@/types/candidate"; // ✅ Doğru tip kullanıldı
import { useCandidateStore } from "@/store/candidateStore";

interface CandidateManagementProps {
  candidate: Candidate;
}

export function CandidateManagement({ candidate }: CandidateManagementProps) {
  const [status, setStatus] = useState<Candidate["status"]>(candidate.status || "pending");
  const [comment, setComment] = useState<string>("");

  const updateCandidateStatus = useCandidateStore((state) => state.updateCandidateStatus);
  const addCandidateComment = useCandidateStore((state) => state.addCandidateComment);

  const handleStatusChange = (newStatus: Candidate["status"]) => {
    setStatus(newStatus);
    if (updateCandidateStatus) {
      updateCandidateStatus(candidate.id, newStatus);
      console.log(`Durum güncellendi: ${newStatus}`);
    } else {
      console.error("updateCandidateStatus fonksiyonu eksik.");
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      console.warn("Boş yorum gönderilemez.");
      return;
    }

    if (addCandidateComment) {
      addCandidateComment(candidate.id, comment);
      console.log(`Yorum eklendi: ${comment}`);
      setComment("");
    } else {
      console.error("addCandidateComment fonksiyonu eksik.");
    }
  };

  const handleRedirect = () => {
    console.log("Aday diğer mülakatlara yönlendiriliyor.");
    // Buraya API çağrısı veya yönlendirme mantığı eklenebilir
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aday Yönetimi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 📌 Aday Durum Güncelleme */}
        <div>
          <h4 className="font-semibold mb-2">Başvuru Durumu</h4>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="interviewing">Mülakatta</SelectItem>
              <SelectItem value="offered">Teklif Verildi</SelectItem>
              <SelectItem value="rejected">Reddedildi</SelectItem>
              <SelectItem value="review">İnceleniyor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 📌 Yorum Ekleme */}
        <div>
          <h4 className="font-semibold mb-2">Yorum Ekle</h4>
          <Textarea
            placeholder="Yorumunuzu buraya girin..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
            Yorum Gönder
          </Button>
        </div>

        {/* 📌 Adayı Başka Mülakatlara Yönlendirme */}
        <div>
          <h4 className="font-semibold mb-2">Adayı Yönlendir</h4>
          <Button onClick={handleRedirect}>Diğer Mülakatları Öner</Button>
        </div>
      </CardContent>
    </Card>
  );
}
