"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const questions = [
  { id: 1, text: "React hooks nedir?", type: "Teknik", difficulty: "Orta" },
  { id: 2, text: "REST API nedir?", type: "Teknik", difficulty: "Kolay" },
  { id: 3, text: "Agile metodolojisi nedir?", type: "Metodoloji", difficulty: "Orta" },
  { id: 4, text: "Docker nedir ve ne işe yarar?", type: "DevOps", difficulty: "Zor" },
  { id: 5, text: "En zorlu iş deneyiminiz neydi?", type: "Davranışsal", difficulty: "Orta" },
]

export function QuestionList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Soru ara..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>Yeni Soru Ekle</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Soru</TableHead>
            <TableHead>Tür</TableHead>
            <TableHead>Zorluk</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuestions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.text}</TableCell>
              <TableCell>{question.type}</TableCell>
              <TableCell>{question.difficulty}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Düzenle
                </Button>
                <Button variant="outline" size="sm">
                  Sil
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

