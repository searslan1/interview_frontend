"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

interface LandingPageHeaderProps {
  onStartClick: () => void
}

const LandingPageHeader: React.FC<LandingPageHeaderProps> = ({ onStartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
          <div className="text-2xl font-bold">Mülakat Yönetim Platformu</div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:text-modern-teal transition-colors duration-300"
                >
                  Özellikler
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="hover:text-modern-teal transition-colors duration-300"
                >
                  Müşteri Görüşleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="hover:text-modern-teal transition-colors duration-300"
                >
                  SSS
                </button>
              </li>
              <li>
                <Button
                  onClick={onStartClick}
                  className={`bg-modern-teal hover:bg-modern-teal/80 text-white transition-colors duration-300 ${
                    isScrolled ? "hover:text-white" : ""
                  }`}
                >
                  Ücretsiz Dene
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

export default LandingPageHeader

