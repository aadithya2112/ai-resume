"use client";

import { useEffect, useState } from "react";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";

interface ClientUserButtonProps {
  afterSignOutUrl?: string;
}

export function ClientUserButton({
  afterSignOutUrl = "/",
}: ClientUserButtonProps) {
  const [mounted, setMounted] = useState(false);

  // Only show the component after it's mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
    );
  }

  // Only render on the client
  return (
    <ClerkUserButton
      afterSignOutUrl={afterSignOutUrl}
      appearance={{
        elements: {
          userButtonAvatarBox: "w-8 h-8",
          userButtonBox: "focus:shadow-none",
        },
      }}
    />
  );
}
