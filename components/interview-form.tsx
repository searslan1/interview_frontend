"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuestionSelector } from "@/components/question-selector"

const formSchema = z.object({
  name: z.string().min(2, "Mülakat adı en az 2 karakter olmalıdır."),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
  subject: z.string().min(1, "Konu seçimi zorunludur."),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  candidateLimit: z.number().min(1, "Aday sayısı en az 1 olmalıdır."),
  hasPersonalityTest: z.boolean(),
  questions: z.array(z.string()).min(1, "En az bir soru seçmelisiniz."),
})

type InterviewFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function InterviewForm({ onSubmit, initialData }: InterviewFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      subject: "",
      dateRange: { start: new Date(), end: new Date() },
      candidateLimit: 10,
      hasPersonalityTest: false,
      questions: [],
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <Input placeholder="Mülakat Adı" {...field} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div>
            <Textarea placeholder="Mülakat Açıklaması" {...field} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        )}
      />

      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Konu Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">Frontend Geliştirici</SelectItem>
                <SelectItem value="backend">Backend Geliştirici</SelectItem>
                <SelectItem value="fullstack">Fullstack Geliştirici</SelectItem>
                <SelectItem value="devops">DevOps Mühendisi</SelectItem>
              </SelectContent>
            </Select>
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
          </div>
        )}
      />

      <Controller
        name="dateRange"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value?.start ? (
                    field.value.end ? (
                      <>
                        {format(field.value.start, "LLL dd, y")} - {format(field.value.end, "LLL dd, y")}
                      </>
                    ) : (
                      format(field.value.start, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={field.value?.start}
                  selected={field.value}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {errors.dateRange && <p className="text-red-500 text-sm">{errors.dateRange.message}</p>}
          </div>
        )}
      />

      <Controller
        name="candidateLimit"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              type="number"
              placeholder="Aday Sayısı Limiti"
              {...field}
              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
            />
            {errors.candidateLimit && <p className="text-red-500 text-sm">{errors.candidateLimit.message}</p>}
          </div>
        )}
      />

      <Controller
        name="hasPersonalityTest"
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox id="hasPersonalityTest" checked={field.value} onCheckedChange={field.onChange} />
            <label htmlFor="hasPersonalityTest">Kişilik Envanteri Testi İçersin</label>
          </div>
        )}
      />

      <Controller
        name="questions"
        control={control}
        render={({ field }) => (
          <div>
            <QuestionSelector selectedQuestions={field.value} onQuestionsChange={field.onChange} />
            {errors.questions && <p className="text-red-500 text-sm">{errors.questions.message}</p>}
          </div>
        )}
      />

      <Button type="submit">Kaydet</Button>
    </form>
  )
}

