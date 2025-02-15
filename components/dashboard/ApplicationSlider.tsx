"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const applications = [
  { id: 1, name: "Ali Yılmaz", position: "Frontend Developer", aiScore: 92, date: "2023-06-10" },
  { id: 2, name: "Ayşe Kara", position: "UX Designer", aiScore: 88, date: "2023-06-11" },
  { id: 3, name: "Mehmet Demir", position: "Product Manager", aiScore: 85, date: "2023-06-12" },
  { id: 4, name: "Zeynep Ak", position: "Data Scientist", aiScore: 90, date: "2023-06-13" },
  { id: 5, name: "Can Güneş", position: "DevOps Engineer", aiScore: 87, date: "2023-06-14" },
]

export function ApplicationSlider() {
  const [startIndex, setStartIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    if (startIndex < applications.length - 3) {
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
      <h2 className="text-2xl font-bold mb-4 text-primary">Son Başvurular</h2>
      <div className="relative overflow-hidden" ref={sliderRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${startIndex * 33.33}%)` }}
        >
          {applications.map((application) => (
            <Card key={application.id} className="flex-shrink-0 w-1/3 mr-4 bg-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${application.id}`} alt={application.name} />
                    <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{application.name}</h3>
                    <p className="text-sm text-muted-foreground">{application.position}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">AI Skoru: {application.aiScore}</Badge>
                  <span className="text-sm text-muted-foreground">{application.date}</span>
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
        disabled={startIndex >= applications.length - 3}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

