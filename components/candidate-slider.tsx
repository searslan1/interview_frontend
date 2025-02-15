"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const candidates = [
  { id: 1, name: "John Doe", position: "Frontend Developer", score: 8.5 },
  { id: 2, name: "Jane Smith", position: "Backend Developer", score: 9.2 },
  { id: 3, name: "Mike Johnson", position: "UI/UX Designer", score: 7.8 },
  { id: 4, name: "Emily Brown", position: "DevOps Engineer", score: 8.9 },
  { id: 5, name: "Chris Wilson", position: "Product Manager", score: 9.5 },
  { id: 6, name: "Sarah Lee", position: "Data Scientist", score: 9.0 },
  { id: 7, name: "Tom Harris", position: "Mobile Developer", score: 8.7 },
  { id: 8, name: "Lucy Chen", position: "QA Engineer", score: 8.3 },
]

interface CandidateSliderProps {
  title: string
}

export function CandidateSlider({ title }: CandidateSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ scrollSnapAlign: "start" }}
            >
              <Card className="w-72">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.id}`} />
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{candidate.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{candidate.position}</p>
                  <p className="font-bold">Puan: {candidate.score}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

