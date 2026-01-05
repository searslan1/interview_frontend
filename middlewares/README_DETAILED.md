# 🛡️ Middlewares Module - Ara Katman Fonksiyonları

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nde kullanılan Next.js middleware fonksiyonlarını içerir. Middleware'ler, istek (request) ve yanıt (response) arasında çalışan ve yetkilendirme, yönlendirme gibi işlemleri gerçekleştiren ara katman fonksiyonlarıdır.

## 🏗️ Mimari Yapı

```
middlewares/
├── README.md              # Bu dokümantasyon
├── authMiddleware.ts      # 🔐 Kimlik doğrulama middleware
└── errorMiddleware.ts     # ⚠️ Hata yönetimi middleware
```

---

## 🔐 Auth Middleware (`authMiddleware.ts`)

Korumalı rotalar için kimlik doğrulama kontrolü yapar.

### Implementasyon

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Cookie'lerden token'ları al
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Korumalı yollar listesi
  const protectedPaths = [
    "/dashboard",
    "/candidates",
    "/applications",
    "/interviews",
    "/reports",
    "/settings",
  ];

  const { pathname } = req.nextUrl;

  // Korumalı sayfa kontrolü
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    // Token yoksa giriş sayfasına yönlendir
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // İsteğin devam etmesine izin ver
  return NextResponse.next();
}

// Middleware'in çalışacağı rotalar
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/candidates/:path*",
    "/applications/:path*",
    "/interviews/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
```

### Çalışma Prensibi

```
[Request] → [Middleware] → [Route Handler] → [Response]
                ↓
         Token kontrolü
                ↓
         ✅ Token var → Devam et
         ❌ Token yok → Redirect "/"
```

### Korumalı Rotalar

| Rota | Açıklama |
|------|----------|
| `/dashboard/*` | Ana kontrol paneli |
| `/candidates/*` | Aday yönetimi |
| `/applications/*` | Başvuru yönetimi |
| `/interviews/*` | Mülakat yönetimi |
| `/reports/*` | Raporlama |
| `/settings/*` | Ayarlar |

### Matcher Pattern Açıklaması

```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",  // /dashboard ve alt rotaları
    // :path* → herhangi bir path segmenti (0 veya daha fazla)
  ],
};
```

---

## ⚠️ Error Middleware (`errorMiddleware.ts`)

API hatalarını yakalar ve standart format döner.

### Tipik Implementasyon

```typescript
import { NextRequest, NextResponse } from "next/server";

// Hata tipleri
interface APIError {
  status: number;
  message: string;
  code?: string;
}

// Hata yakalama middleware
export function errorMiddleware(handler: Function) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error("API Error:", error);

      // Standart hata yanıtı
      const status = error.status || 500;
      const message = error.message || "Internal Server Error";

      return NextResponse.json(
        {
          success: false,
          error: {
            message,
            code: error.code,
          },
        },
        { status }
      );
    }
  };
}
```

### Hata Tipleri

| Status | Açıklama | Kullanım |
|--------|----------|----------|
| 400 | Bad Request | Geçersiz istek |
| 401 | Unauthorized | Yetkilendirme gerekli |
| 403 | Forbidden | Erişim engellendi |
| 404 | Not Found | Kaynak bulunamadı |
| 422 | Unprocessable Entity | Validation hatası |
| 500 | Internal Server Error | Sunucu hatası |

---

## 🎯 Middleware Patterns

### 1. Chain Pattern

```typescript
// Birden fazla middleware'i zincirle
import { NextRequest, NextResponse } from "next/server";

type MiddlewareFunction = (
  req: NextRequest,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>;

const chain = (...middlewares: MiddlewareFunction[]) => {
  return async (req: NextRequest) => {
    let index = 0;

    const next = async (): Promise<NextResponse> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        return await middleware(req, next);
      }
      return NextResponse.next();
    };

    return await next();
  };
};

// Kullanım
export const middleware = chain(
  authMiddleware,
  loggingMiddleware,
  rateLimitMiddleware
);
```

### 2. Conditional Middleware

```typescript
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API rotaları için farklı mantık
  if (pathname.startsWith("/api")) {
    return handleAPIMiddleware(req);
  }

  // Sayfa rotaları için farklı mantık
  if (pathname.startsWith("/dashboard")) {
    return handleDashboardMiddleware(req);
  }

  return NextResponse.next();
}
```

### 3. Logging Middleware

```typescript
export function loggingMiddleware(req: NextRequest) {
  const start = Date.now();

  // Request log
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Response sonrası log
  const response = NextResponse.next();
  
  console.log(`[${new Date().toISOString()}] Completed in ${Date.now() - start}ms`);

  return response;
}
```

### 4. Rate Limiting Middleware

```typescript
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 dakika
  const maxRequests = 100;

  const current = rateLimitMap.get(ip);

  if (!current || now - current.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return NextResponse.next();
  }

  if (current.count >= maxRequests) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  current.count++;
  return NextResponse.next();
}
```

---

## 🔄 Request/Response Manipulation

### Headers Ekleme

```typescript
export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  return response;
}
```

### Request Rewriting

```typescript
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Eski URL'leri yeni URL'lere yönlendir
  if (pathname === "/old-path") {
    return NextResponse.rewrite(new URL("/new-path", req.url));
  }

  return NextResponse.next();
}
```

### Redirects

```typescript
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Maintenance mode
  if (process.env.MAINTENANCE_MODE === "true") {
    if (pathname !== "/maintenance") {
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }
  }

  return NextResponse.next();
}
```

---

## 🔐 Token Validation

### JWT Token Kontrolü

```typescript
import { jwtVerify } from "jose";

export async function validateToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (token) {
    const isValid = await validateToken(token);
    if (!isValid) {
      // Token geçersiz, cookie'yi sil ve yönlendir
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}
```

---

## 📊 Middleware Konfigürasyonu

### Matcher Seçenekleri

```typescript
export const config = {
  matcher: [
    // Belirli rotalar
    "/dashboard/:path*",
    
    // Regex pattern
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    
    // Negatif lookahead
    "/((?!public).*)",
  ],
};
```

### Runtime Seçenekleri

```typescript
export const config = {
  matcher: "/api/:path*",
  runtime: "edge", // Edge runtime
};
```

---

## 🧪 Testing

### Middleware Test

```typescript
import { middleware } from "./authMiddleware";
import { NextRequest } from "next/server";

describe("authMiddleware", () => {
  it("should redirect unauthenticated users", async () => {
    const req = new NextRequest(new URL("/dashboard", "http://localhost"));
    const response = await middleware(req);
    
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/");
  });

  it("should allow authenticated users", async () => {
    const req = new NextRequest(new URL("/dashboard", "http://localhost"));
    req.cookies.set("access_token", "valid_token");
    
    const response = await middleware(req);
    
    expect(response.status).toBe(200);
  });
});
```

---

## 📦 Dependencies

- **next/server** - NextRequest, NextResponse
- **jose** (opsiyonel) - JWT validation

---

## 🚀 Best Practices

1. **Minimal Logic**: Middleware'de sadece gerekli mantığı tut
2. **Fast Execution**: Edge runtime için optimize et
3. **Error Handling**: Her zaman hataları yakala
4. **Logging**: Debug için logging ekle
5. **Testing**: Unit test yaz
6. **Security**: Security header'ları ekle
7. **Matcher Precision**: Sadece gerekli rotaları eşleştir
8. **Cookie Security**: HTTP-only, Secure flag'ler kullan

---

## ⚠️ Sınırlamalar

- **Edge Runtime**: Node.js API'lerinin tamamı kullanılamaz
- **Body Access**: Request body'ye erişim sınırlı
- **Database**: Direkt veritabanı erişimi yok (Edge'de)
- **File System**: Dosya sistemi erişimi yok

---

## 📝 Middleware Oluşturma Rehberi

1. **Dosya Oluştur**: `middlewares/` klasöründe
2. **Export**: `middleware` fonksiyonunu export et
3. **Config**: `matcher` tanımla
4. **Test**: Unit test yaz
5. **Deploy**: Vercel Edge'de otomatik çalışır
