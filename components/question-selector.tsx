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

  const handleQuestionToggle = (question: InterviewQuestion) => {
    setLocalSelectedQuestions((prev) =>
      prev.some((q) => q.id === question.id)
        ? prev.filter((q) => q.id !== question.id)
        : [...prev, { ...question, keywords: question.keywords ?? [] }] 
    );
  };

  const handleSave = () => {
    onQuestionsChange(localSelectedQuestions);
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
              <div key={question.id} className="flex items-center space-x-2">
                <Checkbox
                  id={question.id}
                  checked={localSelectedQuestions.some((q) => q.id === question.id)}
                  onCheckedChange={() => handleQuestionToggle(question)}
                />
                <label htmlFor={question.id} className="text-sm font-medium">{question.questionText}</label>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleSave}>Kaydet</Button>
      </DialogContent>
    </Dialog>
  );
}
