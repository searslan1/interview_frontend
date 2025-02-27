"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Item {
  id: number
  title: string
  description: string
}

export function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMoreItems = useCallback(async () => {
    setLoading(true)
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: items.length + i + 1,
      title: `Item ${items.length + i + 1}`,
      description: `This is the description for item ${items.length + i + 1}`,
    }))
    setItems((prevItems) => [...prevItems, ...newItems])
    setPage((prevPage) => prevPage + 1)
    setLoading(false)
  }, [items.length])

  useEffect(() => {
    loadMoreItems()
  }, [loadMoreItems])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        loadMoreItems()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreItems])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Daha Fazla İçerik</h2>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {loading && <p className="text-center">Yükleniyor...</p>}
    </div>
  )
}

