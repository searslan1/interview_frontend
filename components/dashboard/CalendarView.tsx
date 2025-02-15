"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

const interviews = [
  { id: 1, title: "Frontend Developer", date: new Date(2023, 5, 15), status: "scheduled" },
  { id: 2, title: "UX Designer", date: new Date(2023, 5, 18), status: "completed" },
  { id: 3, title: "Product Manager", date: new Date(2023, 5, 20), status: "scheduled" },
  { id: 4, title: "Data Scientist", date: new Date(2023, 5, 22), status: "cancelled" },
]

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const getInterviewsForDate = (day: Date | undefined) => {
    if (!day) return []
    return interviews.filter((interview) => interview.date.toDateString() === day.toDateString())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mülakat Takvimi</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const dayInterviews = getInterviewsForDate(date)
              return (
                <div className="relative w-full h-full">
                  <div>{date?.getDate()}</div>
                  {dayInterviews.length > 0 && (
                    <div className="absolute bottom-0 right-0">
                      <Badge variant="secondary" className="text-xs">
                        {dayInterviews.length}
                      </Badge>
                    </div>
                  )}
                </div>
              )
            },
          }}
        />
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Bugünkü Mülakatlar</h3>
          {getInterviewsForDate(date).map((interview) => (
            <div key={interview.id} className="flex justify-between items-center mb-2">
              <span>{interview.title}</span>
              <Badge
                variant={
                  interview.status === "scheduled"
                    ? "default"
                    : interview.status === "completed"
                      ? "secondary"
                      : "destructive"
                }
              >
                {interview.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

