"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const router = useRouter();
  const { login, isLoading, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Modal kapanınca formu sıfırla
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setLocalError(null);
    }
  }, [isOpen]);

  // Kullanıcı giriş yaptıysa modal kapanır ve yönlendirme yapılır
  useEffect(() => {
    if (user) {
      onClose();
      router.replace("/dashboard");
    }
  }, [user, router, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifre doğrulama
    if (password.length < 6) {
      setLocalError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLocalError(null);

    try {
      await login(email, password);
    } catch (err) {
      setLocalError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giriş Yap</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="E-posta adresinizi girin"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                aria-label="Şifrenizi girin"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {(error || localError) && <p className="text-red-500">{localError || error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Yükleniyor..." : "Giriş Yap"}
            </Button>
          </form>
          <Button variant="link" onClick={onSwitchToRegister} className="w-full mt-2">
            Hesap oluştur
          </Button>
          <Button
            variant="link"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="w-full mt-2 text-blue-500"
          >
            Şifremi Unuttum
          </Button>
        </DialogContent>
      </Dialog>

      {/* Şifre sıfırlama modalı */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
};

export default AuthModal;
