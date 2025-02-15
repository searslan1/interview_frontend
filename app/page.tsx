"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import LandingPageHeader from "@/components/LandingPageHeader";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuthStore();

  // ✅ HATA: currentSlide Tanımlanmamış
  // 🔥 ÇÖZÜM: currentSlide state'ini tanımlıyoruz
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); // Kullanıcı giriş yaptıysa yönlendir
    }
  }, [user, router]);

  const handleStart = () => {
    setIsAuthModalOpen(true);
  };

  const slides = [
    {
      image: "/hero-1.jpg",
      title: "Mülakat Süreçlerinizi Dönüştürün",
      description: "Yapay zeka destekli mülakat yönetimi ile işe alım süreçlerinizi optimize edin",
    },
    {
      image: "/hero-2.jpg",
      title: "Adayları Daha İyi Değerlendirin",
      description: "Kapsamlı analizler ve raporlarla en iyi yetenekleri keşfedin",
    },
    {
      image: "/hero-3.jpg",
      title: "Verimli İşe Alım Süreci",
      description: "Zaman ve kaynaklarınızı etkin kullanarak doğru adayları bulun",
    },
  ];

  // ✅ HATA: setCurrentSlide Tanımlanmamış
  // 🔥 ÇÖZÜM: `setCurrentSlide` çağrısı için prevSlide'in tipini number olarak belirtiyoruz
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide: number) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-primary text-white">
      <LandingPageHeader onStartClick={handleStart} />

      {/* Hero Section */}
      <section className="relative h-screen">
        <AnimatePresence>
          {slides.map(
            (slide, index) =>
              index === currentSlide && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <Image src={slide.image || "/placeholder.svg"} alt={slide.title} layout="fill" objectFit="cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center max-w-4xl px-4">
                      <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-bold mb-4"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl mb-8"
                      >
                        {slide.description}
                      </motion.p>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                        <Button
                          onClick={handleStart}
                          className="bg-modern-teal hover:bg-modern-teal/80 text-white text-lg py-2 px-6 rounded-full transition-colors duration-300"
                        >
                          Hemen Başlayın
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="animate-bounce w-8 h-8" />
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
