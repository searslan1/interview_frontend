"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Shadcn Input eklendi
import { Badge } from "@/components/ui/badge"; // Badge eklendi
import { Interview, InterviewStatus } from "@/types/interview";
import { useInterviewStore } from "@/store/interviewStore";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check, RefreshCw, Globe, ExternalLink } from 'lucide-react';

interface InterviewPublishControlProps {
    interview: Interview; 
}

export function InterviewPublishControl({ interview }: InterviewPublishControlProps) {
    const { publishInterview, loading: storeLoading } = useInterviewStore();
    const { toast } = useToast();
    const [linkCopied, setLinkCopied] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    if (!interview) return null;

    // Durum Kontrolleri
    const isDraft = interview.status === InterviewStatus.DRAFT;
    const isPublished = interview.status === InterviewStatus.PUBLISHED || interview.status === InterviewStatus.ACTIVE;
    
    // Link Erişimi (DTO yapısına göre güvenli erişim)
    const interviewLink = typeof interview.interviewLink === 'object' 
        ? interview.interviewLink?.link 
        : interview.interviewLink;

    const isLoading = storeLoading || localLoading;

    /**
     * Link oluşturma (Publish) işlemini tetikler.
     */
    const handlePublish = async () => {
        setLocalLoading(true);
        try {
            await publishInterview(interview._id);

            toast({
                title: "Mülakat Yayınlandı",
                description: "Erişim linki oluşturuldu ve aday başvurularına açıldı.",
                // variant: "default" (Success için varsayılanı kullanıyoruz)
            });
        } catch (error: any) {
            console.error("Yayınlama hatası:", error);
            toast({
                title: "Yayınlama Başarısız",
                description: error.response?.data?.message || "Lütfen mülakat sorularını kontrol ediniz.",
                variant: "destructive",
            });
        } finally {
            setLocalLoading(false);
        }
    };

    /**
     * Oluşturulan linki panoya kopyalar (Modern API).
     */
    const handleCopyLink = async () => {
        if (interviewLink) {
            try {
                await navigator.clipboard.writeText(interviewLink);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
                
                toast({
                    title: "Kopyalandı",
                    description: "Mülakat linki panoya kopyalandı.",
                });
            } catch (err) {
                console.error('Kopyalama başarısız:', err);
                toast({
                    title: "Hata",
                    description: "Link kopyalanamadı.",
                    variant: "destructive"
                });
            }
        }
    };

    /**
     * Linki yeni sekmede açar.
     */
    const handleOpenLink = () => {
        if (interviewLink) {
            window.open(interviewLink, '_blank');
        }
    };

    return (
        <div className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Yayın Durumu
                </h3>
                <Badge variant={isPublished ? "default" : "secondary"}>
                    {isPublished ? "YAYINDA" : "TASLAK"}
                </Badge>
            </div>
            
            {/* --- DRAFT Durumu --- */}
            {isDraft && (
                <div className="space-y-4">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm rounded-md border border-yellow-200 dark:border-yellow-900">
                        Bu mülakat henüz taslak aşamasındadır. Adaylarla paylaşmak için yayınlamanız gerekmektedir.
                    </div>
                    <Button 
                        onClick={handlePublish} 
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                        {isLoading ? "İşleniyor..." : "Yayınla ve Link Oluştur"}
                    </Button>
                </div>
            )}

            {/* --- PUBLISHED Durumu --- */}
            {isPublished && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Başvuru Linki</label>
                        <div className="flex gap-2">
                            <Input 
                                readOnly 
                                value={interviewLink || ""} 
                                className="font-mono text-sm bg-muted/50"
                            />
                            <Button 
                                onClick={handleCopyLink} 
                                variant="outline" 
                                size="icon"
                                title="Kopyala"
                            >
                                {linkCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                            <Button
                                onClick={handleOpenLink}
                                variant="outline"
                                size="icon"
                                title="Linki Aç"
                                disabled={!interviewLink}
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Bitiş Tarihi Bilgisi */}
                    <div className="text-xs text-muted-foreground pt-2 flex justify-between items-center border-t mt-4">
                        <span>Son Başvuru Tarihi:</span>
                        <span className="font-medium text-foreground">
                            {interview.expirationDate 
                                ? new Date(interview.expirationDate).toLocaleDateString("tr-TR") 
                                : "-"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}