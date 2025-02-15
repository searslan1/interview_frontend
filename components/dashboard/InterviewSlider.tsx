"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const interviews = [
  { id: 1, title: "Frontend Developer", applicants: 23, aiScore: 85, status: "Aktif" },
  { id: 2, title: "UX Designer", applicants: 18, aiScore: 78, status: "Aktif" },
  { id: 3, title: "Product Manager", applicants: 15, aiScore: 92, status: "Aktif" },
  { id: 4, title: "Data Scientist", applicants: 20, aiScore: 88, status: "Aktif" },
  { id: 5, title: "DevOps Engineer", applicants: 12, aiScore: 82, status: "Aktif" },
]

export function InterviewSlider() {
  const [startIndex, setStartIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    if (startIndex < interviews.length - 3) {
      setStartIndex(startIndex + 1)
    }
  }

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4 text-primary">Aktif Mülakatlar</h2>
      <div className="relative overflow-hidden" ref={sliderRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${startIndex * 33.33}%)` }}
        >
          {interviews.map((interview) => (
            <Card key={interview.id} className="flex-shrink-0 w-1/3 mr-4 bg-white shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">{interview.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{interview.applicants} Başvuru</span>
                  <Badge>{interview.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  AI Başarı Tahmini: <span className="font-semibold text-primary">{interview.aiScore}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-primary hover:bg-primary hover:text-white"
        onClick={prevSlide}
        disabled={startIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-primary hover:bg-primary hover:text-white"
        onClick={nextSlide}
        disabled={startIndex >= interviews.length - 3}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

