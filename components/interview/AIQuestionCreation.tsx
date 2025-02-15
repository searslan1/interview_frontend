"use client"


import type { UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface AIQuestionCreationProps {
  form: UseFormReturn<any>
}

export function AIQuestionCreation({ form }: AIQuestionCreationProps) {
  const questions = form.watch("questions")
  const [aiQuestionCount, setAiQuestionCount] = useState(3)

  const addQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: "",
      type: "text",
      duration: 60,
      expectedAnswer: "",
      keywords: [],
    }
    form.setValue("questions", [...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    form.setValue("questions", updatedQuestions)
  }

  const generateAIQuestions = async () => {
    // Simulated AI question generation
    const aiQuestions = Array.from({ length: aiQuestionCount }, (_, index) => ({
      id: `ai-question-${Date.now()}-${index}`,
      text: `AI tarafından oluşturulan örnek soru ${index + 1}`,
      type: "text",
      duration: 120,
      expectedAnswer: "AI tarafından oluşturulan örnek beklenen cevap.",
      keywords: ["anahtar", "kelime", `${index + 1}`],
    }))
    form.setValue("questions", [...questions, ...aiQuestions])
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    form.setValue("questions", items)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soru Oluşturma</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Label htmlFor="aiQuestionCount">AI Soru Sayısı:</Label>
          <Input
            id="aiQuestionCount"
            type="number"
            min="1"
            max="10"
            value={aiQuestionCount}
            onChange={(e) => setAiQuestionCount(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={addQuestion}>Manuel Soru Ekle</Button>
          <Button onClick={generateAIQuestions}>AI ile Soru Öner</Button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {questions.map((question: any, index: number) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border p-4 rounded-md"
                      >
                        <Label htmlFor={`question-${index}`}>Soru {index + 1}</Label>
                        <Textarea
                          id={`question-${index}`}
                          value={question.text}
                          onChange={(e) => {
                            const updatedQuestions = [...questions]
                            updatedQuestions[index].text = e.target.value
                            form.setValue("questions", updatedQuestions)
                          }}
                          className="mt-1 mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`question-${index}-type`}>Soru Tipi</Label>
                            <Select
                              value={question.type}
                              onValueChange={(value) => {
                                const updatedQuestions = [...questions]
                                updatedQuestions[index].type = value
                                form.setValue("questions", updatedQuestions)
                              }}
                            >
                              <SelectTrigger id={`question-${index}-type`}>
                                <SelectValue placeholder="Soru tipi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Metin</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="multipleChoice">Çoktan Seçmeli</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`question-${index}-duration`}>Süre (saniye)</Label>
                            <Input
                              id={`question-${index}-duration`}
                              type="number"
                              value={question.duration}
                              onChange={(e) => {
                                const updatedQuestions = [...questions]
                                updatedQuestions[index].duration = Number(e.target.value)
                                form.setValue("questions", updatedQuestions)
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label htmlFor={`question-${index}-expected-answer`}>Beklenen Cevap</Label>
                          <Textarea
                            id={`question-${index}-expected-answer`}
                            value={question.expectedAnswer}
                            onChange={(e) => {
                              const updatedQuestions = [...questions]
                              updatedQuestions[index].expectedAnswer = e.target.value
                              form.setValue("questions", updatedQuestions)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div className="mt-2">
                          <Label htmlFor={`question-${index}-keywords`}>Anahtar Kelimeler (virgülle ayırın)</Label>
                          <Input
                            id={`question-${index}-keywords`}
                            value={question.keywords.join(", ")}
                            onChange={(e) => {
                              const updatedQuestions = [...questions]
                              updatedQuestions[index].keywords = e.target.value.split(",").map((k) => k.trim())
                              form.setValue("questions", updatedQuestions)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <Button variant="destructive" onClick={() => removeQuestion(index)} className="mt-2">
                          Soruyu Sil
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

