"use client";

import { Controller, UseFormReturn } from "react-hook-form"; // Controller import edildi
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import Image from "next/image";


interface InterviewGeneralInfoProps {
  form: UseFormReturn<any>;
}

export function InterviewGeneralInfo({ form }: InterviewGeneralInfoProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        form.setValue("logo", file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mülakat Genel Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mülakat Başlığı */}
        <div>
          <Label htmlFor="title">Mülakat Başlığı</Label>
          <Input id="title" {...form.register("title")} />
        </div>

        {/* Mülakat Açıklaması */}
        <div>
          <Label htmlFor="description">Mülakat Açıklaması</Label>
          <Textarea id="description" {...form.register("description")} />
        </div>

        {/* Tarihler (Başlangıç / Bitiş) */}
        <div className="flex space-x-4">
          <Controller
            name="expirationDate" // Form state'indeki alan adı
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="expirationDate">Bitiş Tarihi</Label>
                <DatePicker
                  id="expirationDate"
                  // RHF'den gelen ISO string'i Date objesine çeviriyoruz.
                  date={field.value ? new Date(field.value) : undefined}
                  
                  // DatePicker'dan gelen Date objesini, RHF'ye yazmadan önce ISO String'e çeviriyoruz.
                  onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                />
              </div>
            )}
          />
        </div>

        {/* Kişilik Testi */}
        <div className="flex items-center space-x-2">
          <Switch
            id="hasPersonalityTest"
            checked={form.getValues("stages.personalityTest")}
            onCheckedChange={(checked) => form.setValue("stages.personalityTest", checked)}
          />
          <Label htmlFor="hasPersonalityTest">Kişilik Envanteri İçersin</Label>
        </div>

        {/* Kişilik Testi ID (Opsiyonel) */}
        {form.getValues("stages.personalityTest") && (
          <div>
            <Label htmlFor="personalityTestId">Kişilik Testi ID</Label>
            <Input id="personalityTestId" {...form.register("personalityTestId")} />
          </div>
        )}

        {/* Mülakat Görseli / Logo */}
        <div>
          <Label htmlFor="logo">Mülakat Görseli / Logo</Label>
          <div className="mt-2 flex items-center space-x-4">
            <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="w-full" />
            {logoPreview && (
              <div className="relative w-16 h-16">
                <Image src={logoPreview || "/placeholder.svg"} alt="Logo preview" layout="fill" objectFit="cover" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}