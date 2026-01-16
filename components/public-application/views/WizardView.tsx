"use client";

import { useState, useEffect } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import publicApplicationService from "@/services/publicApplicationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, UploadCloud, FileText, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Shadcn toast hook'u

// --- MAIN COMPONENT ---

export function WizardView({ step }: { step: "wizard-profile" | "wizard-docs" }) {
  const { 
    application, 
    updateProfile, 
    setStep, 
    completeWizard 
  } = usePublicApplicationStore();
  
  // Eğer application henüz yüklenmediyse
  if (!application) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in animate-in slide-in-from-bottom-4">
      
      {/* Üst Bilgi / Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {step === "wizard-profile" ? "Profil Bilgileri" : "Belgeler & Ekler"}
          </h2>
          <p className="text-muted-foreground">
            {step === "wizard-profile" 
              ? "Eğitim ve deneyim geçmişinizden bahsedin." 
              : "CV'nizi ve varsa sertifikalarınızı yükleyin."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className={step === "wizard-profile" ? "text-primary font-bold" : "text-primary"}>1. Profil</span>
          <ArrowRight className="h-4 w-4" />
          <span className={step === "wizard-docs" ? "text-primary font-bold" : ""}>2. Belgeler</span>
        </div>
      </div>

      <Separator />

      {/* İçerik Alanı */}
      {step === "wizard-profile" ? (
        <ProfileForm 
          initialData={application} 
          onSave={async (data) => {
            await updateProfile("education", data.education);
            await updateProfile("experience", data.experience);
            await updateProfile("skills", data.skills);
            setStep("wizard-docs"); // Sonraki adıma geç
          }} 
        />
      ) : (
        <DocumentsForm 
          initialData={application}
          onBack={() => setStep("wizard-profile")}
          onComplete={async (data) => {
             await updateProfile("documents", data);
             completeWizard(); // Wizard bitti, System Check'e gönder
          }}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENT: PROFILE FORM (Eğitim/Deneyim/Yetenek) ---

function ProfileForm({ initialData, onSave }: { initialData: any, onSave: (data: any) => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  
  // Local State (Form verileri)
  const [education, setEducation] = useState<any[]>(initialData.education || []);
  const [experience, setExperience] = useState<any[]>(initialData.experience || []);
  const [skills, setSkills] = useState(initialData.skills?.technical?.join(", ") || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Skills string'ini array'e çevir
      const skillsArray = skills.split(",").map((s: string) => s.trim()).filter(Boolean);
      
      await onSave({
        education,
        experience,
        skills: { technical: skillsArray }
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper: Eğitim Ekle/Çıkar
  const addEducation = () => setEducation([...education, { school: "", degree: "", graduationYear: "" }]);
  const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));
  const updateEducation = (index: number, field: string, value: any) => {
    const newEd = [...education];
    newEd[index] = { ...newEd[index], [field]: value };
    setEducation(newEd);
  };

  // Helper: Deneyim Ekle/Çıkar
  const addExperience = () => setExperience([...experience, { company: "", position: "", duration: "", responsibilities: "" }]);
  const removeExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));
  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setExperience(newExp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* EĞİTİM BÖLÜMÜ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Eğitim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((item, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-3 items-end border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-2 md:col-span-1">
                <Label>Okul / Üniversite</Label>
                <Input 
                  value={item.school} 
                  onChange={(e) => updateEducation(index, "school", e.target.value)} 
                  placeholder="Üniversite Adı" 
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label>Bölüm / Derece</Label>
                <Input 
                  value={item.degree} 
                  onChange={(e) => updateEducation(index, "degree", e.target.value)} 
                  placeholder="Lisans - Bilg. Müh." 
                  required
                />
              </div>
              <div className="flex gap-2 md:col-span-1">
                <div className="space-y-2 flex-1">
                  <Label>Mezuniyet Yılı</Label>
                  <Input 
                    type="number"
                    value={item.graduationYear} 
                    onChange={(e) => updateEducation(index, "graduationYear", e.target.value)} 
                    placeholder="2023" 
                    required
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" className="mb-0.5 text-destructive" onClick={() => removeEducation(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addEducation} className="w-full border-dashed">
            <Plus className="h-4 w-4 mr-2" /> Eğitim Ekle
          </Button>
        </CardContent>
      </Card>

      {/* DENEYİM BÖLÜMÜ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">İş Deneyimi</CardTitle>
          <CardDescription>Son iş deneyimlerinizden bahsedin (Opsiyonel).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {experience.map((item, index) => (
            <div key={index} className="space-y-4 border p-4 rounded-lg bg-muted/20 relative">
              <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-muted-foreground hover:text-destructive" onClick={() => removeExperience(index)}>
                  <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Şirket Adı</Label>
                  <Input 
                    value={item.company} 
                    onChange={(e) => updateExperience(index, "company", e.target.value)} 
                    placeholder="Şirket A.Ş." 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pozisyon</Label>
                  <Input 
                    value={item.position} 
                    onChange={(e) => updateExperience(index, "position", e.target.value)} 
                    placeholder="Frontend Developer" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Süre / Tarihler</Label>
                <Input 
                  value={item.duration} 
                  onChange={(e) => updateExperience(index, "duration", e.target.value)} 
                  placeholder="Örn: 2 Yıl veya 2020-2022" 
                />
              </div>

              <div className="space-y-2">
                <Label>Sorumluluklar / Açıklama</Label>
                <Textarea 
                  value={item.responsibilities} 
                  onChange={(e) => updateExperience(index, "responsibilities", e.target.value)} 
                  placeholder="Neler yaptınız?" 
                  rows={2}
                />
              </div>
            </div>
          ))}
           <Button type="button" variant="outline" size="sm" onClick={addExperience} className="w-full border-dashed">
            <Plus className="h-4 w-4 mr-2" /> Deneyim Ekle
          </Button>
        </CardContent>
      </Card>

      {/* YETENEKLER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Yetenekler</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
             <Label>Teknik Yetenekler (Virgülle ayırın)</Label>
             <Textarea 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, TypeScript, SQL..."
             />
             <p className="text-xs text-muted-foreground">
               Örnek: Photoshop, Excel, İletişim, Takım Çalışması
             </p>
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Kaydet ve İlerle
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// --- SUB-COMPONENT: DOCUMENTS FORM (Dosya Yükleme) ---

function DocumentsForm({ initialData, onBack, onComplete }: { initialData: any, onBack: () => void, onComplete: (data: any) => Promise<void> }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>(initialData.documents?.resume || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        toast({ title: "Hata", description: "Dosya boyutu 5MB'dan küçük olmalıdır.", variant: "destructive" });
        return;
    }

    setIsUploading(true);
    try {
        const { url, fileKey } = await publicApplicationService.uploadFile(file, 'cv');
        // Not: Gerçek S3 entegrasyonu varsa fileKey kaydedilir, mock ise url kullanılır.
        // Public Application servisinde mock URL dönüyoruz, onu state'e atalım.
        setResumeUrl(url); 
        toast({ title: "Başarılı", description: "CV yüklendi.", className: "bg-green-600 text-white" });
    } catch (error) {
        console.error(error);
        toast({ title: "Hata", description: "Dosya yüklenirken hata oluştu.", variant: "destructive" });
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!resumeUrl) {
         toast({ title: "Uyarı", description: "Lütfen devam etmeden önce CV'nizi yükleyin.", variant: "default" });
         return;
    }

    setLoading(true);
    try {
        await onComplete({
            resume: resumeUrl,
            // certificates: [], // Sertifika ekleme özelliği V2'de eklenebilir
            // socialMediaLinks: []
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Özgeçmiş (CV)</CardTitle>
          <CardDescription>PDF formatında güncel özgeçmişinizi yükleyin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors relative">
            <input 
                type="file" 
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : resumeUrl ? (
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                ) : (
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                )}
                
                <div className="text-sm font-medium">
                    {isUploading ? "Yükleniyor..." : resumeUrl ? "Dosya Yüklendi" : "Dosya Seç veya Sürükle"}
                </div>
                <div className="text-xs text-muted-foreground">Maksimum 5MB (PDF)</div>
            </div>
          </div>

          {/* Preview / Status */}
          {resumeUrl && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md border">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1 text-sm truncate text-muted-foreground">
                    Yüklenen CV
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Hazır
                </Badge>
            </div>
          )}

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="text-base text-muted-foreground">Ekler (Opsiyonel)</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground italic">
             Sertifika ve portfolyo yükleme alanı yakında eklenecektir. Şimdilik sadece CV yüklemeniz yeterlidir.
           </p>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
        </Button>
        <Button onClick={handleSubmit} size="lg" disabled={loading || isUploading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Başvuruyu Tamamla
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}