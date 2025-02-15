"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  text: z.string().min(2, "Soru metni en az 2 karakter olmalıdır."),
  answerType: z.enum(["text", "video", "multiple_choice"]),
  duration: z.number().min(1, "Süre en az 1 saniye olmalıdır."),
  tags: z.string().transform((val) => val.split(",").map((tag) => tag.trim())),
})

type QuestionFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function QuestionForm({ onSubmit, initialData }: QuestionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      text: "",
      answerType: "text",
      duration: 60,
      tags: "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="text"
        control={control}
        render={({ field }) => (
          <div>
            <Textarea placeholder="Soru Metni" {...field} />
            {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
          </div>
        )}
      />

      <Controller
        name="answerType"
        control={control}
        render={({ field }) => (
          <div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Cevap Tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Metin</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="multiple_choice">Çoktan Seçmeli</SelectItem>
              </SelectContent>
            </Select>
            {errors.answerType && <p className="text-red-500 text-sm">{errors.answerType.message}</p>}
          </div>
        )}
      />

      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              type="number"
              placeholder="Süre (saniye)"
              {...field}
              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
          </div>
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <div>
            <Input placeholder="Etiketler (virgülle ayırın)" {...field} />
            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
          </div>
        )}
      />

      <Button type="submit">Kaydet</Button>
    </form>
  )
}

