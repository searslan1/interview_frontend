"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { QuestionSelector } from "@/components/interview/question-selector";
import { useInterviewStore } from "@/store/interviewStore";
import { useAuthStore } from "@/store/authStore"; // Kullanıcı kimliği için

// ✅ Schema güncellendi, interview tipine daha uygun hale getirildi.
const formSchema = z.object({
  title: z.string().min(2, { message: "Mülakat adı en az 2 karakter olmalıdır." }),
  description: z.string().min(10, { message: "Mülakat açıklaması en az 10 karakter olmalıdır." }),
  expirationDate: z.date().refine((date) => date > new Date(), {
    message: "Son başvuru tarihi geçmiş bir tarih olamaz.",
  }),
  stages: z.object({
    personalityTest: z.boolean().default(false),
    questionnaire: z.boolean().default(true),
  }),
  questions: z.array(
    z.object({
      //id: z.string(),
      questionText: z.string(),
      expectedAnswer: z.string(),
      order: z.number(),
      duration: z.number(),
      keywords: z.array(z.string()).optional(),
      aiMetadata: z.object({
        complexityLevel: z.enum(["low", "medium", "high"]),
        requiredSkills: z.array(z.string()),
      }),
    })
  ).min(1, { message: "En az bir soru seçmelisiniz." }),
});

export default function AddInterviewForm() {
  const { createInterview } = useInterviewStore();
  const { user } = useAuthStore(); // ✅ Kullanıcı kimliği için auth store
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      expirationDate: new Date(),
      stages: { personalityTest: false, questionnaire: true },
      questions: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !user._id) {
      alert("Giriş yapmalısınız.");
      return;
    }

   const payload = {
      title: values.title,
      description: values.description,
      expirationDate: values.expirationDate, // Servis katmanında ISO'ya çevriliyor
      stages: values.stages,
      // keywords: null geliyorsa boş array ata
      questions: values.questions.map((q) => ({
        ...q,
        keywords: q.keywords ?? [], 
      })),
      // personalityTestId: undefined (Zod'da tanımlanmadıysa)
    };

   try {
      await createInterview(payload); // 🚨 Düzeltme: Yalnızca DTO gönderildi

      alert("Mülakat başarıyla oluşturuldu.");
      // Formu sıfırla veya yönlendir
    } catch (error) {
      // Hata mesajını backend'den alıp göstermek gerekiyor (Bkz: Hata Yakalama)
      console.error("Mülakat oluşturulurken hata:", error);
      alert("Bir hata oluştu.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Yeni Mülakat Ekle</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mülakat Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Mülakat adını girin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mülakat Açıklaması</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mülakat açıklamasını girin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Son Başvuru Tarihi</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-[300px] justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "LLL dd, y") : <span>Tarih seçin</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stages.personalityTest"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Kişilik Envanteri Testi</FormLabel>
                  <FormDescription>Bu mülakat için kişilik envanteri testi eklemek istiyor musunuz?</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sorular</FormLabel>
                <FormControl>
                  <QuestionSelector
                    selectedQuestions={form.watch("questions").map((q) => ({ ...q, keywords: q.keywords ?? [] }))}
                    onQuestionsChange={(updatedQuestions) => form.setValue("questions", updatedQuestions)}
                  />
                </FormControl>
                <FormDescription>Mülakat için sorular seçin.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Mülakatı Kaydet</Button>
        </form>
      </Form>
    </div>
  );
}
