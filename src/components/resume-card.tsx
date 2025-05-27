"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { toast } from "sonner";
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  User,
  TrendingUp,
  Briefcase,
  BookOpen,
  Code,
  Layers,
} from "lucide-react";

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    jobRole?: string;
    lastEdited: string;
    atsScore: number;
    status: "draft" | "complete" | "shared";
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
  };
  onDelete?: (resumeId: string) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10";
    if (score >= 80) return "text-blue-600 bg-blue-50 dark:bg-blue-500/10";
    if (score >= 70) return "text-amber-600 bg-amber-50 dark:bg-amber-500/10";
    return "text-red-600 bg-red-50 dark:bg-red-500/10";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
      case "shared":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }

      toast.success("Resume deleted successfully");
      setShowDeleteDialog(false);

      if (onDelete) {
        onDelete(resume.id);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5">
        <Link href={`/resume/${resume.id}`} className="block h-full">
          <CardContent className="p-4 sm:p-5 flex flex-col h-full">
            {/* Header with action buttons in a separate row */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors pr-2">
                {resume.title}
              </h3>

              {/* Action buttons row - properly spaced */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Badge
                  className={`text-xs px-2 py-0.5 ${getStatusStyle(
                    resume.status
                  )}`}
                >
                  {resume.status}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 opacity-70 group-hover:opacity-100 transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  >
                    <DropdownMenuItem
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/resume/${resume.id}`;
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 focus:bg-red-50 dark:focus:bg-red-500/20"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Job Role and User Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
              {resume.jobRole && (
                <div className="flex items-center">
                  <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{resume.jobRole}</span>
                </div>
              )}

              {resume.personalInfo && (
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {resume.personalInfo.fullName}
                  </span>
                </div>
              )}
            </div>

            {/* Main content section - grows to fill available space */}
            <div className="flex-1 flex flex-col justify-between">
              {/* ATS Score - More compact design */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ATS Score
                    </span>
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(
                      resume.atsScore
                    )}`}
                  >
                    {resume.atsScore}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      resume.atsScore >= 90
                        ? "bg-emerald-500"
                        : resume.atsScore >= 80
                        ? "bg-blue-500"
                        : resume.atsScore >= 70
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${resume.atsScore}%` }}
                  />
                </div>
              </div>

              {/* Sections Summary - Redesigned as a grid for better space usage */}
              <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Content Sections
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-3 h-3 mr-1.5 text-blue-500" />
                    <span>Education:</span>
                    <span className="ml-auto font-medium">
                      {resume.sections.education}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <Briefcase className="w-3 h-3 mr-1.5 text-blue-500" />
                    <span>Experience:</span>
                    <span className="ml-auto font-medium">
                      {resume.sections.experience}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <Code className="w-3 h-3 mr-1.5 text-blue-500" />
                    <span>Skills:</span>
                    <span className="ml-auto font-medium">
                      {resume.sections.skills}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <Layers className="w-3 h-3 mr-1.5 text-blue-500" />
                    <span>Projects:</span>
                    <span className="ml-auto font-medium">
                      {resume.sections.projects}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer - Always at bottom */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-1">
                <Calendar className="w-3 h-3 mr-1.5" />
                Last edited {resume.lastEdited}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resume.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
