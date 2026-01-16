/**
 * Application Constants
 * Merkezi sabit değerler - performans ve tutarlılık için
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000/api",
  TIMEOUT: 30000, // 30 saniye
  RETRY_ATTEMPTS: 3,
} as const;

// Cache Times (milliseconds)
export const CACHE_TIMES = {
  STALE_TIME: 5 * 60 * 1000,      // 5 dakika
  GC_TIME: 30 * 60 * 1000,        // 30 dakika
  SHORT_CACHE: 60 * 1000,          // 1 dakika
  LONG_CACHE: 60 * 60 * 1000,      // 1 saat
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Query Keys - React Query için merkezi key yönetimi
export const QUERY_KEYS = {
  // Interviews
  interviews: ["interviews"] as const,
  interview: (id: string) => ["interview", id] as const,
  interviewApplications: (id: string) => ["interview", id, "applications"] as const,
  
  // Applications
  applications: ["applications"] as const,
  application: (id: string) => ["application", id] as const,
  
  // Auth
  user: ["user"] as const,
  
  // Dashboard
  dashboardStats: ["dashboard", "stats"] as const,
  recentActivity: ["dashboard", "activity"] as const,
} as const;

// Application Status Colors
export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  otp_verified: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  awaiting_video_responses: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  awaiting_ai_analysis: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
} as const;

// Interview Status Colors
export const INTERVIEW_STATUS_COLORS = {
  active: "bg-green-500 text-white",
  completed: "bg-gray-500 text-white",
  published: "bg-blue-500 text-white",
  draft: "bg-yellow-500 text-white",
  inactive: "bg-red-500 text-white",
} as const;

// Date Format Options
export const DATE_FORMATS = {
  short: { day: "2-digit", month: "2-digit", year: "numeric" } as const,
  long: { day: "numeric", month: "long", year: "numeric" } as const,
  withTime: { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  } as const,
} as const;

// Breakpoints (Tailwind ile uyumlu)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_AI_ANALYSIS: true,
  ENABLE_VIDEO_RESPONSES: true,
  ENABLE_PERSONALITY_TEST: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
} as const;
