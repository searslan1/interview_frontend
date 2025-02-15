"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock } from "lucide-react"

export function FeaturedInterview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h2 className="text-2xl font-bold mb-4">Öne Çıkan Mülakat</h2>
      <Card className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Kıdemli Yazılım Mühendisi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-2 md:mb-0">
              <Calendar className="mr-2" />
              <span>15 Haziran 2023</span>
            </div>
            <div className="flex items-center mb-2 md:mb-0">
              <Users className="mr-2" />
              <span>12 Başvuru</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" />
              <span>2 saat</span>
            </div>
          </div>
          <p className="mb-4">
            Bu mülakat, yüksek performanslı web uygulamaları geliştirme konusunda deneyimli bir Kıdemli Yazılım
            Mühendisi pozisyonu için yapılacaktır.
          </p>
          <Button variant="secondary">Detayları Görüntüle</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

