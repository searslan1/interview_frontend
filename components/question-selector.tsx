"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Bu örnek sorular. Gerçek uygulamada bu sorular API'den gelecektir.
const availableQuestions = [
  { id: "1", text: "React hooks nedir ve ne işe yarar?" },
  { id: "2", text: "REST API nedir?" },
  { id: "3", text: "JavaScript'te closure nedir?" },
  { id: "4", text: "CSS flexbox ve grid arasındaki fark nedir?" },
]

type QuestionSelectorProps = {
  selectedQuestions: string[]
  onQuestionsChange: (questions: string[]) => void
}

export function QuestionSelector({ selectedQuestions, onQuestionsChange }: QuestionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localSelectedQuestions, setLocalSelectedQuestions] = useState(selectedQuestions)

  const handleQuestionToggle = (questionId: string) => {
    setLocalSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const handleSave = () => {
    onQuestionsChange(localSelectedQuestions)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Soru Seç</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Soruları Seç</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {availableQuestions.map((question) => (
            <div key={question.id} className="flex items-center space-x-2">
              <Checkbox
                id={question.id}
                checked={localSelectedQuestions.includes(question.id)}
                onCheckedChange={() => handleQuestionToggle(question.id)}
              />
              <label
                htmlFor={question.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {question.text}
              </label>
            </div>
          ))}
        </div>
        <Button onClick={handleSave}>Kaydet</Button>
      </DialogContent>
    </Dialog>
  )
}

