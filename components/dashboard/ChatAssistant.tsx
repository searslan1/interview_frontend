"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Merhaba! Size nasıl yardımcı olabilirim?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    } finally {
      setIsTyping(false);
    }
  };

  // AI mesajlarını karakter karakter yazdırma efekti
  const typeAIMessage = (fullText: string) => {
    let index = -1;
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
      }
    }, 10);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[500px] flex flex-col bg-background border border-collapse shadow-lg">
      <CardHeader className="bg-background text-white py-3 px-4">
        <CardTitle>İK Asistanı</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        {/* Scroll Alanı (Mesajları İçeriyor) */}
        <div
          ref={scrollAreaRef}
          className="flex-grow overflow-y-auto max-h-[400px] border border-gray-700 rounded-md p-3 bg-gray-900"
        >
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <span
                  className={cn(
                    "max-w-[75%] p-3 rounded-lg text-sm break-words whitespace-pre-wrap",
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-200"
                  )}
                >
                  {message.text}
                </span>
              </div>
            ))}
            {isTyping && <div className="text-gray-400 text-sm">Asistan yazıyor...</div>}
            {/* Yeni Mesajlar için Scroll Hedefi */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Input ve Gönder Butonu */}
        <div className="flex space-x-2 mt-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="bg-background text-white border-gray-600"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendMessage}>
            Gönder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
