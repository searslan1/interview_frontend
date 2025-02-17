"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, UserPlus, BarChart } from "lucide-react"

const stats = [
  { title: "Toplam Başvuru", value: "1,234", icon: Users, color: "bg-blue-500" },
  { title: "Aktif Mülakatlar", value: "56", icon: Calendar, color: "bg-green-500" },
  { title: "Yeni Adaylar", value: "23", icon: UserPlus, color: "bg-yellow-500" },
  { title: "Ortalama Puan", value: "7.8", icon: BarChart, color: "bg-purple-500" },
]

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-[50vh] bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white rounded-b-3xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Mülakat Yönetim Paneli</h1>
        <p className="text-xl mb-8">Adaylarınızı yönetin, mülakatları planlayın ve sonuçları analiz edin</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-white/10 backdrop-blur-lg border-none text-white">
              <CardContent className="flex items-center p-4">
                <div className={`${stat.color} p-3 rounded-full mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

