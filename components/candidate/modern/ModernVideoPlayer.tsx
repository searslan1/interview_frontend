"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ApplicationResponse } from "@/types/application";

interface ModernVideoPlayerProps {
  responses: ApplicationResponse[];
  activeQuestionIndex: number;
  onQuestionChange: (index: number) => void;
}

// Soru renkleri
const QUESTION_COLORS = [
  { bg: "bg-blue-500/10", border: "border-b-blue-500", text: "text-blue-300", hover: "hover:bg-blue-500/20" },
  { bg: "bg-purple-500/30", border: "border-b-purple-500", text: "text-purple-300", hover: "hover:bg-purple-500/40" },
  { bg: "bg-pink-500/10", border: "border-b-pink-500", text: "text-pink-300", hover: "hover:bg-pink-500/20" },
  { bg: "bg-green-500/10", border: "border-b-green-500", text: "text-green-300", hover: "hover:bg-green-500/20" },
  { bg: "bg-yellow-500/10", border: "border-b-yellow-500", text: "text-yellow-300", hover: "hover:bg-yellow-500/20" },
];

export function ModernVideoPlayer({ 
  responses, 
  activeQuestionIndex, 
  onQuestionChange 
}: ModernVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Aktif video URL'i
  const activeVideoUrl = responses[activeQuestionIndex]?.videoUrl || "";
  const activeAIStatus = responses[activeQuestionIndex]?.aiStatus || "idle";

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Video event handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipToPrevious = () => {
    if (activeQuestionIndex > 0) {
      onQuestionChange(activeQuestionIndex - 1);
    }
  };

  const skipToNext = () => {
    if (activeQuestionIndex < responses.length - 1) {
      onQuestionChange(activeQuestionIndex + 1);
    }
  };

  // Video değiştiğinde state'i sıfırla
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [activeQuestionIndex]);

  // Fullscreen değişikliklerini dinle
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse hareketi ile kontrolleri göster
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-1 rounded-2xl relative group bg-black/40 border border-border/50 shadow-2xl overflow-hidden"
      >
        <div className="aspect-video bg-black/80 rounded-xl overflow-hidden relative">
          {/* Video Element */}
          {activeVideoUrl ? (
            <video
              ref={videoRef}
              src={activeVideoUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Video mevcut değil</p>
              </div>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

          {/* Top Status Badges */}
          <div className="absolute top-4 left-4 flex gap-3 z-10">
            <span className="px-2.5 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              REC
            </span>
            <span className={cn(
              "px-2.5 py-1 backdrop-blur-md text-white text-[10px] font-mono rounded border flex items-center gap-1.5",
              activeAIStatus === 'completed' 
                ? "bg-green-500/20 border-green-500/30" 
                : activeAIStatus === 'processing'
                ? "bg-purple-500/20 border-purple-500/30"
                : "bg-black/60 border-white/10"
            )}>
              <Brain className="h-3 w-3" />
              {activeAIStatus === 'completed' && "AI Analiz Tamam"}
              {activeAIStatus === 'processing' && "AI Analiz Aktif"}
              {activeAIStatus === 'idle' && "AI Bekleniyor"}
              {activeAIStatus === 'failed' && "AI Hata"}
            </span>
          </div>

          {/* Center Play Button */}
          {!isPlaying && activeVideoUrl && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 border border-white/20 shadow-2xl cursor-pointer">
                <Play className="h-10 w-10 text-white ml-1" />
              </div>
            </motion.button>
          )}

          {/* Bottom Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-10"
          >
            {/* Time Display */}
            <div className="flex justify-between text-xs text-gray-300 font-mono mb-3 tracking-wide">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="opacity-60">{formatTime(duration)}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-white/10 rounded-full cursor-pointer relative group/timeline mb-4">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/timeline:scale-100 transition-transform" />
              </div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipToPrevious}
                  disabled={activeQuestionIndex === 0}
                  className="text-white hover:text-purple-400 hover:bg-white/10 disabled:opacity-30"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:text-purple-400 hover:bg-white/10"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipToNext}
                  disabled={activeQuestionIndex === responses.length - 1}
                  className="text-white hover:text-purple-400 hover:bg-white/10 disabled:opacity-30"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex gap-2 items-center">
                {/* Volume Control */}
                <div className="flex items-center gap-2 group/volume">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Question Timeline Segments */}
        <div className="mt-4 px-2 pb-2">
          <div className="flex justify-between items-end mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Soru Segmentleri</h4>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              İnteraktif Zaman Çizelgesi
            </span>
          </div>
          
          <div className="flex h-12 w-full gap-1">
            {responses.map((response, index) => {
              const colorSet = QUESTION_COLORS[index % QUESTION_COLORS.length];
              const isActive = index === activeQuestionIndex;
              const hasAnalysis = response.aiStatus === 'completed';
              
              return (
                <Button
                  key={response.questionId}
                  onClick={() => onQuestionChange(index)}
                  variant="ghost"
                  className={cn(
                    "timeline-segment flex-1 border-b-2 p-0 h-auto rounded-none",
                    colorSet.bg,
                    colorSet.border,
                    colorSet.hover,
                    isActive && "ring-1 ring-white/20 shadow-lg"
                  )}
                >
                  <span className={cn(
                    "absolute top-2 left-2 text-[10px] font-bold",
                    colorSet.text,
                    isActive && "animate-pulse"
                  )}>
                    Q{index + 1}
                    {isActive && " (Aktif)"}
                  </span>
                  
                  {/* AI Status Indicator */}
                  {hasAnalysis && (
                    <span className="absolute top-2 right-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 block" />
                    </span>
                  )}
                  
                  <div className="timeline-tooltip">
                    Soru {index + 1}
                    {response.aiScore && ` • Skor: ${response.aiScore}`}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
