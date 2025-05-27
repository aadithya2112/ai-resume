"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { ResumeCard } from "@/components/resume-card";
import { EmptyState } from "@/components/empty-state";
import { FaPlus, FaTh, FaList, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Resume {
  id: string;
  title: string;
  jobRole?: string;
  lastEdited: string;
  atsScore: number;
  status: "complete" | "draft" | "shared";
  personalInfo?: {
    fullName: string;
    email: string;
  };
  sections: {
    education: number;
    experience: number;
    skills: number;
    projects: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();

  // Fetch resumes from database
  useEffect(() => {
    const fetchResumes = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        setLoading(true);
        const response = await fetch("/api/resumes/user");

        if (!response.ok) {
          throw new Error("Failed to fetch resumes");
        }

        const data = await response.json();
        setResumes(data.resumes);
      } catch (err) {
        console.error("Error fetching resumes:", err);
        setError("Failed to load resumes. Please try again.");
        toast.error("Failed to load resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [isLoaded, isSignedIn]);

  // Calculate average ATS score
  const averageAtsScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((sum, resume) => sum + resume.atsScore, 0) /
            resumes.length
        )
      : 0;

  // Handle resume deletion
  const handleResumeDelete = (resumeId: string) => {
    setResumes((prevResumes) =>
      prevResumes.filter((resume) => resume.id !== resumeId)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Header */}
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {isLoaded && isSignedIn ? user.firstName : "User"}
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Ready to create something amazing?
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <FaSpinner className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Loading your resumes...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Resumes Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">
                      My Resumes
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
                      {resumes.length > 0 && (
                        <>
                          {" • "}
                          Average ATS Score:{" "}
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {averageAtsScore}%
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={
                          viewMode === "grid"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }
                      >
                        <FaTh className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={
                          viewMode === "list"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }
                      >
                        <FaList className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {resumes.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                        : "space-y-4"
                    }
                  >
                    {resumes.map((resume) => (
                      <ResumeCard
                        key={resume.id}
                        resume={resume}
                        onDelete={handleResumeDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Link href="/create">
        <Button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all z-50 hover:scale-110"
          size="icon"
        >
          <FaPlus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
