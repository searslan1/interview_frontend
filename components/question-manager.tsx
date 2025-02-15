"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from "@/types/question"


interface QuestionManagerProps {
  questions: Question[]
  onQuestionsChange: (questions: Question[]) => void
}

export function QuestionManager({ questions, onQuestionsChange }: QuestionManagerProps) {
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: "question-" + Date.now(),   // Rastgele ya da unique ID
    text: "",
    type: "text",                  // "text" | "video" | "multiple_choice"
    duration: 60,
    order: 1,
    keywords: [],
  });
  

  const addQuestion = () => {
    onQuestionsChange([...questions, newQuestion])
    setNewQuestion({
      id: "question-" + Date.now(),   // Rastgele ya da unique ID
    text: "",
    type: "text",                  // "text" | "video" | "multiple_choice"
    duration: 60,
    order: 1,
    keywords: [],
    })
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    onQuestionsChange(updatedQuestions)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onQuestionsChange(items)
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {questions.map((question, index) => (
                <Draggable key={index} draggableId={`question-${index}`} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Soru {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Soru:</strong> {question.text}
                          </p>
                          <p>
                            <strong>Beklenen Cevap:</strong> {question.expectedAnswer}
                          </p>
                          <p>
                            <strong>Anahtar Kelimeler:</strong> {question.keywords.join(", ")}
                          </p>
                          <Button onClick={() => removeQuestion(index)} variant="destructive" className="mt-2">
                            Sil
                          </Button>
                        </CardContent>
                      </Card>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Card>
        <CardHeader>
          <CardTitle>Yeni Soru Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              placeholder="Soru Metni"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            />
            <Textarea
              placeholder="Beklenen Cevap"
              value={newQuestion.expectedAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, expectedAnswer: e.target.value })}
            />
            <Input
              placeholder="Anahtar Kelimeler (virgülle ayırın)"
              value={newQuestion.keywords.join(", ")}
              onChange={(e) => setNewQuestion({ ...newQuestion, keywords: e.target.value.split(", ") })}
            />
            <Button onClick={addQuestion}>Soru Ekle</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

