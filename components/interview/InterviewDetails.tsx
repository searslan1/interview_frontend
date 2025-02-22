"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Interview, InterviewQuestion } from "@/types/interview";

interface InterviewDetailsProps {
  interview: Interview;
}

export function InterviewDetails({ interview }: InterviewDetailsProps) {
  // ✅ Soruların toplam süresini hesapla
  const totalDuration = interview.questions.reduce((sum, q) => sum + q.duration, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mülakat Detayları</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Başlık:</strong> {interview.title}
        </p>
        <p>
          <strong>Durum:</strong> <Badge>{interview.status}</Badge>
        </p>
        <p>
          <strong>Bitiş Tarihi:</strong> {new Date(interview.expirationDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Süre:</strong> {totalDuration} dakika
        </p>
        <p>
          <strong>Kişilik Testi:</strong> {interview.stages.personalityTest ? "Var" : "Yok"}
        </p>
        <p>
          <strong>Soru Seti:</strong> {interview.stages.questionnaire ? "Var" : "Yok"}
        </p>
        <p>
          <strong>Oluşturulma Tarihi:</strong> {new Date(interview.createdAt).toLocaleDateString()}
        </p>

        {/* ✅ Mülakata ait soruların listelenmesi */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Mülakat Soruları</h3>
          <ul className="space-y-4">
            {interview.questions.map((question: InterviewQuestion, index: number) => (
              <li key={index} className="p-4 border rounded-lg shadow-sm">
                <p>
                  <strong>Soru {question.order}:</strong> {question.questionText}
                </p>
                <p>
                  <strong>Beklenen Cevap:</strong> {question.expectedAnswer}
                </p>
                <p>
                  <strong>Açıklama:</strong> {question.explanation || "Yok"}
                </p>
                <p>
                  <strong>Anahtar Kelimeler:</strong> {question.keywords.join(", ")}
                </p>
                <p>
                  <strong>Süre:</strong> {question.duration} dakika
                </p>
                <p>
                  <strong>Zorluk Seviyesi:</strong> {question.aiMetadata.complexityLevel}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
