"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Maximize2, Minimize2, Play, Pause } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  onTimeUpdate: () => void
  onFullScreenToggle: () => void
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoUrl, onTimeUpdate, onFullScreenToggle }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playbackRate, setPlaybackRate] = useState(1)
    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => videoRef.current!)

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

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime)
        onTimeUpdate()
      }
    }

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration)
      }
    }

    const handleSeek = (value: number[]) => {
      if (videoRef.current) {
        videoRef.current.currentTime = value[0]
        setCurrentTime(value[0])
      }
    }

    const handlePlaybackRateChange = (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate
        setPlaybackRate(rate)
      }
    }

    return (
      <div className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 p-2 rounded">
            <Button onClick={togglePlay} variant="ghost" size="icon">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-grow mx-4"
            />
            <div className="flex items-center space-x-2">
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(Number.parseFloat(e.target.value))}
                className="bg-transparent text-white"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              <Button onClick={onFullScreenToggle} variant="ghost" size="icon">
                <Maximize2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-center">
          {`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)
            .toString()
            .padStart(2, "0")} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60)
            .toString()
            .padStart(2, "0")}`}
        </div>
      </div>
    )
  },
)

VideoPlayer.displayName = "VideoPlayer"

