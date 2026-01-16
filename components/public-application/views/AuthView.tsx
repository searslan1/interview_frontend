"use client";

import { useState } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Mail, Phone, User } from "lucide-react";

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Türkiye telefon formatı: 5XX XXX XX XX (10 hane)
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 && cleaned.startsWith("5");
};

const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  if (cleaned.length <= 8)
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
};

interface FormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  kvkkConsent: boolean;
}

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  kvkkConsent?: string;
}

export function AuthView() {
  const { interview, isLoading, error, startAuth, setStep, setError } =
    usePublicApplicationStore();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    kvkkConsent: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation
  const validateField = (name: keyof FormData, value: any): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Ad alanı zorunludur.";
        if (value.trim().length < 2) return "Ad en az 2 karakter olmalıdır.";
        return undefined;

      case "surname":
        if (!value.trim()) return "Soyad alanı zorunludur.";
        if (value.trim().length < 2) return "Soyad en az 2 karakter olmalıdır.";
        return undefined;

      case "email":
        if (!value.trim()) return "E-posta alanı zorunludur.";
        if (!isValidEmail(value)) return "Geçerli bir e-posta adresi girin.";
        return undefined;

      case "phone":
        if (!value.trim()) return "Telefon alanı zorunludur.";
        if (!isValidPhone(value))
          return "Geçerli bir telefon numarası girin (5XX XXX XX XX).";
        return undefined;

      case "kvkkConsent":
        if (!value) return "Devam etmek için KVKK metnini onaylamalısınız.";
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Handlers
  const handleChange = (name: keyof FormData, value: any) => {
    let processedValue = value;

    // Telefon formatla
    if (name === "phone") {
      processedValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Touched ise validate et
    if (touched[name]) {
      const error = validateField(name, processedValue);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Tüm alanları touched yap
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate
    if (!validateForm()) return;

    // Phone'u temizle (sadece rakamlar)
    const cleanedPhone = formData.phone.replace(/\D/g, "");

    try {
      await startAuth({
        interviewId: interview?.interviewId || "",
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanedPhone,
        kvkkConsent: formData.kvkkConsent,
      });
    } catch {
      // Error store'da set edildi
    }
  };

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
            Mülakata başlamak için bilgilerinizi girin. Telefonunuza doğrulama
            kodu gönderilecektir.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* API Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Ad Soyad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  <User className="h-3 w-3" /> Ad
                </Label>
                <Input
                  id="name"
                  placeholder="Adınız"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Soyad</Label>
                <Input
                  id="surname"
                  placeholder="Soyadınız"
                  value={formData.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  onBlur={() => handleBlur("surname")}
                  className={formErrors.surname ? "border-destructive" : ""}
                />
                {formErrors.surname && (
                  <p className="text-xs text-destructive">
                    {formErrors.surname}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> E-posta
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> Telefon
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
                  +90
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="555 123 45 67"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`rounded-l-none ${formErrors.phone ? "border-destructive" : ""}`}
                  maxLength={14} // Formatted: XXX XXX XX XX
                />
              </div>
              {formErrors.phone && (
                <p className="text-xs text-destructive">{formErrors.phone}</p>
              )}
            </div>

            {/* KVKK */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="kvkk"
                checked={formData.kvkkConsent}
                onCheckedChange={(checked) =>
                  handleChange("kvkkConsent", checked as boolean)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="kvkk"
                  className={`text-sm font-medium leading-none cursor-pointer ${
                    formErrors.kvkkConsent ? "text-destructive" : ""
                  }`}
                >
                  Aydınlatma Metni'ni okudum ve onaylıyorum.
                </label>
                <p className="text-xs text-muted-foreground">
                  Kişisel verileriniz KVKK kapsamında işlenmektedir.
                </p>
                {formErrors.kvkkConsent && (
                  <p className="text-xs text-destructive">
                    {formErrors.kvkkConsent}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Devam Et
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
