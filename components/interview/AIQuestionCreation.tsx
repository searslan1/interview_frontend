"use client";

import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Trash2, Plus, Sparkles } from "lucide-react"; // İkonlar eklendi
import { Badge } from "@/components/ui/badge";

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
    const newQuestion = {
      _id: undefined, 
      questionText: "",
      expectedAnswer: "",
      explanation: "",
      keywords: [],
      order: questions.length + 1,
      duration: 60,
      aiMetadata: {
        complexityLevel: "medium",
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
    // Mock Data: Backend'e bağlanana kadar rastgele veri üretir
    const complexityOptions = ["low", "medium", "high", "intermediate", "advanced"];
    
    const aiQuestions = Array.from({ length: aiQuestionCount }, (_, index) => ({
      _id: undefined,
      questionText: `(AI Öneri) Bu pozisyon için adayların kriz yönetimi becerisini nasıl ölçersiniz? - Soru ${index + 1}`,
      expectedAnswer: "Adayın geçmiş tecrübelerinden somut örnekler vermesi, STAR tekniğini kullanması ve sonuç odaklı olması beklenir.",
      explanation: "Bu soru, adayın baskı altındaki performansını ölçmeyi hedefler.",
      keywords: ["kriz yönetimi", "stres", "çözüm odaklılık", `${index + 1}`],
      order: questions.length + index + 1,
      duration: 120,
      aiMetadata: {
        // Rastgele zorluk seviyesi seç
        complexityLevel: complexityOptions[Math.floor(Math.random() * complexityOptions.length)],
        requiredSkills: ["Problem Çözme", "İletişim"],
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

    // Sıralama numarasını güncelle
    const reorderedItemsWithOrder = items.map((item: any, idx: number) => ({
      ...(item as any),
      order: idx + 1,
    }));

    form.setValue("questions", reorderedItemsWithOrder);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Mülakat Soruları</CardTitle>
        <CardDescription>
            Adaylara sorulacak soruları manuel ekleyin veya yapay zeka önerilerini kullanın.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        
        {/* Kontrol Paneli */}
        <div className="flex flex-col sm:flex-row gap-4 items-end justify-between bg-muted/30 p-4 rounded-lg border">
          <div className="flex items-center gap-4">
             <div className="space-y-2">
                <Label htmlFor="aiQuestionCount" className="text-xs">Öneri Sayısı</Label>
                <Input
                    id="aiQuestionCount"
                    type="number"
                    min="1"
                    max="10"
                    value={aiQuestionCount}
                    onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                    className="w-20 bg-background"
                />
             </div>
             <Button onClick={generateAIQuestions} variant="secondary" className="gap-2 mt-auto">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Soru Öner
             </Button>
          </div>
          <Button onClick={addQuestion} className="gap-2">
            <Plus className="h-4 w-4" />
            Manuel Soru Ekle
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {questions.map((question: any, index: number) => (
                  <Draggable key={index} draggableId={`question-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg bg-card transition-colors ${
                          snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : "shadow-sm"
                        }`}
                      >
                        <div className="flex items-start p-3 gap-3">
                            {/* Sürükleme Tutamacı */}
                            <div {...provided.dragHandleProps} className="mt-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0">
                                <GripVertical className="h-4 w-4" />
                            </div>

                            {/* Soru Form İçeriği */}
                            <div className="flex-1 space-y-3 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className="w-fit text-xs">Soru {index + 1}</Badge>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">Sıra: {question.order}</span>
                                        </div>
                                        <Textarea
                                            value={question.questionText}
                                            onChange={(e) => updateQuestionField(index, 'questionText', e.target.value)}
                                            placeholder="Soru metnini buraya girin..."
                                            className="min-h-[50px] text-sm font-medium resize-none focus-visible:ring-0 border-0 border-b rounded-none px-0 shadow-none"
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 shrink-0 h-8 w-8" onClick={() => removeQuestion(index)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Detay Alanları (Grid) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-muted/20 p-3 rounded-md">
                                    
                                    {/* 1. Süre */}
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Süre (sn)</Label>
                                        <Input
                                            type="number"
                                            min="10"
                                            max="300"
                                            value={question.duration}
                                            onChange={(e) => updateQuestionField(index, 'duration', Number(e.target.value))}
                                            className="h-7 bg-background text-xs"
                                        />
                                    </div>

                                    {/* 2. Zorluk Seviyesi - ✅ GÜNCELLENDİ (5 Seviye) */}
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Zorluk Seviyesi</Label>
                                        <Select
                                            value={question.aiMetadata.complexityLevel}
                                            onValueChange={(value) => updateAiMetadataField(index, 'complexityLevel', value)}
                                        >
                                            <SelectTrigger className="h-7 bg-background text-xs">
                                                <SelectValue placeholder="Seç" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Düşük</SelectItem>
                                                <SelectItem value="medium">Orta</SelectItem>
                                                <SelectItem value="high">Yüksek</SelectItem>
                                                <SelectItem value="intermediate">Orta-Üst</SelectItem>
                                                <SelectItem value="advanced">İleri</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* 3. Gerekli Yetenekler */}
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Gerekli Yetenekler</Label>
                                        <Input
                                            value={question.aiMetadata.requiredSkills.join(", ")}
                                            onChange={(e) => {
                                                const skills = e.target.value.split(",").map((k: string) => k); // Trim yapmıyoruz ki yazarken silinmesin
                                                // Gerçek kayıtta trim yapılacak
                                                updateAiMetadataField(index, 'requiredSkills', skills);
                                            }}
                                            onBlur={(e) => {
                                                // Input'tan çıkınca temizle
                                                const skills = e.target.value.split(",").map((k: string) => k.trim()).filter(Boolean);
                                                updateAiMetadataField(index, 'requiredSkills', skills);
                                            }}
                                            placeholder="İletişim, Liderlik..."
                                            className="h-8 bg-background mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Beklenen Cevap ve Keywords */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Beklenen Cevap (AI Değerlendirme Referansı)</Label>
                                        <Textarea
                                            value={question.expectedAnswer}
                                            onChange={(e) => updateQuestionField(index, 'expectedAnswer', e.target.value)}
                                            placeholder="Adaydan beklenen ideal cevabı özetleyin..."
                                            className="h-16 text-xs resize-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Anahtar Kelimeler</Label>
                                        <Textarea
                                            value={question.keywords.join(", ")}
                                            onChange={(e) => {
                                                const keywords = e.target.value.split(",");
                                                updateQuestionField(index, 'keywords', keywords);
                                            }}
                                            onBlur={(e) => {
                                                 const keywords = e.target.value.split(",").map((k: string) => k.trim()).filter(Boolean);
                                                 updateQuestionField(index, 'keywords', keywords);
                                            }}
                                            placeholder="Yönetim, Bütçe, Takım Çalışması..."
                                            className="h-16 text-xs resize-none"
                                        />
                                        <p className="text-[10px] text-muted-foreground text-right">Virgülle ayırın</p>
                                    </div>
                                </div>
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