"use client";

import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterviewStatus } from "@/types/interview";

interface InterviewPreviewProps {
  form: UseFormReturn<any>;
}

export function InterviewPreview({ form }: InterviewPreviewProps) {
  const formData = form.getValues();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mülakat Önizleme</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-2">{formData.title}</h2>
          <p className="text-gray-600 mb-4">{formData.description}</p>
          <div className="flex space-x-2 mb-4">
            <Badge variant={formData.status === InterviewStatus.PUBLISHED ? "default" : "outline"}>
              {formData.status}
            </Badge>
            {formData.stages.personalityTest && (
              <Badge variant="outline">Kişilik Envanteri İçerir</Badge>
            )}
            {formData.stages.questionnaire && <Badge variant="outline">Soru Seti İçerir</Badge>}
          </div>
          <p>
            Mülakatın Son Kullanım Tarihi: {new Date(formData.expirationDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sorular</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.questions.map((question: any, index: number) => (
            <div key={question._id || index} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">
                Soru {index + 1}: {question.questionText}
              </h3>
              <p>Beklenen Cevap: {question.expectedAnswer || "Belirtilmemiş"}</p>
              <p>Açıklama: {question.explanation || "Yok"}</p>
              <p>Süre: {question.duration} saniye</p>
              <p>Anahtar Kelimeler: {question.keywords.join(", ")}</p>
              <p>
                Zorluk Seviyesi:{" "}
                <Badge variant="outline">{question.aiMetadata.complexityLevel}</Badge>
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yayınlama Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            **Başvuru Linki:**{" "}
            {formData.interviewLink?.link || "Henüz oluşturulmadı"}
          </p>
          <p>
            **Link Geçerlilik Süresi:**{" "}
            {formData.interviewLink?.expirationDate
              ? new Date(formData.interviewLink.expirationDate).toLocaleDateString()
              : "Belirtilmemiş"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
