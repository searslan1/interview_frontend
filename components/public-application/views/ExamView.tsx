"use client";

import { useEffect, useRef, useState } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import publicApplicationService from "@/services/publicApplicationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Square, 
  Clock, 
  Video as VideoIcon, 
  Wifi, 
  WifiOff,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// --- MAIN COMPONENT ---

export function ExamView() {
  const { currentStep, startExam } = usePublicApplicationStore();

  if (currentStep === "exam-intro") {
    return <ExamIntro onStart={startExam} />;
  }

  return <ActiveExamSession />;
}

// --- SUB-COMPONENT: EXAM INTRO (Kurallar) ---

function ExamIntro({ onStart }: { onStart: () => void }) {
  const { interview } = usePublicApplicationStore();
  
  return (
    <div className="flex items-center justify-center min-h-[70vh] fade-in animate-in zoom-in-95">
      <Card className="max-w-2xl w-full text-center p-6 shadow-xl border-primary/20">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <VideoIcon className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Mülakat Başlıyor</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
          Toplam <strong>{interview?.questions.length}</strong> soru sorulacaktır. 
          Her soru için belirlenen süre ekranda görünecektir.
          Hazır olduğunuzda aşağıdaki butona basarak ilk soruyu görebilirsiniz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
           <RuleItem icon={<Clock className="h-5 w-5" />} title="Süre Takibi" desc="Süre bitince kayıt otomatik durur." />
           <RuleItem icon={<Wifi className="h-5 w-5" />} title="Bağlantı" desc="İnternet bağlantınızın kopmamasına dikkat edin." />
           <RuleItem icon={<ChevronRight className="h-5 w-5" />} title="İlerleme" desc="Cevapladıktan sonra geri dönemezsiniz." />
        </div>

        <Button size="lg" className="w-full md:w-1/2 h-14 text-lg" onClick={onStart}>
          Mülakatı Başlat <Play className="ml-2 h-5 w-5 fill-current" />
        </Button>
      </Card>
    </div>
  );
}

function RuleItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2 font-semibold text-primary">
                {icon} {title}
            </div>
            <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
        </div>
    )
}

// --- SUB-COMPONENT: ACTIVE SESSION (Kayıt Ekranı) ---

function ActiveExamSession() {
  const { 
    interview, 
    currentQuestionIndex, 
    nextQuestion, 
    addToUploadQueue, 
    removeFromUploadQueue,
    uploadQueue
  } = usePublicApplicationStore();

  const currentQuestion = interview?.questions[currentQuestionIndex];

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // State
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Soru geçişi sırasında

  // 1. Kamera Başlat
  useEffect(() => {
    async function initCamera() {
      try {
        const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(ms);
        if (videoRef.current) {
          videoRef.current.srcObject = ms;
        }
      } catch (err) {
        console.error("Camera Error:", err);
        toast({ title: "Kamera Hatası", description: "Kameraya erişilemedi.", variant: "destructive" });
      }
    }
    initCamera();
    return () => {
       // Cleanup: Stream'i durdurma (Bunu sadece component unmount olunca yap)
       // stream?.getTracks().forEach(t => t.stop());
    };
  }, []); // Sadece mount olduğunda çalışır

  // 2. Soru Değiştiğinde: Zamanlayıcıyı ve Kaydı Başlat
  useEffect(() => {
    if (!currentQuestion || !stream) return;

    // Reset State
    setTimeLeft(currentQuestion.duration);
    chunksRef.current = [];
    setIsProcessing(false);

    // Start Recorder
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      handleRecordingStopped();
    };

    // Hafif bir gecikme ile başla (Kullanıcı soruyu okusun diye 1sn beklenebilir ama şimdilik direkt)
    recorder.start(1000); // 1 saniyelik chunklar
    mediaRecorderRef.current = recorder;
    setIsRecording(true);

  }, [currentQuestionIndex, stream]); // Stream hazır olduğunda veya soru değiştiğinde

  // 3. Zamanlayıcı (Countdown)
  useEffect(() => {
    if (!isRecording || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Süre bitti
          stopRecording(); // Manuel durdurma ile aynı işlemi tetikler
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  // --- ACTIONS ---

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true); // Yükleme başlıyor UI feedback
    }
  };

  const handleRecordingStopped = async () => {
    if (!currentQuestion) return;

    // 1. Blob Oluştur
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const questionId = (currentQuestion as any)._id || `q-${currentQuestionIndex}`; // ID yoksa index fallback
    const duration = currentQuestion.duration - timeLeft;

    // 2. Queue'ya Ekle (Store)
    addToUploadQueue(questionId);

    // 3. Arka Plan Yükleme Başlat (FIRE AND FORGET)
    uploadVideoInBackground(questionId, blob, duration)
      .then(() => {
         console.log(`Question ${currentQuestionIndex + 1} uploaded.`);
         removeFromUploadQueue(questionId);
      })
      .catch((err) => {
         console.error(`Upload failed for Q${currentQuestionIndex + 1}:`, err);
         toast({ 
            title: "Yükleme Hatası", 
            description: "Video yüklenirken hata oluştu. İnternetinizi kontrol edin.", 
            variant: "destructive" 
         });
         // Retry mekanizması eklenebilir
         removeFromUploadQueue(questionId); // Şimdilik kuyruktan çıkarıyoruz ki takılmasın
      });

    // 4. Sonraki Soruya Geç (UI Beklemez)
    nextQuestion();
  };

  /**
   * Arka Planda Çalışan Yükleme Fonksiyonu
   */
  const uploadVideoInBackground = async (qId: string, blob: Blob, duration: number) => {
     // A. Upload URL Al
     const { uploadUrl, videoKey } = await publicApplicationService.getVideoUploadUrl(qId, 'video/webm');

     // B. S3'e PUT
     await axios.put(uploadUrl, blob, {
        headers: { 'Content-Type': 'video/webm' }
     });

     // C. Backend'e Bildir
     await publicApplicationService.submitVideoResponse({
        questionId: qId,
        videoUrl: videoKey, // Backend key bekliyor (serviste url'e çeviriyor olabilir, backend logic'e göre key)
        duration: duration
     });
  };

  if (!currentQuestion) return null;

  // Progress Bar Hesabı
  const progressPercent = ((currentQuestion.duration - timeLeft) / currentQuestion.duration) * 100;
  const isCriticalTime = timeLeft <= 10;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6 fade-in animate-in slide-in-from-right-4">
      
      {/* Üst Bilgi: Soru Sayısı ve Yükleme Durumu */}
      <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
         <span>Soru {currentQuestionIndex + 1} / {interview?.questions.length}</span>
         <div className="flex items-center gap-2">
            {uploadQueue.length > 0 && (
                <span className="flex items-center gap-1 text-xs animate-pulse text-primary">
                    <Loader2 className="h-3 w-3 animate-spin" /> {uploadQueue.length} video yükleniyor...
                </span>
            )}
            <Badge variant="outline">{currentQuestion.duration} sn</Badge>
         </div>
      </div>

      {/* Soru Kartı */}
      <Card className="w-full border-l-4 border-l-primary shadow-sm">
         <CardContent className="p-6">
            <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
               {currentQuestion.questionText}
            </h2>
         </CardContent>
      </Card>

      {/* Video Alanı */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border">
         <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover transform scale-x-[-1]"
         />
         
         {/* REC Göstergesi */}
         {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
               <div className="w-2 h-2 bg-white rounded-full" /> REC
            </div>
         )}

         {/* Süre Göstergesi (Overlay) */}
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-md px-4 gap-2">
             <div className={`text-4xl font-mono font-bold drop-shadow-md ${isCriticalTime ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
             <Progress value={progressPercent} className={`h-2 w-full ${isCriticalTime ? "bg-red-900/50" : "bg-white/30"}`} />
         </div>
      </div>

      {/* Kontroller */}
      <div className="w-full flex justify-center pb-8">
         <Button 
            size="lg" 
            variant={isCriticalTime ? "destructive" : "default"}
            className="h-14 px-8 text-lg w-full md:w-auto min-w-[200px] shadow-lg hover:scale-105 transition-transform"
            onClick={stopRecording}
            disabled={!isRecording || isProcessing}
         >
            {isProcessing ? (
                <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> İşleniyor... </>
            ) : (
                <> <Square className="mr-2 h-5 w-5 fill-current" /> Yanıtı Tamamla </>
            )}
         </Button>
      </div>

    </div>
  );
}