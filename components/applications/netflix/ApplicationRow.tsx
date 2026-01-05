"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApplicationRowProps<T> {
  title: string;
  subtitle?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
  showCount?: boolean;
}

export function ApplicationRow<T>({
  title,
  subtitle,
  items,
  renderItem,
  className,
  emptyMessage = "Henüz veri bulunmuyor",
  showCount = true,
}: ApplicationRowProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className={cn("mb-8", className)}>
        <div className="flex items-baseline gap-3 mb-4 px-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className="px-4">
          <p className="text-muted-foreground text-sm py-8 text-center bg-muted/30 rounded-lg">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mb-8 group/row", className)}>
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-4 px-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
          {showCount && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Row */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 
                       bg-gradient-to-r from-background via-background/80 to-transparent 
                       rounded-none opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {/* Items Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 
                     scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-start"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && items.length > 3 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 
                       bg-gradient-to-l from-background via-background/80 to-transparent 
                       rounded-none opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
}
