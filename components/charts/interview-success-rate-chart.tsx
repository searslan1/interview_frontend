"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Teknik Mülakat", successRate: 65 },
  { name: "İK Mülakatı", successRate: 80 },
  { name: "Proje Sunumu", successRate: 70 },
]

export function InterviewSuccessRateChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="successRate" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

