"use client";

import { useEffect, useRef, useState } from "react";
import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Mic, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCcw, 
  Play, 
  Loader2 
} from "lucide-react";

export function SystemCheckView() {
  const { setStep } = usePublicApplicationStore();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // --- MEDYA BAŞLATMA ---
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // --- SES SEVİYESİ ANALİZİ ---
  useEffect(() => {
    if (!stream) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      const length = array.length;
      for (let i = 0; i < length; i++) {
        values += array[i];
      }
      const average = values / length;
      // Normalizasyon (0-100 arası)
      setAudioLevel(Math.min(100, average * 2.5)); 
    };

    return () => {
      javascriptNode.disconnect();
      analyser.disconnect();
      microphone.disconnect();
      audioContext.close();
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: true 
      });
      
      setStream(mediaStream);
      setIsReady(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsReady(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
         setError("Kamera veya mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin verip sayfayı yenileyin.");
      } else if (err.name === 'NotFoundError') {
         setError("Kamera veya mikrofon cihazı bulunamadı.");
      } else {
         setError("Medya cihazlarına erişilemedi. Başka bir uygulama kameranızı kullanıyor olabilir.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleStartExam = () => {
    stopCamera(); // Sınav ekranı kendi kamerasını açacak, bunu kapatıyoruz.
    setStep("exam-intro"); // Önce kurallar ekranına gönder
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] fade-in animate-in zoom-in-95">
      <div className="grid gap-6 lg:grid-cols-2 max-w-5xl w-full">
        
        {/* SOL: Video Önizleme */}
        <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
          <CardHeader className="pb-2">
             <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Kamera Kontrolü
             </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
             <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {error ? (
                   <div className="text-destructive flex flex-col items-center p-4 text-center">
                      <AlertCircle className="h-10 w-10 mb-2" />
                      <p>{error}</p>
                   </div>
                ) : !stream ? (
                   <Loader2 className="h-10 w-10 text-white animate-spin" />
                ) : (
                   <video 
                      ref={videoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover transform scale-x-[-1]" // Ayna efekti
                   />
                )}
                
                {/* Durum Badge */}
                <div className="absolute top-4 right-4">
                    {isReady ? (
                        <div className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="h-3 w-3" /> Hazır
                        </div>
                    ) : (
                        <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <AlertCircle className="h-3 w-3" /> Hata
                        </div>
                    )}
                </div>
             </div>

             {/* Mikrofon Barı */}
             <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                   <span className="flex items-center gap-2 text-muted-foreground">
                      <Mic className="h-4 w-4" /> Mikrofon Seviyesi
                   </span>
                   <span className={audioLevel > 10 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {audioLevel > 10 ? "Ses Algılanıyor" : "Sessiz"}
                   </span>
                </div>
                <Progress value={audioLevel} className="h-2" />
             </div>
          </CardContent>
        </Card>

        {/* SAĞ: Kontrol Listesi & Butonlar */}
        <div className="flex flex-col gap-6 justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Sistem Gereksinimleri</CardTitle>
                    <CardDescription>
                        Sorunsuz bir mülakat deneyimi için son kontrolleri yapın.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CheckItem 
                        icon={<Camera className="h-5 w-5" />} 
                        label="Kamera Erişimi" 
                        status={isReady && !error ? "ok" : "error"} 
                    />
                    <CheckItem 
                        icon={<Mic className="h-5 w-5" />} 
                        label="Mikrofon Erişimi" 
                        status={isReady && audioLevel > 5 ? "ok" : "waiting"} 
                    />
                    <CheckItem 
                        icon={<RefreshCcw className="h-5 w-5" />} 
                        label="İnternet Bağlantısı" 
                        status="ok" // Varsayılan OK (offline kontrolü eklenebilir)
                    />
                    
                    {error && (
                         <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Hata</AlertTitle>
                            <AlertDescription className="text-xs">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-semibold mb-1">💡 İpucu:</p>
                        Kamerada kendinizi net bir şekilde görebildiğinizden ve sesinizin algılandığından emin olun.
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button 
                        className="w-full h-12 text-lg" 
                        size="lg" 
                        onClick={handleStartExam}
                        disabled={!isReady || !!error}
                    >
                        Mülakatı Başlat <Play className="ml-2 h-5 w-5 fill-current" />
                    </Button>
                    
                    {error && (
                         <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                            <RefreshCcw className="mr-2 h-4 w-4" /> Sayfayı Yenile
                         </Button>
                    )}
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}

// Alt Bileşen: Kontrol Maddesi
function CheckItem({ icon, label, status }: { icon: any, label: string, status: "ok" | "error" | "waiting" }) {
    let statusIcon;
    let colorClass;

    if (status === "ok") {
        statusIcon = <CheckCircle2 className="h-5 w-5" />;
        colorClass = "text-green-600 bg-green-50 dark:bg-green-900/20";
    } else if (status === "error") {
        statusIcon = <AlertCircle className="h-5 w-5" />;
        colorClass = "text-red-600 bg-red-50 dark:bg-red-900/20";
    } else {
        statusIcon = <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse" />;
        colorClass = "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    }

    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>
            <div className={status === "ok" ? "text-green-600" : status === "error" ? "text-red-600" : "text-yellow-600"}>
                {statusIcon}
            </div>
        </div>
    );
}