"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus, FaFileAlt, FaRocket } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 border-dashed max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
          {/* Illustration */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full flex items-center justify-center">
              <FaFileAlt className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center animate-pulse">
              <HiSparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Create Your First Resume
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
            Get started with our AI-powered resume builder. Choose from
            professional templates and optimize for ATS systems.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/create">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                <FaPlus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <FaRocket className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <HiSparkles className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                AI-Powered
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Smart suggestions
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FaFileAlt className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                ATS Optimized
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Beat the bots
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FaRocket className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Professional
              </p>
              <p className="text-slate-500 dark:text-slate-400">Stand out</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
