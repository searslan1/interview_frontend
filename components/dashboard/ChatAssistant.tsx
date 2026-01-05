"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Minus, Send, Sparkles, ChevronRight } from "lucide-react";
import { useInterviewStore } from "@/store/interviewStore";
import { useApplicationStore } from "@/store/applicationStore";
import Link from "next/link";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  actions?: { label: string; href: string }[];
}

interface ChatAssistantProps {
  /** Chatbot'un başlangıç durumu */
  defaultOpen?: boolean;
}

export function ChatAssistant({ defaultOpen = false }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Dashboard verilerini al (context-aware mesaj için)
  const { interviews } = useInterviewStore();
  const { applications } = useApplicationStore();

  // Context-aware başlangıç mesajı
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const pendingInterviews = interviews.filter(i => i.status === "active").length;
      const pendingApplications = applications.filter(a => !a.generalAIAnalysis?.overallScore).length;
      
      let welcomeText = "Merhaba 👋\n";
      
      if (pendingInterviews > 0 || pendingApplications > 0) {
        if (pendingInterviews > 0) {
          welcomeText += `Bugün ${pendingInterviews} aktif mülakatınız var. `;
        }
        if (pendingApplications > 0) {
          welcomeText += `${pendingApplications} başvuru değerlendirilmeyi bekliyor.`;
        }
        welcomeText += "\n\nNasıl yardımcı olabilirim?";
      } else {
        welcomeText += "Bugün mülakatlar veya aday değerlendirmeleri hakkında size nasıl yardımcı olabilirim?";
      }

      const actions = [];
      if (pendingApplications > 0) {
        actions.push({ label: "Başvuruları Gör", href: "/applications" });
      }
      if (pendingInterviews > 0) {
        actions.push({ label: "Mülakatları Gör", href: "/interviews" });
      }

      setMessages([
        { 
          id: 1, 
          text: welcomeText, 
          sender: "ai",
          actions: actions.length > 0 ? actions : undefined
        }
      ]);
    }
  }, [isOpen, interviews, applications, messages.length]);

  // Yeni mesaj eklendiğinde en alta kaydır
  useEffect(() => {
    if (scrollAreaRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = { id: messages.length + 1, text: input, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })).concat({ role: "user", content: input }),
        }),
      });

      const data = await response.json();
      typeAIMessage(data.reply);
    } catch (error) {
      console.error("Hata:", error);
      // Hata durumunda fallback mesaj
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        text: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.",
        sender: "ai"
      }]);
      setIsTyping(false);
    }
  };

  // AI mesajlarını karakter karakter yazdırma efekti
  const typeAIMessage = (fullText: string) => {
    let index = 0;
    const aiMessage: Message = { id: messages.length + 2, text: "", sender: "ai" };

    setMessages((prev) => [...prev, aiMessage]);

    const interval = setInterval(() => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const updatedMessage = {
          ...lastMessage,
          text: lastMessage.text + fullText.charAt(index),
        };
        return [...prev.slice(0, -1), updatedMessage];
      });

      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  // Chat Bubble (Kapalı durum)
  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-[10px] text-white font-medium">
            {applications.filter(a => !a.generalAIAnalysis?.overallScore).length || ""}
          </span>
        </span>
      </Button>
    );
  }

  // Minimized State
  if (isMinimized) {
    return (
      <div 
        onClick={handleRestore}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
      >
        <Card className="w-64 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="py-2 px-3 flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">İK Asistanı</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-primary-foreground/20 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Full Chat Panel
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 sm:w-96 shadow-2xl flex flex-col max-h-[500px] animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle className="text-base">İK Asistanı</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground"
              onClick={handleMinimize}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-grow flex flex-col p-0">
          <div
            ref={scrollAreaRef}
            className="flex-grow overflow-y-auto max-h-[320px] p-4"
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-sm",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      )}
                    >
                      <span className="whitespace-pre-wrap break-words">{message.text}</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-1">
                      {message.actions.map((action, idx) => (
                        <Link key={idx} href={action.href}>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            {action.label}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 h-9 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
              />
              <Button 
                size="icon" 
                className="h-9 w-9" 
                onClick={handleSendMessage}
                disabled={isTyping || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Asistan yönlendirir, aksiyon almaz
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
