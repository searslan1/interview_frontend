"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { QuestionSelector } from "@/components/question-selector"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Mülakat adı en az 2 karakter olmalıdır.",
  }),
  description: z.string().min(10, {
    message: "Mülakat açıklaması en az 10 karakter olmalıdır.",
  }),
  subject: z.string({
    required_error: "Lütfen bir mülakat konusu seçin.",
  }),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  hasPersonalityTest: z.boolean().default(false),
  questions: z.array(z.string()).min(1, {
    message: "En az bir soru seçmelisiniz.",
  }),
})

export default function AddInterviewForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      hasPersonalityTest: false,
      questions: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Burada form verilerini API'ye gönderebilirsiniz
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Yeni Mülakat Ekle</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
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
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mülakat Konusu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Mülakat konusu seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Geliştirici</SelectItem>
                    <SelectItem value="backend">Backend Geliştirici</SelectItem>
                    <SelectItem value="fullstack">Fullstack Geliştirici</SelectItem>
                    <SelectItem value="devops">DevOps Mühendisi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Başvuru Tarihi Aralığı</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Tarih aralığı seçin</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasPersonalityTest"
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
                  <QuestionSelector selectedQuestions={field.value} onQuestionsChange={field.onChange} />
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
  )
}

