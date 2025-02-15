"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const applicationData = [
  { name: "Pzt", count: 4 },
  { name: "Sal", count: 3 },
  { name: "Çar", count: 2 },
  { name: "Per", count: 7 },
  { name: "Cum", count: 5 },
  { name: "Cmt", count: 6 },
  { name: "Paz", count: 4 },
]

const statusData = [
  { name: "Beklemede", value: 45 },
  { name: "Olumlu", value: 30 },
  { name: "Olumsuz", value: 25 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function DashboardCharts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <CardTitle>Haftalık Başvurular</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Başvuru Durumları</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

