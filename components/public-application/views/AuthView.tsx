"use client";

import { useState } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore"; // Store import yoluna dikkat edin
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Phone } from "lucide-react";
import { StartApplicationDTO } from "@/services/publicApplicationService";

export function AuthView() {
  const { 
    interview, 
    startSession, 
    verifySession, 
    isLoading, 
    error, 
    setStep,
    setError,
    tempApplicationId // ✅ Store'dan geçici ID'yi çekiyoruz
  } = usePublicApplicationStore();

  // Local State: Hangi aşamadayız? (form | otp)
  const [authStage, setAuthStage] = useState<"form" | "otp">("form");
  
  // Form State
  const [formData, setFormData] = useState<StartApplicationDTO>({
    interviewId: interview?.interviewId || "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    kvkkConsent: false,
  });

  // OTP State
  const [otpCode, setOtpCode] = useState("");

  // --- HANDLERS ---

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kvkkConsent) {
      setError("Devam etmek için KVKK metnini onaylamalısınız.");
      return;
    }
    
    try {
      await startSession(formData);
      setAuthStage("otp"); 
    } catch (err) {
      // Hata store tarafından yönetiliyor
    }
  };

  const handleOtpSubmit = async () => {
    if (otpCode.length < 6) return;

    // ✅ DÜZELTME BURADA:
    // Store'daki tempApplicationId'yi kullanıyoruz.
    // Eğer store'da yoksa (sayfa yenilendiyse vs.) hata gösteriyoruz.
    
    if (!tempApplicationId) {
        setError("Oturum süresi dolmuş olabilir. Lütfen sayfayı yenileyip tekrar deneyin.");
        return;
    }
    
    try {
        // Store logic'ine göre applicationId opsiyonel olabilir ama 
        // garanti olması için buradan gönderiyoruz.
        await verifySession({ 
            applicationId: tempApplicationId, 
            otpCode 
        });
        
        // Başarılı olursa Store otomatik olarak setStep yapacak,
        // burada ekstra bir şey yapmaya gerek yok.
    } catch (error) {
        console.error("OTP Error:", error);
    }
  };

  // Render Form
  if (authStage === "form") {
    return (
      <div className="flex justify-center items-center min-h-[60vh] fade-in animate-in slide-in-from-bottom-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <Button 
              variant="ghost" 
              className="w-fit pl-0 mb-2 hover:bg-transparent hover:text-primary"
              onClick={() => setStep("landing")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
            </Button>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Mülakata başlamak için bilgilerinizi girin. Telefonunuza doğrulama kodu gönderilecektir.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="Adınız"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input 
                    id="surname" 
                    required 
                    placeholder="Soyadınız"
                    value={formData.surname}
                    onChange={(e) => setFormData({...formData, surname: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  placeholder="555 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="kvkk" 
                  checked={formData.kvkkConsent}
                  onCheckedChange={(c) => setFormData({...formData, kvkkConsent: c as boolean})}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="kvkk"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aydınlatma Metni'ni okudum ve onaylıyorum.
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Kişisel verileriniz KVKK kapsamında işlenmektedir.
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Devam Et"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Render OTP
  return (
    <div className="flex justify-center items-center min-h-[60vh] fade-in animate-in slide-in-from-right-8">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Doğrulama Kodu</CardTitle>
          <CardDescription>
            <strong>{formData.phone}</strong> numarasına gönderilen 6 haneli kodu girin.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
           {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="flex justify-center mb-6">
                <Input 
                    className="text-center text-2xl tracking-widest w-48 h-12 font-mono"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleOtpSubmit();
                    }}
                />
            </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            onClick={handleOtpSubmit} // ✅ Artık inline fonksiyon değil, düzeltilmiş handler çağrılıyor
            disabled={isLoading || otpCode.length < 6}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Doğrula ve Başla"}
          </Button>
          
          <Button variant="link" size="sm" onClick={() => setAuthStage("form")}>
            Numarayı Düzenle
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}