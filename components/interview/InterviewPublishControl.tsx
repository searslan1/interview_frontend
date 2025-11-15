import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Interview, InterviewStatus } from "@/types/interview";
import { useInterviewStore } from "@/store/interviewStore";
import { useToast } from "@/components/ui/use-toast"; // Bildirim için toast kullanın
import { Copy, Link, Check, RefreshCw } from 'lucide-react';

interface InterviewPublishControlProps {
    // interview objesi Interview tipinde olmalıdır
    interview: Interview; 
}

// Varsayım: Interview prop'u, Store'dan gelen tam Interview objesidir.
export function InterviewPublishControl({ interview }: InterviewPublishControlProps) {
    const { publishInterview, loading: storeLoading } = useInterviewStore();
    // @ts-ignore
    const { toast } = useToast();
    const [linkCopied, setLinkCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!interview) return null;

    // Durum ve Link Kontrolleri
    const isDraft = interview.status === InterviewStatus.DRAFT;
    const isPublished = interview.status === InterviewStatus.PUBLISHED || interview.status === InterviewStatus.ACTIVE;
    const interviewLink = interview.interviewLink?.link;
    const isLoading = storeLoading || loading;

    /**
     * Link oluşturma (Publish) işlemini tetikler.
     */
    const handlePublish = async () => {
        setLoading(true);
        try {
            // publishInterview, Backend'de link oluşturma ve durumu PUBLISHED yapma işlemini yapar.
            await publishInterview(interview._id || interview._id);

            toast({
                title: "Başarılı!",
                description: "Mülakat yayınlandı ve link oluşturuldu.",
                // @ts-ignore
                variant: "success",
            });
        } catch (error) {
            console.error("Yayınlama hatası:", error);
            // Error handling, Backend'den gelen 400 Bad Request mesajını yakalamalıdır (örn: soru eksikliği).
            toast({
                title: "Hata",
                description: "Yayınlama başarısız oldu. Lütfen zorunlu alanları (sorular) kontrol edin.",
                // @ts-ignore
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Oluşturulan linki panoya kopyalar.
     */
    const handleCopyLink = () => {
        if (interviewLink) {
            // document.execCommand('copy') kullanımı, iFrame güvenliği nedeniyle tercih edilir.
            const tempInput = document.createElement('input');
            tempInput.value = interviewLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
            
            toast({
                title: "Kopyalandı",
                description: "Mülakat linki panoya kopyalandı.",
            });
        }
    };

    return (
        <div className="p-4 bg-card rounded-lg shadow-md border space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Yayın ve Erişim Kontrolü</h3>
            
            {/* --- DRAFT Durumu --- */}
            {isDraft && (
                <div className="space-y-3">
                    <p className="text-yellow-500 font-medium">Durum: TASLAK</p>
                    <p className="text-sm text-muted-foreground">Linki oluşturarak mülakatı adayların erişimine açın.</p>
                    <Button 
                        onClick={handlePublish} 
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Link className="w-4 h-4 mr-2" />}
                        {isLoading ? "Yayınlanıyor..." : "Linki Oluştur ve Yayınla"}
                    </Button>
                </div>
            )}

            {/* --- PUBLISHED/ACTIVE Durumu --- */}
            {isPublished && (
                <div className="space-y-3">
                    <p className="text-green-500 font-medium">Durum: YAYINLANDI / AKTİF</p>
                    <div className="flex items-center space-x-2 border rounded-md p-1 bg-muted/50">
                        <input
                            type="text"
                            value={interviewLink || "Link oluşturuluyor..."}
                            readOnly
                            className="flex-grow p-1 bg-transparent text-sm truncate"
                        />
                        <Button 
                            onClick={handleCopyLink} 
                            disabled={!interviewLink || linkCopied}
                            variant="secondary"
                            size="sm"
                        >
                            {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Link Bitiş Tarihi: {new Date(interview.expirationDate).toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
}
