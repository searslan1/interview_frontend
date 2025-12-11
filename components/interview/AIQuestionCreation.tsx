"use client";

import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Select, // 📌 YENİ: Dropdown için
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Not: requiredSkills için TagInput bileşeni kullanılması idealdir, ancak burada basit Input ile yönetilecektir.

interface AIQuestionCreationProps {
  form: UseFormReturn<any>;
}

export function AIQuestionCreation({ form }: AIQuestionCreationProps) {
  const questions = form.watch("questions");
  const [aiQuestionCount, setAiQuestionCount] = useState(3);

  const updateQuestionField = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    form.setValue("questions", updatedQuestions);
  };

  const updateAiMetadataField = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].aiMetadata = {
      ...updatedQuestions[index].aiMetadata,
      [field]: value,
    };
    form.setValue("questions", updatedQuestions);
  };

  const addQuestion = () => {
    // ... (Mevcut mantık)
    const newQuestion = {
      _id: undefined, 
      questionText: "",
      expectedAnswer: "",
      explanation: "",
      keywords: [],
      order: questions.length + 1,
      duration: 60,
      aiMetadata: {
        complexityLevel: "medium", // Default değer
        requiredSkills: [],
        keywordMatchScore: 0,
      },
    };
    form.setValue("questions", [...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    form.setValue("questions", updatedQuestions);
  };

  const generateAIQuestions = async () => {
    // ... (Mevcut mantık)
    const aiQuestions = Array.from({ length: aiQuestionCount }, (_, index) => ({
      _id: undefined,
      questionText: `AI tarafından oluşturulan örnek soru ${index + 1}`,
      expectedAnswer: "AI tarafından oluşturulan örnek beklenen cevap.",
      explanation: "",
      keywords: ["anahtar", "kelime", `${index + 1}`],
      order: questions.length + index + 1,
      duration: 120,
      aiMetadata: {
        complexityLevel: "medium",
        requiredSkills: ["AI-generated"],
        keywordMatchScore: 0,
      },
    }));
    form.setValue("questions", [...questions, ...aiQuestions]);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions) as any[];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Sıralama numarasını da güncelleyelim
    const reorderedItemsWithOrder = items.map((item: any, idx: number) => ({
      ...(item as any),
      order: idx + 1,
    }));

    form.setValue("questions", reorderedItemsWithOrder);
  };

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
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 pt-4">
                {questions.map((question: any, index: number) => (
                  <Draggable key={index} draggableId={`question-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border p-4 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex justify-between items-center mb-3">
                            <Label className="text-lg font-medium">Soru {index + 1}</Label>
                            <Button variant="destructive" size="sm" onClick={() => removeQuestion(index)}>
                                Soruyu Sil
                            </Button>
                        </div>
                        
                        <Label htmlFor={`question-${index}`}>Soru Metni</Label>
                        <Textarea
                          id={`question-${index}`}
                          value={question.questionText}
                          onChange={(e) => updateQuestionField(index, 'questionText', e.target.value)}
                          className="mt-1 mb-3"
                        />
                        
                        {/* AI METADATA ve SÜRE GRUBU */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          
                          {/* 1. Süre */}
                          <div>
                            <Label htmlFor={`question-${index}-duration`}>Süre (saniye)</Label>
                            <Input
                              id={`question-${index}-duration`}
                              type="number"
                              min="10"
                              max="300"
                              value={question.duration}
                              onChange={(e) => updateQuestionField(index, 'duration', Number(e.target.value))}
                            />
                          </div>
                          
                          {/* 2. Zorluk Seviyesi (Complexity Level) */}
                          <div>
                            <Label htmlFor={`question-${index}-complexity`}>Zorluk Seviyesi</Label>
                            <Select
                              value={question.aiMetadata.complexityLevel}
                              onValueChange={(value) => updateAiMetadataField(index, 'complexityLevel', value)}
                            >
                              <SelectTrigger id={`question-${index}-complexity`}>
                                <SelectValue placeholder="Seviye Seç" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Düşük</SelectItem>
                                <SelectItem value="medium">Orta</SelectItem>
                                <SelectItem value="high">Yüksek</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* 3. Gerekli Yetenekler (Required Skills) */}
                          <div className="md:col-span-1">
                            <Label htmlFor={`question-${index}-required-skills`}>Gerekli Yetenekler (Virgülle)</Label>
                            <Input
                              id={`question-${index}-required-skills`}
                              value={question.aiMetadata.requiredSkills.join(", ")}
                              onChange={(e) => {
                                const skills = e.target.value.split(",").map((k) => k.trim()).filter(Boolean);
                                updateAiMetadataField(index, 'requiredSkills', skills);
                              }}
                              placeholder="örn: iletişim, problem çözme"
                            />
                          </div>
                        </div>

                        {/* BEKLENEN CEVAP ve ANAHTAR KELİMELER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-1">
                            <Label htmlFor={`question-${index}-expected-answer`}>Beklenen Cevap</Label>
                            <Textarea
                              id={`question-${index}-expected-answer`}
                              value={question.expectedAnswer}
                              onChange={(e) => updateQuestionField(index, 'expectedAnswer', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <Label htmlFor={`question-${index}-keywords`}>Anahtar Kelimeler (Virgülle Ayırın)</Label>
                            <Input
                              id={`question-${index}-keywords`}
                              value={question.keywords.join(", ")}
                              onChange={(e) => {
                                const keywords = e.target.value.split(",").map((k) => k.trim()).filter(Boolean);
                                updateQuestionField(index, 'keywords', keywords);
                              }}
                              placeholder="örn: iletişim, liderlik, çatışma"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
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
  );
}