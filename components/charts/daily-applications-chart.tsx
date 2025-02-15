"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "2023-05-01", applications: 4 },
  { date: "2023-05-02", applications: 3 },
  { date: "2023-05-03", applications: 2 },
  { date: "2023-05-04", applications: 7 },
  { date: "2023-05-05", applications: 5 },
  { date: "2023-05-06", applications: 6 },
  { date: "2023-05-07", applications: 4 },
]

export function DailyApplicationsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="applications" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

