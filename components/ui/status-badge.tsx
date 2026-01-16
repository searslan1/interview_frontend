"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Video, 
  AlertCircle,
  Sparkles,
  PlayCircle,
  FileCheck,
  Shield
} from "lucide-react";

// ============================================
// STATUS TYPES
// ============================================

// Application Status Types
export type ApplicationStatus = 
  | "pending"
  | "otp_verified"
  | "in_progress"
  | "completed"
  | "rejected"
  | "accepted"
  | "awaiting_video_responses"
  | "awaiting_ai_analysis";

// Interview Status Types
export type InterviewStatus = 
  | "draft"
  | "active"
  | "published"
  | "completed"
  | "archived";

// Generic Status (for custom use)
export type GenericStatus = 
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

// Combined Status Type
export type StatusType = ApplicationStatus | InterviewStatus | GenericStatus;

// ============================================
// STATUS CONFIGURATIONS
// ============================================

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "purple" | "cyan";
}

const applicationStatusConfig: Record<ApplicationStatus, StatusConfig> = {
  pending: {
    label: "Beklemede",
    icon: <Clock className="h-3 w-3" />,
    variant: "warning",
  },
  otp_verified: {
    label: "OTP Doğrulandı",
    icon: <Shield className="h-3 w-3" />,
    variant: "cyan",
  },
  in_progress: {
    label: "Devam Ediyor",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    variant: "info",
  },
  completed: {
    label: "Tamamlandı",
    icon: <FileCheck className="h-3 w-3" />,
    variant: "success",
  },
  rejected: {
    label: "Reddedildi",
    icon: <XCircle className="h-3 w-3" />,
    variant: "error",
  },
  accepted: {
    label: "Kabul Edildi",
    icon: <CheckCircle2 className="h-3 w-3" />,
    variant: "success",
  },
  awaiting_video_responses: {
    label: "Video Bekleniyor",
    icon: <Video className="h-3 w-3" />,
    variant: "purple",
  },
  awaiting_ai_analysis: {
    label: "AI Analizi Bekleniyor",
    icon: <Sparkles className="h-3 w-3 animate-pulse" />,
    variant: "purple",
  },
};

const interviewStatusConfig: Record<InterviewStatus, StatusConfig> = {
  draft: {
    label: "Taslak",
    icon: <FileCheck className="h-3 w-3" />,
    variant: "neutral",
  },
  active: {
    label: "Aktif",
    icon: <PlayCircle className="h-3 w-3" />,
    variant: "success",
  },
  published: {
    label: "Yayında",
    icon: <CheckCircle2 className="h-3 w-3" />,
    variant: "success",
  },
  completed: {
    label: "Tamamlandı",
    icon: <FileCheck className="h-3 w-3" />,
    variant: "info",
  },
  archived: {
    label: "Arşivlendi",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "neutral",
  },
};

const genericStatusConfig: Record<GenericStatus, StatusConfig> = {
  success: {
    label: "Başarılı",
    icon: <CheckCircle2 className="h-3 w-3" />,
    variant: "success",
  },
  warning: {
    label: "Uyarı",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "warning",
  },
  error: {
    label: "Hata",
    icon: <XCircle className="h-3 w-3" />,
    variant: "error",
  },
  info: {
    label: "Bilgi",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "info",
  },
  neutral: {
    label: "Nötr",
    icon: <Clock className="h-3 w-3" />,
    variant: "neutral",
  },
};

// ============================================
// BADGE VARIANTS
// ============================================

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
        warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
        error: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/25",
        info: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
        neutral: "bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/25",
        purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
        cyan: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5 gap-1",
        default: "text-xs px-2.5 py-1 gap-1.5",
        lg: "text-sm px-3 py-1.5 gap-2",
      },
      style: {
        soft: "", // Default - uses bg-color/15
        solid: "", // Solid background
        outline: "bg-transparent", // Only border
      },
    },
    compoundVariants: [
      // Solid variants
      { variant: "success", style: "solid", className: "bg-emerald-500 text-white border-emerald-600" },
      { variant: "warning", style: "solid", className: "bg-amber-500 text-white border-amber-600" },
      { variant: "error", style: "solid", className: "bg-red-500 text-white border-red-600" },
      { variant: "info", style: "solid", className: "bg-blue-500 text-white border-blue-600" },
      { variant: "neutral", style: "solid", className: "bg-gray-500 text-white border-gray-600" },
      { variant: "purple", style: "solid", className: "bg-purple-500 text-white border-purple-600" },
      { variant: "cyan", style: "solid", className: "bg-cyan-500 text-white border-cyan-600" },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "default",
      style: "soft",
    },
  }
);

// ============================================
// COMPONENT
// ============================================

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>,
    VariantProps<typeof statusBadgeVariants> {
  status: StatusType;
  showIcon?: boolean;
  customLabel?: string;
  type?: "application" | "interview" | "generic";
  badgeStyle?: "soft" | "solid" | "outline";
}

function getStatusConfig(status: StatusType, type?: "application" | "interview" | "generic"): StatusConfig {
  // Check application status first
  if (status in applicationStatusConfig) {
    return applicationStatusConfig[status as ApplicationStatus];
  }
  
  // Check interview status
  if (status in interviewStatusConfig) {
    return interviewStatusConfig[status as InterviewStatus];
  }
  
  // Check generic status
  if (status in genericStatusConfig) {
    return genericStatusConfig[status as GenericStatus];
  }
  
  // Fallback
  return {
    label: status,
    icon: <Clock className="h-3 w-3" />,
    variant: "neutral",
  };
}

export function StatusBadge({
  status,
  showIcon = true,
  customLabel,
  type,
  size,
  badgeStyle,
  className,
  ...props
}: StatusBadgeProps) {
  const config = getStatusConfig(status, type);
  
  return (
    <span
      className={cn(
        statusBadgeVariants({ variant: config.variant, size, style: badgeStyle }),
        className
      )}
      {...props}
    >
      {showIcon && config.icon}
      <span>{customLabel || config.label}</span>
    </span>
  );
}

// ============================================
// EXPORTS
// ============================================

export { statusBadgeVariants };
