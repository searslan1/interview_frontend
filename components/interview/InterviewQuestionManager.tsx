"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Grip, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InterviewQuestion } from "@/types/interview"

interface InterviewQuestionManagerProps {
  form: UseFormReturn<any>
}

export function InterviewQuestionManager({ form }: InterviewQuestionManagerProps) {
  const [expandedQuestion, setExpandedQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const questions: InterviewQuestion[] = form.watch("questions") || [];

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    form.setValue("questions", items)
  }

  const addQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: "",
      type: "text",
      duration: 60,
      expectedAnswer: "",
      keywords: [],
      scoringCriteria: [],
    }
    form.setValue("questions", [...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    form.setValue("questions", updatedQuestions)
  }

  const handleAIQuestionSuggestion = async () => {
    // Implement AI question suggestion logic here
    console.log("AI question suggestion requested")
  }

  const generateAIQuestion = async () => {
    // Simüle edilmiş AI soru üretimi
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: "AI tarafından oluşturulan örnek soru metni",
      type: "text",
      duration: 60,
      expectedAnswer: "AI tarafından oluşturulan örnek beklenen cevap",
      keywords: ["anahtar", "kelimeler"],
      scoringCriteria: [
        { name: "Doğruluk", weight: 50 },
        { name: "Açıklık", weight: 50 },
      ],
    }
    form.setValue("questions", [...questions, newQuestion])
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Button onClick={generateAIQuestion} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Soru Oluşturuluyor...
            </>
          ) : (
            "AI Soru Oluştur"
          )}
        </Button>
        <Button onClick={handleAIQuestionSuggestion}>AI Soru Önerisi</Button>
        <Button onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          Soru Ekle
        </Button>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Accordion type="single" collapsible value={expandedQuestion} onValueChange={setExpandedQuestion}>
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <AccordionItem
                          value={question.id}
                          className="border rounded-lg mb-4 overflow-hidden"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <AccordionTrigger
                            className="px-4 py-2 hover:no-underline hover:bg-accent"
                            {...provided.dragHandleProps}
                          >
                            <div className="flex items-center w-full">
                              <span className="flex-grow text-left">{question.text || "Yeni Soru"}</span>
                              <Badge variant="outline" className="ml-2">
                                {question.type}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-4 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`question-${index}-text`}>Soru Metni</Label>
                                <Textarea
                                  id={`question-${index}-text`}
                                  value={question.text}
                                  onChange={(e) => form.setValue(`questions.${index}.text`, e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`question-${index}-type`}>Soru Tipi</Label>
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) => form.setValue(`questions.${index}.type`, value)}
                                  >
                                    <SelectTrigger id={`question-${index}-type`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Metin</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="multipleChoice">Çoktan Seçmeli</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`question-${index}-duration`}>Süre (saniye)</Label>
                                  <Input
                                    id={`question-${index}-duration`}
                                    type="number"
                                    value={question.duration}
                                    onChange={(e) =>
                                      form.setValue(`questions.${index}.duration`, Number.parseInt(e.target.value))
                                    }
                                    min={10}
                                    max={300}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`question-${index}-expected-answer`}>Beklenen Cevap</Label>
                                <Textarea
                                  id={`question-${index}-expected-answer`}
                                  value={question.expectedAnswer}
                                  onChange={(e) => form.setValue(`questions.${index}.expectedAnswer`, e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`question-${index}-keywords`}>Anahtar Kelimeler</Label>
                                <Input
                                  id={`question-${index}-keywords`}
                                  value={question.keywords.join(", ")}
                                  onChange={(e) =>
                                    form.setValue(
                                      `questions.${index}.keywords`,
                                      e.target.value.split(",").map((k) => k.trim()),
                                    )
                                  }
                                  placeholder="Virgülle ayırarak girin"
                                />
                              </div>
                              <Button variant="destructive" size="sm" onClick={() => removeQuestion(index)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Soruyu Sil
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Accordion>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

