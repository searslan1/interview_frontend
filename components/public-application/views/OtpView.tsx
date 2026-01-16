"use client";

import { useState, useRef, useEffect } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Phone, RefreshCw } from "lucide-react";

export function OtpView() {
  const {
    pendingAuth,
    isLoading,
    error,
    verifyOtp,
    resendOtp,
    setStep,
    setError,
  } = usePublicApplicationStore();

  // OTP input state (6 haneli)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Session kontrolü
  if (!pendingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Oturum Hatası</CardTitle>
            <CardDescription>
              Doğrulama bilgileri bulunamadı. Lütfen tekrar başlayın.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => setStep("auth")}>Giriş Sayfasına Dön</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Telefon numarasını maskele
  const maskedPhone = pendingAuth.phone.replace(
    /(\d{3})(\d{3})(\d{2})(\d{2})/,
    "$1 *** ** $4"
  );

  // Input handlers
  const handleChange = (index: number, value: string) => {
    // Sadece rakam kabul et
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Sadece son karakter
    setOtp(newOtp);

    // Sonraki input'a geç
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Tüm haneler doluysa otomatik submit
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace ile önceki input'a geç
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) return;

    setError(null);
    try {
      await verifyOtp(otpCode);
    } catch {
      // Error store'da set edildi
      // Input'ları temizle
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    await resendOtp();
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] fade-in animate-in slide-in-from-right-8">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center">
          {/* Geri butonu */}
          <Button
            variant="ghost"
            className="absolute left-4 top-4 p-2"
            onClick={() => setStep("auth")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Doğrulama Kodu</CardTitle>
          <CardDescription>
            <strong>{maskedPhone}</strong> numarasına gönderilen 6 haneli kodu
            girin.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* OTP Input */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-mono"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Countdown / Resend */}
          <div className="text-center text-sm text-muted-foreground">
            {canResend ? (
              <Button
                variant="link"
                onClick={handleResend}
                disabled={isLoading}
                className="text-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Kodu Tekrar Gönder
              </Button>
            ) : (
              <span>
                Kod gelmedi mi?{" "}
                <span className="font-medium">{countdown}</span> saniye sonra
                tekrar gönderebilirsiniz.
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={() => handleSubmit()}
            disabled={isLoading || otp.some((d) => !d)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Doğrula ve Başla
          </Button>

          <Button
            variant="link"
            size="sm"
            onClick={() => setStep("auth")}
            className="text-muted-foreground"
          >
            Farklı numara ile giriş yap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
