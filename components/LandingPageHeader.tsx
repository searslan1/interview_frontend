"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface LandingPageHeaderProps {
  onStartClick: () => void
}

const LandingPageHeader: React.FC<LandingPageHeaderProps> = ({ onStartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll event listener'ını optimize et
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-sm shadow-lg text-gray-800" : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold">Mülakat Yönetim Platformu</div>

          {/* Navigasyon */}
          <nav>
            <ul className="hidden md:flex space-x-6">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:text-modern-teal transition-colors duration-300"
                  aria-label="Özellikler"
                >
                  Özellikler
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="hover:text-modern-teal transition-colors duration-300"
                  aria-label="Müşteri Görüşleri"
                >
                  Müşteri Görüşleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="hover:text-modern-teal transition-colors duration-300"
                  aria-label="Sıkça Sorulan Sorular"
                >
                  SSS
                </button>
              </li>
              <li>
                <Button
                  onClick={onStartClick}
                  className="bg-modern-teal hover:bg-modern-teal/80 text-white transition-colors duration-300"
                  aria-label="Ücretsiz Dene"
                >
                  Ücretsiz Dene
                </Button>
              </li>
            </ul>
          </nav>

          {/* Mobil Menü */}
          <div className="md:hidden">
            <button
              onClick={() => scrollToSection("features")}
              className="p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Menüyü Aç"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default LandingPageHeader
