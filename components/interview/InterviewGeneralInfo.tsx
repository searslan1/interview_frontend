"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";
import { Briefcase, Building2, BarChart3 } from "lucide-react";

interface InterviewGeneralInfoProps {
  form: UseFormReturn<any>;
}

// Mülakat tipi kaldırıldı - kullanılmıyor

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

  // Yetkinlik ağırlıklarını al
  const competencyWeights = form.watch("position.competencyWeights") || {
    technical: 40,
    communication: 30,
    problem_solving: 30,
  };

  // Ağırlık güncelleme fonksiyonu
  const updateCompetencyWeight = (field: string, value: number) => {
    form.setValue(`position.competencyWeights.${field}`, value);
  };

  return (
    <div className="space-y-6">
      {/* Temel Bilgiler Kartı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Temel Bilgiler
          </CardTitle>
          <CardDescription>Mülakatın temel bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mülakat Başlığı */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">
                Mülakat Başlığı <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="title" 
                placeholder="Örn: Senior Frontend Developer Mülakatı"
                {...form.register("title")} 
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message as string}</p>
              )}
            </div>

            {/* Mülakat Açıklaması */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Mülakat Açıklaması</Label>
              <Textarea 
                id="description" 
                placeholder="Mülakat hakkında kısa bir açıklama yazın..."
                rows={3}
                {...form.register("description")} 
              />
            </div>

            {/* Bitiş Tarihi */}
            <div className="space-y-2">
              <Controller
                name="expirationDate"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="expirationDate">
                      Son Başvuru Tarihi <span className="text-destructive">*</span>
                    </Label>
                    <DatePicker
                      id="expirationDate"
                      date={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                    />
                    {form.formState.errors.expirationDate && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.expirationDate.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pozisyon Bilgileri Kartı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Pozisyon Bilgileri
          </CardTitle>
          <CardDescription>AI analizi için pozisyon detaylarını belirtin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pozisyon Adı */}
            <div className="space-y-2">
              <Label htmlFor="position.title">
                Pozisyon Adı <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="position.title" 
                placeholder="Örn: Senior Frontend Developer"
                {...form.register("position.title")} 
              />
              {(form.formState.errors.position as any)?.title && (
                <p className="text-sm text-destructive">{(form.formState.errors.position as any).title.message}</p>
              )}
            </div>

            {/* Departman */}
            <div className="space-y-2">
              <Label htmlFor="position.department">Departman</Label>
              <Controller
                name="position.department"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Departman seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Mühendislik</SelectItem>
                      <SelectItem value="product">Ürün</SelectItem>
                      <SelectItem value="design">Tasarım</SelectItem>
                      <SelectItem value="marketing">Pazarlama</SelectItem>
                      <SelectItem value="sales">Satış</SelectItem>
                      <SelectItem value="hr">İnsan Kaynakları</SelectItem>
                      <SelectItem value="finance">Finans</SelectItem>
                      <SelectItem value="operations">Operasyon</SelectItem>
                      <SelectItem value="other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Pozisyon Açıklaması */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="position.description">Pozisyon Açıklaması</Label>
              <Textarea 
                id="position.description" 
                placeholder="Pozisyon gereksinimleri ve beklentiler..."
                rows={3}
                {...form.register("position.description")} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yetkinlik Ağırlıkları Kartı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Değerlendirme Ağırlıkları
          </CardTitle>
          <CardDescription>AI analiz sonuçlarında hangi yetkinliklere ne kadar ağırlık verileceğini belirleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Teknik Yetkinlik */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Teknik Yetkinlik</Label>
              <Badge variant="outline">{competencyWeights.technical || 40}%</Badge>
            </div>
            <Slider
              value={[competencyWeights.technical || 40]}
              onValueChange={(value) => updateCompetencyWeight("technical", value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Teknik bilgi, problem çözme ve kodlama becerileri
            </p>
          </div>

          <Separator />

          {/* İletişim Yetkinliği */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>İletişim Yetkinliği</Label>
              <Badge variant="outline">{competencyWeights.communication || 30}%</Badge>
            </div>
            <Slider
              value={[competencyWeights.communication || 30]}
              onValueChange={(value) => updateCompetencyWeight("communication", value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Sözlü ve yazılı iletişim, sunum becerileri
            </p>
          </div>

          <Separator />

          {/* Problem Çözme */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Problem Çözme</Label>
              <Badge variant="outline">{competencyWeights.problem_solving || 30}%</Badge>
            </div>
            <Slider
              value={[competencyWeights.problem_solving || 30]}
              onValueChange={(value) => updateCompetencyWeight("problem_solving", value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Analitik düşünme, yaratıcı çözümler üretme
            </p>
          </div>

          {/* Toplam Ağırlık Uyarısı */}
          {(competencyWeights.technical + competencyWeights.communication + competencyWeights.problem_solving) !== 100 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Toplam ağırlık: {competencyWeights.technical + competencyWeights.communication + competencyWeights.problem_solving}% 
                (Önerilen: 100%)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ek Ayarlar Kartı */}
      <Card>
        <CardHeader>
          <CardTitle>Ek Ayarlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Kişilik Testi */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hasPersonalityTest">Kişilik Envanteri</Label>
              <p className="text-sm text-muted-foreground">
                Adaylardan kişilik testi tamamlamalarını isteyin
              </p>
            </div>
            <Switch
              id="hasPersonalityTest"
              checked={form.watch("stages.personalityTest")}
              onCheckedChange={(checked) => form.setValue("stages.personalityTest", checked)}
            />
          </div>

          {/* Kişilik Testi ID */}
          {form.watch("stages.personalityTest") && (
            <div className="space-y-2 pl-4 border-l-2 border-primary">
              <Label htmlFor="personalityTestId">Kişilik Testi ID</Label>
              <Input 
                id="personalityTestId" 
                placeholder="Kişilik testi ID'sini girin"
                {...form.register("personalityTestId")} 
              />
            </div>
          )}

          <Separator />

          {/* Mülakat Görseli */}
          <div className="space-y-2">
            <Label htmlFor="logo">Mülakat Görseli / Logo</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="logo" 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="flex-1" 
              />
              {logoPreview && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                  <Image 
                    src={logoPreview} 
                    alt="Logo preview" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}