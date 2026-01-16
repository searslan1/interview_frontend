"use client";

/**
 * Global Error Boundary
 * Beklenmeyen hatalar için kullanıcı dostu hata sayfası
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hata loglama servisi (Sentry, LogRocket vb.) buraya eklenebilir
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Bir Hata Oluştu
          </h1>
          <p className="text-muted-foreground">
            Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya
            ana sayfaya dönün.
          </p>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-muted/50 rounded-lg p-4 text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
          <Button variant="outline" asChild>
            <a href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
