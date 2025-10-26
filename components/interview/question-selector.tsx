"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { InterviewQuestion } from "@/types/interview";
import { useQuestionStore } from "@/store/question-store"; // ✅ API'den sorular çekilecek

type QuestionSelectorProps = {
  selectedQuestions: InterviewQuestion[];
  onQuestionsChange: (questions: InterviewQuestion[]) => void;
};

export function QuestionSelector({ selectedQuestions, onQuestionsChange }: QuestionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedQuestions, setLocalSelectedQuestions] = useState<InterviewQuestion[]>(selectedQuestions);
  
  // ✅ API'den soruları çekiyoruz
  const { questions, fetchQuestions, isLoading } = useQuestionStore();

  useEffect(() => {
    fetchQuestions(); // ✅ Component mount olduğunda API çağrısı
  }, [fetchQuestions]);

  useEffect(() => {
    // Ana formun soruları harici bir yerden değişirse (AI entegrasyonu), 
    // yerel seçimi de güncelle
    setLocalSelectedQuestions(selectedQuestions);
  }, [selectedQuestions]);
  const handleQuestionToggle = (question: InterviewQuestion) => {
    setLocalSelectedQuestions((prev) =>
      prev.some((q) => q._id === question._id)
        ? prev.filter((q) => q._id !== question._id)
        : [...prev, { ...question, keywords: question.keywords ?? [] }] 
    );
  };

  const handleSave = () => {
    const cleanedQuestions = localSelectedQuestions.map(({ _id, ...rest }) => ({
        ...rest,
        // DTO'da olmaması gereken 'id' alanını silmek için:
        // (Eğer seçilen sorunun içinde MongoDB _id'den farklı bir 'id' varsa onu da silin)
    }));
    // onQuestionsChange(localSelectedQuestions); // Mevcut hali korundu
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Soru Seç</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Soruları Seç</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="grid gap-4 py-4">
            {questions.map((question) => (
              <div key={question._id} className="flex items-center space-x-2">
                <Checkbox
                  id={question._id}
                  checked={localSelectedQuestions.some((q) => q._id === question._id)}
                  onCheckedChange={() => handleQuestionToggle(question)}
                />
                <label htmlFor={question._id} className="text-sm font-medium">{question.questionText}</label>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleSave}>Kaydet</Button>
      </DialogContent>
    </Dialog>
  );
}
