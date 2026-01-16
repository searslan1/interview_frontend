/**
 * Global Loading Component
 * Next.js App Router otomatik olarak sayfa geçişlerinde gösterir
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary" />
        </div>
        
        {/* Loading Text */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Yükleniyor...
        </p>
      </div>
    </div>
  );
}
