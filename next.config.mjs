let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== ESLint & TypeScript =====
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // ===== Image Optimization =====
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
    ],
    // Görsel boyutları için önceden tanımlanmış setler
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // WebP ve AVIF formatları için otomatik dönüşüm
    formats: ['image/avif', 'image/webp'],
    // Cache süresini artır (1 yıl)
    minimumCacheTTL: 31536000,
  },

  // ===== Compiler Optimizations =====
  compiler: {
    // Production'da console.log'ları kaldır
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ===== Experimental Features =====
  experimental: {
    // Paralel build işlemleri
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    // Optimized package imports
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'framer-motion',
      '@tanstack/react-query',
      'date-fns',
    ],
  },

  // ===== Headers - Security & Caching =====
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        // Statik dosyalar için agresif caching
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Font dosyaları için caching
        source: '/:path*.woff2',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ===== Redirects =====
  async redirects() {
    return [
      // www olmayan versiyona yönlendir (production'da)
      // { source: '/:path*', has: [{ type: 'host', value: 'www.example.com' }], destination: 'https://example.com/:path*', permanent: true },
    ]
  },

  // ===== Powered By Header'ı Kaldır =====
  poweredByHeader: false,

  // ===== Strict Mode =====
  reactStrictMode: true,

  // ===== Output Configuration =====
  // Standalone output for Docker deployments
  // output: 'standalone',

  // ===== Logging =====
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
