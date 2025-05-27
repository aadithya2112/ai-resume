"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  initialCount?: number;
}

export function NotificationBadge({
  initialCount = 0,
}: NotificationBadgeProps) {
  // Use client-side state to manage notification count
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(initialCount);

  // Only show the component after it's mounted on the client
  useEffect(() => {
    setMounted(true);
    // In a real app, you might fetch the actual notification count here
    // For now, we'll just use the initial count
  }, []);

  // Don't render anything during SSR
  if (!mounted) return null;

  // Only render on the client
  return count > 0 ? (
    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs flex items-center justify-center">
      {count}
    </Badge>
  ) : null;
}
