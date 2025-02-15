"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFavoriteCandidatesStore } from "@/store/favorite-candidates-store"

interface ApplicationPreviewDialogProps {
  applicationId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationPreviewDialog({ applicationId, open, onOpenChange }: ApplicationPreviewDialogProps) {
  const [application, setApplication] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const videoRef = useRef<HTMLVideoElement>(null)
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore()

  useEffect(() => {
    // Fetch application data
    const fetchApplication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setApplication({
        id: applicationId,
        name: "John Doe",
        position: "Senior Software Engineer",
        status: "İnceleniyor",
        aiScore: 85,
        personalityType: "INTJ",
        videoUrl: "/placeholder-video.mp4",
        duration: "46 dk",
        sections: [
          {
            id: 1,
            title: "Kendini Tanıtma",
            description: "Aday kendini ve kariyer hedeflerini anlatıyor.",
            timestamp: 0,
            duration: 180,
            score: 92,
            thumbnail: "/placeholder.svg?height=120&width=200",
          },
          {
            id: 2,
            title: "Teknik Yetkinlikler",
            description: "Adayın teknik bilgi ve deneyimleri değerlendiriliyor.",
            timestamp: 180,
            duration: 240,
            score: 88,
            thumbnail: "/placeholder.svg?height=120&width=200",
          },
          {
            id: 3,
            title: "Problem Çözme",
            description: "Adayın problem çözme ve analitik düşünme becerileri test ediliyor.",
            timestamp: 420,
            duration: 300,
            score: 85,
            thumbnail: "/placeholder.svg?height=120&width=200",
          },
        ],
        analysis: {
          technicalSkills: 88,
          communication: 90,
          problemSolving: 85,
          culturalFit: 92,
        },
      })
    }
    if (open) {
      fetchApplication()
    }
  }, [applicationId, open])

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const updateTime = () => setCurrentTime(video.currentTime)
      const updateDuration = () => setDuration(video.duration)

      video.addEventListener("timeupdate", updateTime)
      video.addEventListener("loadedmetadata", updateDuration)

      return () => {
        video.removeEventListener("timeupdate", updateTime)
        video.removeEventListener("loadedmetadata", updateDuration)
      }
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
      if (!newMuted && volume === 0) {
        handleVolumeChange([0.5])
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleFavorite = () => {
    if (application) {
      if (isFavorite(application.id)) {
        removeFavorite(application.id)
      } else {
        addFavorite({
          id: application.id,
          name: application.name,
          position: application.position,
          score: application.aiScore,
        })
      }
    }
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 h-[90vh] bg-black/95 text-white overflow-hidden">
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{application?.name}</h2>
                <p className="text-gray-400">{application?.position}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className={`text-white ${isFavorite(application?.id || "") ? "text-yellow-400" : ""}`}
                >
                  <Star className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                src={application.videoUrl}
                className="w-full h-full object-contain bg-black"
                onClick={togglePlay}
              />

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex flex-col gap-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleTimeChange}
                    className="w-full"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="overview" className="h-full" onValueChange={setActiveTab}>
              <div className="border-b border-white/10">
                <TabsList className="bg-transparent border-b border-white/10">
                  <TabsTrigger value="overview" className="text-white data-[state=active]:text-white">
                    Genel Bakış
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="text-white data-[state=active]:text-white">
                    Bölümler
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="text-white data-[state=active]:text-white">
                    AI Analizi
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[calc(90vh-600px)] px-4">
                <TabsContent value="overview" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                  <div className="grid gap-4">
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="grid gap-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Aday Bilgileri</h3>
                            <Badge variant="outline">{application.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">AI Skoru</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{application.aiScore}</span>
                                <Progress
                                  value={isNaN(application.aiScore) ? 0 : application.aiScore}
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Kişilik Tipi</p>
                              <p className="text-lg font-semibold">{application.personalityType}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sections" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                  <div className="space-y-4">
                    {application.sections.map((section: any) => (
                      <Card
                        key={section.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = section.timestamp
                            if (!isPlaying) togglePlay()
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-48 h-24 rounded overflow-hidden">
                              <img
                                src={section.thumbnail || "/placeholder.svg"}
                                alt={section.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                <Play className="h-8 w-8" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">{section.title}</h3>
                                <span className="text-sm text-gray-400">{formatTime(section.duration)}</span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                              <div className="mt-2">
                                <Progress value={isNaN(section.score) ? 0 : section.score} className="h-1" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                  <div className="grid gap-4">
                    {Object.entries(application.analysis).map(([key, value]) => (
                      <Card key={key} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                              {key
                                .split(/(?=[A-Z])/)
                                .join(" ")
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h3>
                            <span className="text-2xl font-bold">{value}%</span>
                          </div>
                          <Progress value={isNaN(value) ? 0 : value} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

