"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X } from "lucide-react"

interface ChatAssistantProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function ChatAssistant({ isOpen, onOpenChange }: ChatAssistantProps) {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }])
      setInput("")
      // Simüle edilmiş AI yanıtı
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Anladım. Size nasıl yardımcı olabilirim?", isUser: false },
        ])
      }, 1000)
    }
  }

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full p-4" onClick={() => onOpenChange(!isOpen)}>
        <MessageCircle />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
              <h3 className="font-semibold">AI Asistan</h3>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex space-x-2"
              >
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Mesajınızı yazın..." />
                <Button type="submit">Gönder</Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

