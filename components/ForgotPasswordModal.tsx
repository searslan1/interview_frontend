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
import { authService } from "@/services/authService";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Modal kapandığında formu sıfırla
      setEmail("");
      setMessage("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);
      setMessage(response.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Şifre sıfırlama başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Şifremi Unuttum</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="E-posta adresinizi girin"
          />
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !email.trim()} // Eğer email boşsa butonu disable et
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısını Gönder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
