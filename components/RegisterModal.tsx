"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getPasswordValidationError } from "@/utils/validationSchemas"; // Varsayım

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  //onRegisterSuccess: () => void;

}



const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { register, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Şifre doğrulama: Yeni güçlü şifre kuralı uygulanıyor
    const validationError = getPasswordValidationError(password);

    if (validationError) {
      alert(validationError); // Ya da alert yerine state'e kaydedip gösterin
      return;
    }

    const success = await register({ name, email, password, phone: phone || undefined });

   if (success) {
      // ✅ DÜZELTME: Başarılı mesajı göster ve otomatik login yerine login ekranına yönlendir
      setSuccessMessage(
        "Kayıt başarılı! Lütfen e-postanızı kontrol edip hesabınızı doğrulayın."
      );
      
      // 3 saniye sonra otomatik olarak giriş ekranına geçiş yap
      setTimeout(() => {
        onSwitchToLogin();
        setSuccessMessage(null); // Mesajı temizle
        onClose(); // Modalı kapat (isteğe bağlı)
      }, 3000); 

    }
    // Hata durumunda useAuth'dan gelen error zaten gösteriliyor
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kayıt Ol</DialogTitle>
        </DialogHeader>
        {successMessage ? (
          <p className="text-green-500 text-center">{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Adınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-2 text-gray-500 h-6 w-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Telefon (opsiyonel)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Yükleniyor..." : "Kayıt Ol"}
            </Button>
          </form>
        )}
        <Button variant="link" onClick={onSwitchToLogin} className="w-full mt-2">
          Giriş yap
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
