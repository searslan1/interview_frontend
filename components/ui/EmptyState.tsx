"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  };
  children?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}: EmptyStateProps) {
  return (
    <Card className={`p-8 ${className || ""}`}>
      <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
        {Icon && (
          <div className="p-4 rounded-full bg-muted/50">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && (
          <Button
            variant={action.variant || "default"}
            onClick={action.onClick}
            size="sm"
          >
            {action.label}
          </Button>
        )}

        {children}
      </div>
    </Card>
  );
}

export default EmptyState;