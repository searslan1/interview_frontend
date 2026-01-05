"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import RegisterModal from "@/components/RegisterModal";
import LandingPageHeader from "@/components/LandingPageHeader";
import { 
  ChevronDown, 
  XCircle, 
  Video, 
  Eye, 
  Target,
  Users,
  Briefcase,
  Building2,
  Shield,
  FileCheck,
  Lock,
  Play,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import "./globals.css";

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      setIsLoginModalOpen(false);
      setIsRegisterModalOpen(false);
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleStart = () => {
    setIsLoginModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingPageHeader onStartClick={handleStart} />

      {/* ===== SECTION 1: HERO / VALUE PROPOSITION ===== */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sol: Metin Alanı */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground">Adayları </span>
                  <span className="text-muted-foreground line-through decoration-2">puanlamıyoruz</span>
                  <span className="text-foreground">.</span>
                  <br />
                  <span className="text-primary">Beklentilerinize ne kadar yaklaştıklarını</span>
                  <br />
                  <span className="text-foreground">gösteriyoruz.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  HR-AI, yapılandırılmış video mülakatlardan <strong>kanıt tabanlı analizler</strong> üretir.
                  <br />
                  <span className="text-foreground font-medium">Kararı sizin yerinize vermez — kararınızı güçlendirir.</span>
                </p>
              </div>

              {/* CTA Butonları */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Hemen Dene
                  <span className="ml-2 text-sm opacity-80">(3 soruluk demo)</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-lg px-8 py-6 rounded-lg"
                >
                  Nasıl Çalışıyor?
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Sağ: Analiz Görüntüsü */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-card rounded-2xl shadow-2xl border overflow-hidden">
                {/* Mock Analysis Screen */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Aday Analizi</p>
                      <p className="text-sm text-muted-foreground">Kanıt tabanlı gözlemler</p>
                    </div>
                  </div>
                  
                  {/* Mock Analysis Table */}
                  <div className="space-y-3">
                    {[
                      { area: "Problem Çözme", observation: "Yakın", time: "02:14" },
                      { area: "İletişim", observation: "Güçlü", time: "04:33" },
                      { area: "Ownership", observation: "Orta", time: "06:01" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{item.area}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{item.observation}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Tüm gözlemler video içeriğine dayalıdır
                  </p>
                </div>
                
                {/* Blur overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 2: AYRIŞTIRICI BLOK - "NE YAPMAZ?" ===== */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                HR-AI Ne <span className="text-destructive">Yapmaz</span>?
              </h2>
              <p className="text-muted-foreground">
                Yanlış beklentileri baştan kırmak önemli.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: XCircle,
                  title: "Uygun / Uygun Değil Demez",
                  description: "Kesin yargılar sisteme ait değildir"
                },
                {
                  icon: XCircle,
                  title: "Adayları Puanlamaz",
                  description: "Sayısal sıralama üretmez"
                },
                {
                  icon: XCircle,
                  title: "Otomatik Karar Vermez",
                  description: "Karar her zaman sizindir"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.p 
              variants={fadeInUp}
              className="text-center text-lg text-muted-foreground max-w-2xl mx-auto border-t pt-8"
            >
              Çünkü işe alım bir matematik problemi değil,{" "}
              <span className="text-foreground font-medium">kanıtlı bir değerlendirme sürecidir.</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 3: NASIL ÇALIŞIR? ===== */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
              <p className="text-muted-foreground text-lg">
                AI büyüsü değil, yapılandırılmış bir mühendislik süreci.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  icon: Video,
                  title: "Video Mülakat",
                  features: ["20-30 dk yapılandırılmış video", "Net soru akışı", "Süre ve teknik yönlendirmeler"],
                  footer: "Aday konuşur, sistem dinler."
                },
                {
                  step: 2,
                  icon: Eye,
                  title: "Analiz & Gözlem",
                  features: ["Konuşma yapısı", "Örnekleme düzeyi", "Tutarlılık ve içerik sinyalleri"],
                  footer: "Sistem çıkarım yapmaz, gözlem üretir."
                },
                {
                  step: 3,
                  icon: Target,
                  title: "Beklenti Eşleme",
                  features: ["Kullanıcı tanımlı kriterler", "Zaman damgalı kanıtlar", "Takip sorusu önerileri"],
                  footer: "Karar yine sizindir."
                }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="h-full relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                          {item.step}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      
                      <ul className="space-y-3">
                        {item.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-primary">{item.footer}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4: ÖRNEK ANALİZ EKRANI ===== */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Örnek Analiz Ekranı</h2>
              <p className="text-muted-foreground text-lg">
                "Bu AI neye dayanarak bunu söylüyor?" sorusunun cevabı.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="max-w-5xl mx-auto overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x">
                    {/* Video Player Mock */}
                    <div className="lg:col-span-2 p-6 bg-black/5 dark:bg-white/5">
                      <div className="aspect-video bg-black rounded-lg relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg" />
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                        <div className="absolute bottom-3 left-3 text-white text-sm bg-black/50 px-2 py-1 rounded">
                          06:23 / 24:15
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Mülakat kaydı - Pause edilmiş
                      </p>
                    </div>

                    {/* Analysis Table */}
                    <div className="lg:col-span-3 p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Beklenti Eşleme Tablosu
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Beklenti Alanı</th>
                              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Gözlem</th>
                              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Kanıt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { area: "Ownership", observation: "Yakın", time: "02:14", color: "text-green-600 dark:text-green-400" },
                              { area: "İletişim", observation: "Güçlü", time: "04:33", color: "text-green-600 dark:text-green-400" },
                              { area: "Belirsizlik Toleransı", observation: "Orta", time: "06:01", color: "text-yellow-600 dark:text-yellow-400" },
                              { area: "Problem Çözme", observation: "Yakın", time: "12:45", color: "text-green-600 dark:text-green-400" },
                              { area: "Takım Çalışması", observation: "Güçlü", time: "18:22", color: "text-green-600 dark:text-green-400" },
                            ].map((row, i) => (
                              <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                <td className="py-3 px-2 font-medium">{row.area}</td>
                                <td className={`py-3 px-2 ${row.color}`}>{row.observation}</td>
                                <td className="py-3 px-2">
                                  <button className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                    <Clock className="h-3 w-3" />
                                    {row.time}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Not:</strong> Tüm gözlemler video içeriğine dayalıdır ve zaman damgalıdır. 
                          Kanıt sütununa tıklayarak ilgili video anına gidebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-center text-sm text-muted-foreground">
              ⚠️ Bu ekranda skor, yüzde veya grafik bulunmaz — sadece gözlem ve kanıt.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 5: KULLANIM SENARYOLARI ===== */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Kimler İçin?</h2>
              <p className="text-muted-foreground text-lg">
                Farklı paydaşlar, ortak ihtiyaç: Kanıtlı değerlendirme.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "HR Ekipleri",
                  features: [
                    "İlk elemede kanıtlı değerlendirme",
                    "Zaman tasarrufu",
                    "Standart raporlar"
                  ],
                  highlight: "Daha az tahmin, daha çok kanıt"
                },
                {
                  icon: Briefcase,
                  title: "Hiring Manager'lar",
                  features: [
                    "Kendi beklentisine göre analiz",
                    "Takip soruları",
                    "Daha derin mülakatlar"
                  ],
                  highlight: "Beklentilerinize özel görünüm"
                },
                {
                  icon: Building2,
                  title: "Enterprise / Legal",
                  features: [
                    "Puanlama yok",
                    "Otomatik karar yok",
                    "Denetlenebilir analiz"
                  ],
                  highlight: "Uyumluluk ve şeffaflık"
                }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-7 w-7 text-primary" />
                      </div>
                      
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      
                      <ul className="space-y-3">
                        {item.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-semibold text-primary">{item.highlight}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 6: FINAL CTA + GÜVEN ===== */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Beklentilerinize yakın adayları görün.
              </h2>
              <p className="text-lg text-muted-foreground">
                Ücretsiz demo ile sistemin nasıl çalıştığını deneyimleyin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  3 Soruluk Demo Mülakata Katıl
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Kredi kartı gerekmez.
              </p>
            </motion.div>

            {/* Güven Alanı */}
            <motion.div variants={fadeInUp}>
              <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { icon: Shield, title: "KVKK / GDPR Uyumu", desc: "Veri koruma standartlarına tam uyum" },
                  { icon: Lock, title: "Veri Güvenliği", desc: "End-to-end şifreleme" },
                  { icon: FileCheck, title: "Şeffaf Analiz", desc: "Tüm sonuçlar kanıta dayalı" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Tagline */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">HR-AI</h3>
              <p className="text-sm text-muted-foreground">
                Decision Support, not Decision Making.
              </p>
            </div>

            {/* Ürün */}
            <div className="space-y-4">
              <h4 className="font-semibold">Ürün</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">Nasıl Çalışır?</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Özellikler</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Fiyatlandırma</Link></li>
              </ul>
            </div>

            {/* Şirket */}
            <div className="space-y-4">
              <h4 className="font-semibold">Şirket</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">İletişim</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Kariyer</Link></li>
              </ul>
            </div>

            {/* Etik & Metodoloji */}
            <div className="space-y-4">
              <h4 className="font-semibold">Etik & Yaklaşım</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors font-medium text-primary">Ethical AI Principles</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Methodology / Approach</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">KVKK & Gizlilik</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HR-AI. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-muted-foreground">
              İşe alım bir matematik problemi değil, kanıtlı bir değerlendirme sürecidir.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
} 
