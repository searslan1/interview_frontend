"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { experience: "0-2 yıl", count: 20 },
  { experience: "3-5 yıl", count: 40 },
  { experience: "6-10 yıl", count: 30 },
  { experience: "10+ yıl", count: 10 },
]

export function ExperienceDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="experience" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

