"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { FaSearch, FaBell, FaFilter, FaPlus } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationBadge } from "@/components/notification-badge";
import { ClientUserButton } from "@/components/client-user-button";
import { UserButton, useUser } from "@clerk/nextjs";

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
}

export function DashboardHeader({ sidebarCollapsed }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user } = useUser();
  console.log("User data in DashboardHeader:", user);

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 z-30 transition-all duration-300 ${
        sidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Section */}
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search resumes, templates, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-slate-200 dark:border-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FaFilter className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Create Button */}
          <Link href="/create">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg">
              <FaPlus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <FaBell className="w-5 h-5" />
                <NotificationBadge initialCount={3} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <DropdownMenuLabel className="text-slate-900 dark:text-white">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
              <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:bg-slate-50 dark:focus:bg-slate-700">
                <div className="flex items-start space-x-3">
                  <HiSparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">ATS Score Improved</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your "Software Engineer" resume scored 94%
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Show user button but the text colour should be black for light mode and white for dark mode */}
          <div className="hidden md:flex flex-row items-center justify-center px-3 text-slate-900 dark:text-white space-x-2">
            {/* Username from clerk */}
            <span className="font-semibold text-sm">{user?.firstName}</span>
            <ClientUserButton />
          </div>
          {/* <UserButton showName /> */}
        </div>
      </div>
    </header>
  );
}
