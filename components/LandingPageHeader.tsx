"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Play } from "lucide-react"

interface LandingPageHeaderProps {
  onStartClick: () => void
}

const LandingPageHeader: React.FC<LandingPageHeaderProps> = ({ onStartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Scroll event listener'ını optimize et
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Navigasyon linkleri - maksimum 4, etik odaklı
  const navLinks = [
    { id: "how-it-works", label: "Nasıl Çalışır?" },
    { id: "use-cases", label: "Kullanım Alanları" },
    { id: "methodology", label: "Yaklaşım" },
    { id: "contact", label: "İletişim" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Sol */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HR</span>
              </div>
              <span className={`text-xl font-semibold transition-colors ${
                isScrolled ? "text-foreground" : "text-foreground"
              }`}>
                HR-AI
              </span>
            </a>

            {/* Navigasyon - Orta (Desktop) */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        isScrolled ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA - Sağ (Desktop) */}
            <div className="hidden md:block">
              <Button
                onClick={onStartClick}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Play className="h-4 w-4" />
                Hemen Dene
              </Button>
            </div>

            {/* Mobil Menü Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? "text-foreground hover:bg-muted" 
                  : "text-foreground hover:bg-white/10"
              }`}
              aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobil Menü Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-16 right-0 bottom-0 w-full max-w-sm bg-background border-l shadow-xl"
            >
              <nav className="p-6">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onStartClick()
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    size="lg"
                  >
                    <Play className="h-5 w-5" />
                    Hemen Dene
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    3 soruluk ücretsiz demo
                  </p>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LandingPageHeader
