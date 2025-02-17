"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play } from "lucide-react"

interface QuestionReviewProps {
  candidate: any
  currentTime: number
}

export function QuestionReview({ candidate, currentTime }: QuestionReviewProps) {
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleQuestions((prev) => [...prev, Number(entry.target.id)])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".question-review").forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Mock questions and answers
  const questions = [
    {
      id: 1,
      text: "Tell me about your biggest professional achievement.",
      expectedAnswer:
        "The candidate should describe a significant project they completed successfully or a problem they solved.",
      candidateAnswer:
        "Last year, I redesigned our company's data analytics infrastructure, which reduced our data processing time by 40%.",
      aiScore: 90,
      videoTimestamp: 120, // in seconds
      analysis: {
        strengths: ["Provided a concrete example", "Quantified the impact"],
        weaknesses: ["Could have provided more context"],
        improvements: ["Elaborate on the challenges faced and how they were overcome"],
      },
    },
    // Add more questions as needed
  ]

  const handlePlayVideo = (timestamp: number) => {
    // Implement logic to play video at the given timestamp
    console.log(`Play video at ${timestamp} seconds`)
  }

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <Card
          key={question.id}
          id={question.id.toString()}
          className={`question-review transition-opacity duration-500 ${
            visibleQuestions.includes(question.id) ? "opacity-100" : "opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Question {question.id}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handlePlayVideo(question.videoTimestamp)}>
              <Play className="mr-2 h-4 w-4" /> Play Video
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Question:</h4>
              <p>{question.text}</p>
            </div>
            <div>
              <h4 className="font-semibold">Expected Answer:</h4>
              <p>{question.expectedAnswer}</p>
            </div>
            <div>
              <h4 className="font-semibold">Candidate's Answer:</h4>
              <p>{question.candidateAnswer}</p>
            </div>
            <div>
              <h4 className="font-semibold">AI Score:</h4>
              <Progress value={question.aiScore} className="w-full" />
              <p className="text-center mt-1">{question.aiScore}/100</p>
            </div>
            <div>
              <h4 className="font-semibold">Analysis:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium">Strengths:</h5>
                  <ul className="list-disc pl-5">
                    {question.analysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Weaknesses:</h5>
                  <ul className="list-disc pl-5">
                    {question.analysis.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Improvements:</h5>
                  <ul className="list-disc pl-5">
                    {question.analysis.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

