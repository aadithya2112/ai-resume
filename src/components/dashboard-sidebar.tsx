"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaHome,
  FaFileAlt,
  FaUser,
  FaBolt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { HiTemplate, HiSparkles } from "react-icons/hi";
import { useClerk } from "@clerk/nextjs";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: string;
  onClick?: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { openUserProfile } = useClerk();

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: FaHome, href: "/dashboard" },
    {
      id: "cover-letter",
      label: "Cover Letters",
      icon: HiTemplate,
      href: "/dashboard/cover-letter",
    },
  ];

  const bottomItems: MenuItem[] = [
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
      onClick: () => openUserProfile(),
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700/50 transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FaBolt className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
            <FaBolt className="w-6 h-6 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          {collapsed ? (
            <FaChevronRight className="w-4 h-4" />
          ) : (
            <FaChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const content = (
            <div
              className={`group relative flex items-center ${
                collapsed ? "p-3" : "p-3"
              } rounded-lg transition-all duration-200 cursor-pointer ${
                collapsed ? "justify-center" : "space-x-3"
              } ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600/30 border border-transparent"
              }`}
              onClick={() => {
                setActiveItem(item.id);
                if (item.onClick) item.onClick();
              }}
            >
              {/* Glowing active indicator */}
              {activeItem === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full"></div>
              )}

              <item.icon
                className={`transition-colors ${
                  collapsed ? "w-6 h-6" : "w-5 h-5"
                } ${
                  activeItem === item.id
                    ? "text-blue-500"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white"
                }`}
              />

              {!collapsed && (
                <>
                  <span
                    className={`flex-1 font-medium transition-colors ${
                      activeItem === item.id
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        item.badge === "New"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-16 bg-slate-900 dark:bg-slate-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );

          return item.href ? (
            <Link key={item.id} href={item.href}>
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
        {bottomItems.map((item) => {
          const content = (
            <div
              className={`group relative flex items-center ${
                collapsed ? "p-3" : "p-3"
              } rounded-lg transition-all duration-200 cursor-pointer ${
                collapsed ? "justify-center" : "space-x-3"
              } ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600/30 border border-transparent"
              }`}
              onClick={() => {
                setActiveItem(item.id);
                if (item.onClick) item.onClick();
              }}
            >
              <item.icon
                className={`transition-colors ${
                  collapsed ? "w-6 h-6" : "w-5 h-5"
                } ${
                  activeItem === item.id
                    ? "text-blue-500"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white"
                }`}
              />

              {!collapsed && (
                <span
                  className={`flex-1 font-medium transition-colors ${
                    activeItem === item.id
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-16 bg-slate-900 dark:bg-slate-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                  {item.label}
                </div>
              )}
            </div>
          );

          return item.href ? (
            <Link key={item.id} href={item.href}>
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
