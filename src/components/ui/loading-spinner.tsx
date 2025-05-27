"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={cn(
        "rounded-full border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
