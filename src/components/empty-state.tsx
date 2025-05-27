"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus, FaFileAlt, FaRocket } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 border-dashed max-w-md"></Card>
    </div>
  );
}
