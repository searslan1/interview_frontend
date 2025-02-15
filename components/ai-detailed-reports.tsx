"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AIDetailedReportsProps {
  candidate: any
}

export function AIDetailedReports({ candidate }: AIDetailedReportsProps) {
  const [visibleReports, setVisibleReports] = useState<string[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleReports((prev) => [...prev, entry.target.id])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".ai-report").forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const reports = [
    {
      id: "personality",
      title: "Personality Analysis",
      content: (
        <div>
          <p>INTJ - "The Architect"</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Innovative and strategic thinking</li>
            <li>Strong analytical skills</li>
            <li>Independent and decisive</li>
          </ul>
        </div>
      ),
    },
    {
      id: "speech",
      title: "Speech Analysis",
      content: (
        <div className="space-y-2">
          <div>
            <p>Word Usage</p>
            <Progress value={85} className="w-full" />
          </div>
          <div>
            <p>Confidence</p>
            <Progress value={90} className="w-full" />
          </div>
          <div>
            <p>Persuasiveness</p>
            <Progress value={80} className="w-full" />
          </div>
          <div>
            <p>Fluency</p>
            <Progress value={95} className="w-full" />
          </div>
        </div>
      ),
    },
    {
      id: "gestures",
      title: "Gesture & Facial Expression Analysis",
      content: (
        <div className="space-y-2">
          <div>
            <p>Confidence</p>
            <Progress value={88} className="w-full" />
          </div>
          <div>
            <p>Stress Level</p>
            <Progress value={30} className="w-full" />
          </div>
          <div>
            <p>Engagement</p>
            <Progress value={92} className="w-full" />
          </div>
        </div>
      ),
    },
    {
      id: "eyeMovement",
      title: "Eye Movement & Attention Analysis",
      content: (
        <div className="space-y-2">
          <div>
            <p>Focus</p>
            <Progress value={85} className="w-full" />
          </div>
          <div>
            <p>Attentiveness</p>
            <Progress value={90} className="w-full" />
          </div>
        </div>
      ),
    },
    {
      id: "tonalAnalysis",
      title: "Voice Tone Analysis",
      content: (
        <div className="space-y-2">
          <div>
            <p>Excitement</p>
            <Progress value={75} className="w-full" />
          </div>
          <div>
            <p>Confidence</p>
            <Progress value={88} className="w-full" />
          </div>
          <div>
            <p>Stress</p>
            <Progress value={25} className="w-full" />
          </div>
        </div>
      ),
    },
    {
      id: "linkedIn",
      title: "LinkedIn Profile Analysis",
      content: (
        <div>
          <p>Profile Strength: Strong</p>
          <ul className="list-disc pl-5 mt-2">
            <li>5+ years of relevant experience</li>
            <li>Skills align well with job requirements</li>
            <li>Strong professional network in the industry</li>
          </ul>
        </div>
      ),
    },
    {
      id: "technicalKnowledge",
      title: "Technical Knowledge Analysis",
      content: (
        <div className="space-y-2">
          <div>
            <p>Overall Technical Proficiency</p>
            <Progress value={92} className="w-full" />
          </div>
          <div>
            <p>Specific Job-Related Skills</p>
            <Progress value={88} className="w-full" />
          </div>
          <div>
            <p>Problem-Solving Ability</p>
            <Progress value={95} className="w-full" />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {reports.map((report) => (
        <Card
          key={report.id}
          id={report.id}
          className={`ai-report transition-opacity duration-500 ${
            visibleReports.includes(report.id) ? "opacity-100" : "opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle>{report.title}</CardTitle>
          </CardHeader>
          <CardContent>{report.content}</CardContent>
        </Card>
      ))}
    </div>
  )
}

