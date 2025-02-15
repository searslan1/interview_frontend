"use client"

import type { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InterviewDetailsFormProps {
  form: UseFormReturn<any>
  isEditing: boolean
}

export function InterviewDetailsForm({ form, isEditing }: InterviewDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mülakat Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Mülakat Adı</Label>
            <Input
              id="title"
              {...form.register("title")}
              disabled={!isEditing}
              className={cn(!isEditing && "bg-muted")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              disabled={!isEditing}
              className={cn(!isEditing && "bg-muted")}
            />
          </div>

          <div className="space-y-2">
            <Label>Oluşturan</Label>
            <Input value={form.getValues("createdBy")} disabled className="bg-muted" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Yayınlanma Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.getValues("publishedAt") && "text-muted-foreground",
                      !isEditing && "bg-muted",
                    )}
                    disabled={!isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.getValues("publishedAt") ? (
                      format(form.getValues("publishedAt"), "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.getValues("publishedAt")}
                    onSelect={(date) => form.setValue("publishedAt", date)}
                    disabled={(date) => date < new Date() || date > form.getValues("expiresAt")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.getValues("expiresAt") && "text-muted-foreground",
                      !isEditing && "bg-muted",
                    )}
                    disabled={!isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.getValues("expiresAt") ? (
                      format(form.getValues("expiresAt"), "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.getValues("expiresAt")}
                    onSelect={(date) => form.setValue("expiresAt", date)}
                    disabled={(date) => date < form.getValues("publishedAt")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasPersonalityTest"
              checked={form.getValues("hasPersonalityTest")}
              onCheckedChange={(checked) => form.setValue("hasPersonalityTest", checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="hasPersonalityTest">Kişilik Envanteri Testi İçeriyor</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

