"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InterviewDetailsProps {
  interview: any // Tip güvenliği için daha spesifik bir tip kullanılabilir
}

export function InterviewDetails({ interview }: InterviewDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mülakat Detayları</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Açıklama:</strong> {interview.description}
        </p>
        <p>
          <strong>Tür:</strong> {interview.type}
        </p>
        <p>
          <strong>Durum:</strong> <Badge>{interview.status}</Badge>
        </p>
        <p>
          <strong>Başlangıç Tarihi:</strong> {interview.startDate}
        </p>
        <p>
          <strong>Bitiş Tarihi:</strong> {interview.endDate}
        </p>
        <p>
          <strong>Süre:</strong> {interview.duration} dakika
        </p>
        <p>
          <strong>AI Destekli:</strong> {interview.aiEnabled ? "Evet" : "Hayır"}
        </p>
        <p>
          <strong>Kişilik Testi:</strong> {interview.personalityTest ? "Var" : "Yok"}
        </p>
      </CardContent>
    </Card>
  )
}

