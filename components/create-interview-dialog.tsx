"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { InterviewGeneralInfo } from "./interview/InterviewGeneralInfo"
import { AIQuestionCreation } from "./interview/AIQuestionCreation"
import { EvaluationSettings } from "./interview/EvaluationSettings"
import { PublishSettings } from "./interview/PublishSettings"
import { InterviewPreview } from "./interview/InterviewPreview"

const interviewSchema = z.object({
  title: z.string().min(2, "Mülakat adı en az 2 karakter olmalıdır."),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
  type: z.enum(["technical", "softSkills", "behavioral", "personality", "video", "live"]),
  startDate: z.date(),
  endDate: z.date(),
  hasPersonalityTest: z.boolean(),
  logo: z.any().optional(),
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      type: z.enum(["text", "video", "multipleChoice"]),
      duration: z.number(),
      expectedAnswer: z.string().optional(),
      keywords: z.array(z.string()),
    }),
  ),
  aiEvaluation: z.object({
    useAutomaticScoring: z.boolean(),
    gestureAnalysis: z.boolean(),
    speechAnalysis: z.boolean(),
    eyeContactAnalysis: z.boolean(),
    tonalAnalysis: z.boolean(),
  }),
  accessSettings: z.object({
    status: z.enum(["draft", "published"]),
    visibleTo: z.array(z.string()),
    linkedPosition: z.string().optional(),
  }),
})

type InterviewFormData = z.infer<typeof interviewSchema>

interface CreateInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInterviewDialog({ open, onOpenChange }: CreateInterviewDialogProps) {
  const [activeTab, setActiveTab] = useState("general")

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "technical",
      startDate: new Date(),
      endDate: new Date(),
      hasPersonalityTest: false,
      questions: [],
      aiEvaluation: {
        useAutomaticScoring: true,
        gestureAnalysis: false,
        speechAnalysis: false,
        eyeContactAnalysis: false,
        tonalAnalysis: false,
      },
      accessSettings: {
        status: "draft",
        visibleTo: [],
      },
    },
  })

  const onSubmit = async (data: InterviewFormData) => {
    console.log("Submitting interview data:", data)
    // Here you would typically send the data to your API
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Yeni Mülakat Oluştur</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="questions">Sorular</TabsTrigger>
            <TabsTrigger value="evaluation">Değerlendirme</TabsTrigger>
            <TabsTrigger value="publish">Yayınlama</TabsTrigger>
            <TabsTrigger value="preview">Önizleme</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-auto px-4 pb-4">
            <TabsContent value="general">
              <InterviewGeneralInfo form={form} />
            </TabsContent>
            <TabsContent value="questions">
              <AIQuestionCreation form={form} />
            </TabsContent>
            <TabsContent value="evaluation">
              <EvaluationSettings form={form} />
            </TabsContent>
            <TabsContent value="publish">
              <PublishSettings form={form} />
            </TabsContent>
            <TabsContent value="preview">
              <InterviewPreview form={form} />
            </TabsContent>
          </div>
        </Tabs>
        <div className="flex justify-between space-x-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                form.handleSubmit((data) =>
                  onSubmit({ ...data, accessSettings: { ...data.accessSettings, status: "draft" } }),
                )()
              }
            >
              Taslak Olarak Kaydet
            </Button>
            <Button
              onClick={form.handleSubmit((data) =>
                onSubmit({ ...data, accessSettings: { ...data.accessSettings, status: "published" } }),
              )}
            >
              Yayınla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

