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
import { Badge } from "@/components/ui/badge"
import { Grip, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InterviewQuestionListProps {
  form: UseFormReturn<any>
  isEditing: boolean
}

export function InterviewQuestionList({ form, isEditing }: InterviewQuestionListProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const questions = form.watch("questions")

  const onDragEnd = (result: any) => {
    if (!result.destination || !isEditing) return

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
      aiSuggested: false,
    }
    form.setValue("questions", [...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    form.setValue("questions", updatedQuestions)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mülakat Soruları</CardTitle>
        {isEditing && (
          <Button onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Soru Ekle
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Accordion type="single" collapsible value={expandedQuestion} onValueChange={setExpandedQuestion}>
                  {questions.map((question: any, index: number) => (
                    <Draggable key={question.id} draggableId={question.id} index={index} isDragDisabled={!isEditing}>
                      {(provided) => (
                        <AccordionItem
                          value={question.id}
                          className="border rounded-lg mb-4 overflow-hidden"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-accent">
                            <div className="flex items-center w-full">
                              {isEditing && (
                                <div {...provided.dragHandleProps} className="mr-2">
                                  <Grip className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
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
                                  {...form.register(`questions.${index}.text`)}
                                  disabled={!isEditing}
                                  className={cn(!isEditing && "bg-muted")}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`question-${index}-type`}>Soru Tipi</Label>
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) => form.setValue(`questions.${index}.type`, value)}
                                    disabled={!isEditing}
                                  >
                                    <SelectTrigger
                                      id={`question-${index}-type`}
                                      className={cn(!isEditing && "bg-muted")}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Metin</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="multiple_choice">Çoktan Seçmeli</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`question-${index}-duration`}>Süre (saniye)</Label>
                                  <Input
                                    id={`question-${index}-duration`}
                                    type="number"
                                    {...form.register(`questions.${index}.duration`, {
                                      valueAsNumber: true,
                                    })}
                                    disabled={!isEditing}
                                    className={cn(!isEditing && "bg-muted")}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`question-${index}-expected-answer`}>Beklenen Cevap</Label>
                                <Textarea
                                  id={`question-${index}-expected-answer`}
                                  {...form.register(`questions.${index}.expectedAnswer`)}
                                  disabled={!isEditing}
                                  className={cn(!isEditing && "bg-muted")}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`question-${index}-keywords`}>Anahtar Kelimeler</Label>
                                <Input
                                  id={`question-${index}-keywords`}
                                  {...form.register(`questions.${index}.keywords`)}
                                  disabled={!isEditing}
                                  className={cn(!isEditing && "bg-muted")}
                                  placeholder="Virgülle ayırarak girin"
                                />
                              </div>
                              {isEditing && (
                                <Button variant="destructive" size="sm" onClick={() => removeQuestion(index)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Soruyu Sil
                                </Button>
                              )}
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

