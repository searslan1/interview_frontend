"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for Protected Routes
 * Catches JavaScript errors and displays fallback UI
 */
class ProtectedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 Protected route error:", error, errorInfo);
    
    // Error logging service entegrasyonu burada olabilir
    // logErrorToService(error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Bir Hata Oluştu
              </h1>
              <p className="text-muted-foreground">
                Sayfa yüklenirken beklenmeyen bir hata oluştu. 
                Lütfen sayfayı yenileyin veya ana sayfaya dönün.
              </p>
            </div>

            <Alert variant="destructive" className="text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata Detayı</AlertTitle>
              <AlertDescription className="mt-2 text-sm font-mono">
                {this.state.error?.message || "Bilinmeyen hata"}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={this.handleRefresh}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sayfayı Yenile
              </Button>
              <Button 
                onClick={this.handleGoHome}
                className="flex-1"
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-muted p-4 rounded-lg text-sm">
                <summary className="cursor-pointer font-medium text-muted-foreground">
                  Development Detayları
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProtectedErrorBoundary;