"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FaRobot,
  FaPaperPlane,
  FaDownload,
  FaShare,
  FaSave,
  FaArrowLeft,
  FaMagic,
  FaEye,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaHistory,
  FaSearch,
  FaPlus,
  FaMinus,
  FaSpinner,
  FaSync,
  FaCode,
  FaCopy,
  FaStar,
  FaEdit,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { toast } from "sonner";
import Link from "next/link";
import { ResumePreview } from "@/components/create-resume/resume-preview";
import {
  calculateATSScore,
  getATSScoreColor,
  getATSScoreBackground,
  type ATSScore,
} from "@/lib/ats-scoring";
import { generateLatexFromResumeData } from "@/lib/latex-templates";
import type { ResumeData } from "@/components/create-resume/resume-preview";
import { AnimatePresence, motion } from "framer-motion";

// Extended PersonalInfo interface to include additional fields
interface ExtendedPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
  jobRole?: string;
}

// Extended ResumeData interface with our additional fields
interface ExtendedResumeData extends Omit<ResumeData, "personalInfo"> {
  personalInfo: ExtendedPersonalInfo;
}

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "suggestion" | "improvement" | "general";
}

export default function ResumeViewEditPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const [resumeData, setResumeData] = useState<ExtendedResumeData | null>(null);
  const [latexCode, setLatexCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingLatex, setIsEditingLatex] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [isUpdatingPreview, setIsUpdatingPreview] = useState(false);
  const [previewNeedsUpdate, setPreviewNeedsUpdate] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const [aiPanel, setAiPanel] = useState<"chat" | "suggestions">("chat");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Predefined AI suggestions
  const aiSuggestions = [
    "Help me improve my resume format",
    "Make my work experience more impactful",
    "Add more relevant keywords for ATS",
    "Optimize my resume for a specific job role",
    "Improve my skills section",
  ];

  // Load resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/resumes/${resumeId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch resume");
        }

        const data = await response.json();

        // Transform database data to ExtendedResumeData format
        const transformedData: ExtendedResumeData = {
          personalInfo: {
            firstName: data.resume.personalInfo?.fullName?.split(" ")[0] || "",
            lastName:
              data.resume.personalInfo?.fullName
                ?.split(" ")
                .slice(1)
                .join(" ") || "",
            email: data.resume.personalInfo?.email || "",
            phone: data.resume.personalInfo?.phone || "",
            location: data.resume.personalInfo?.location || "",
            linkedin: data.resume.personalInfo?.linkedin || "",
            website: data.resume.personalInfo?.website || "",
            github: data.resume.personalInfo?.github || "",
            jobRole: data.resume.jobRole || "",
          },
          professionalSummary: data.resume.personalInfo?.summary || "",
          workExperience: data.resume.experienceItems.map((exp: any) => ({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            location: exp.location,
            description: exp.description,
            current: exp.isCurrentRole || false, // Map isCurrentRole to current for UI
            id: exp.id || `exp-${Math.random().toString(36).substr(2, 9)}`, // Ensure each item has an ID
          })),
          education: data.resume.educationItems.map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            field: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: edu.gpa,
            location: edu.location,
          })),
          skills: {
            technical: data.resume.skills
              .filter((s: any) => s.category === "Technical Skills")
              .map((s: any) => s.name),
            soft: data.resume.skills
              .filter((s: any) => s.category === "Soft Skills")
              .map((s: any) => s.name),
            languages: data.resume.skills
              .filter((s: any) => s.category === "Languages")
              .map((s: any) => s.name),
          },
          projects: data.resume.projectItems.map((proj: any) => ({
            name: proj.name,
            description: proj.description,
            technologies: proj.technologies,
            url: proj.url,
            github: proj.github,
            startDate: proj.startDate,
            endDate: proj.endDate,
          })),
          selectedTemplate: data.resume.latexCode || "modern",
        };

        setResumeData(transformedData);

        // Generate LaTeX code if it doesn't exist, is empty, or is just a template name
        let latexCodeToUse = data.resume.latexCode;
        if (
          !latexCodeToUse ||
          latexCodeToUse.trim().length === 0 ||
          latexCodeToUse === "modern" ||
          latexCodeToUse === "classic" ||
          !latexCodeToUse.includes("\\")
        ) {
          latexCodeToUse = generateLatexFromResumeData(
            transformedData,
            transformedData.selectedTemplate
          );
        }
        setLatexCode(latexCodeToUse);
        setLastSaved(new Date(data.resume.updatedAt || Date.now()));

        // Calculate ATS score (convert to base ResumeData format)
        const baseResumeData: ResumeData = {
          ...transformedData,
          personalInfo: {
            firstName: transformedData.personalInfo.firstName,
            lastName: transformedData.personalInfo.lastName,
            email: transformedData.personalInfo.email,
            phone: transformedData.personalInfo.phone,
            location: transformedData.personalInfo.location,
            linkedin: transformedData.personalInfo.linkedin,
            website: transformedData.personalInfo.website,
          },
        };
        const score = calculateATSScore(baseResumeData);
        setAtsScore(score);
      } catch (error) {
        console.error("Error fetching resume:", error);
        toast.error("Failed to load resume");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchResume();
    }
  }, [resumeId, router]);

  // Add effect to update the preview when switching tabs
  useEffect(() => {
    if (activeTab === "preview" && previewNeedsUpdate) {
      parseLatexAndUpdatePreview();
      setPreviewNeedsUpdate(false);
    }
  }, [activeTab, previewNeedsUpdate]);

  const handleSave = async () => {
    if (!resumeData) return;

    try {
      setSaving(true);

      // Prepare the complete resume object that the API expects
      const updateData = {
        personalInfo: {
          firstName: resumeData.personalInfo.firstName,
          lastName: resumeData.personalInfo.lastName,
          fullName:
            `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim(),
          email: resumeData.personalInfo.email || "",
          phone: resumeData.personalInfo.phone || "",
          location: resumeData.personalInfo.location || "",
          linkedin: resumeData.personalInfo.linkedin || "",
          website: resumeData.personalInfo.website || "",
          github: resumeData.personalInfo.github || "",
          jobRole: resumeData.personalInfo.jobRole || "",
          summary: resumeData.professionalSummary || "",
        },
        professionalSummary: resumeData.professionalSummary || "",
        selectedTemplate: resumeData.selectedTemplate || "modern",
        latexCode: latexCode, // Explicitly include LaTeX code in the save
        projectItems: resumeData.projects || [],
        projects: resumeData.projects || [],
        education: resumeData.education || [],
        workExperience: resumeData.workExperience || [],
        skills: resumeData.skills || { technical: [], soft: [], languages: [] },
      };

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to save resume");
      }

      setLastSaved(new Date());
      toast.success("Resume saved successfully!");

      // Recalculate ATS score
      const baseResumeData: ResumeData = {
        ...resumeData,
        personalInfo: {
          firstName: resumeData.personalInfo.firstName,
          lastName: resumeData.personalInfo.lastName,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          location: resumeData.personalInfo.location,
          linkedin: resumeData.personalInfo.linkedin,
          website: resumeData.personalInfo.website,
        },
      };
      const score = calculateATSScore(baseResumeData);
      setAtsScore(score);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const saveLatexCode = async (newLatexCode: string) => {
    if (!resumeData) {
      toast.error("Failed to save LaTeX changes: Resume data not available");
      return;
    }

    try {
      // Prepare the complete resume object that the API expects
      const updateData = {
        personalInfo: {
          firstName: resumeData.personalInfo.firstName,
          lastName: resumeData.personalInfo.lastName,
          fullName:
            `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim(),
          email: resumeData.personalInfo.email || "",
          phone: resumeData.personalInfo.phone || "",
          location: resumeData.personalInfo.location || "",
          linkedin: resumeData.personalInfo.linkedin || "",
          website: resumeData.personalInfo.website || "",
          github: resumeData.personalInfo.github || "",
          jobRole: resumeData.personalInfo.jobRole || "",
          summary: resumeData.professionalSummary || "",
        },
        professionalSummary: resumeData.professionalSummary || "",
        selectedTemplate: resumeData.selectedTemplate || "modern",
        latexCode: newLatexCode,
        projectItems: resumeData.projects || [],
        projects: resumeData.projects || [],
        education: resumeData.education || [],
        workExperience: resumeData.workExperience || [],
        skills: resumeData.skills || { technical: [], soft: [], languages: [] },
      };

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "Failed to save LaTeX code: " +
            (errorData.error || response.statusText)
        );
      }

      setLastSaved(new Date());
      setPreviewNeedsUpdate(true);
      toast.success("LaTeX code saved successfully!");
    } catch (error) {
      console.error("Error saving LaTeX code:", error);
      toast.error("Failed to save LaTeX changes");
    }
  };

  const handleAIChat = async () => {
    if (!userInput.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setAiMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsAIThinking(true);

    try {
      // Ensure we have proper LaTeX code before proceeding
      let currentLatexCode = latexCode;

      // If the current LaTeX code is just a template name or too short, generate proper LaTeX
      if (
        !currentLatexCode ||
        currentLatexCode.trim().length < 20 ||
        currentLatexCode === "modern" ||
        currentLatexCode === "classic" ||
        !currentLatexCode.includes("\\")
      ) {
        currentLatexCode = generateLatexFromResumeData(
          resumeData,
          resumeData?.selectedTemplate
        );
        setLatexCode(currentLatexCode);
        await saveLatexCode(currentLatexCode);
      }

      // Use LaTeX editor API if we have LaTeX code (and it's substantial), otherwise use resume improvement API
      if (
        currentLatexCode &&
        currentLatexCode.length > 20 &&
        currentLatexCode.includes("\\")
      ) {
        const response = await fetch("/api/ai/latex-editor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latexCode: currentLatexCode,
            prompt: userInput,
          }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));

          if (response.status === 401) {
            throw new Error("Authentication failed. Please sign in again.");
          } else if (response.status === 429) {
            throw new Error(
              "AI service is currently at capacity. Please try again in a few minutes."
            );
          } else if (response.status === 500) {
            throw new Error(
              `AI service error: ${
                errorData.error || "Service temporarily unavailable"
              }`
            );
          } else {
            throw new Error(
              `AI LaTeX editor unavailable (${response.status}): ${
                errorData.error || "Unknown error"
              }`
            );
          }
        }

        const data = await response.json();

        if (!data.success || !data.latexCode) {
          throw new Error("AI service returned invalid response");
        }

        const aiMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I've updated your resume LaTeX code based on your request: "${userInput}"

**Changes Made:**
${data.summary || "Enhanced content according to your instructions"}

The changes have been applied to your LaTeX code and saved automatically. You can view the updated code in the "LaTeX Code" tab.`,
          timestamp: new Date(),
          type: "improvement",
        };

        setAiMessages((prev) => [...prev, aiMessage]);
        setLatexCode(data.latexCode);
        await saveLatexCode(data.latexCode);
        setPreviewNeedsUpdate(true);

        // Parse the updated LaTeX code to update the resume data for the preview
        try {
          const { parseLatexToData } = await import("@/lib/latex-parser");
          const parsedData = parseLatexToData(data.latexCode);

          // Update resume data with the parsed content
          if (parsedData && resumeData) {
            // Create updated data by merging parsed LaTeX data with current data
            const updatedResumeData = {
              ...resumeData,
              personalInfo: {
                ...resumeData.personalInfo,
                ...(parsedData.personalInfo || {}),
              },
              // Use parsed data if available, otherwise keep existing data
              education:
                parsedData.education?.length > 0
                  ? parsedData.education
                  : resumeData.education,
              workExperience:
                parsedData.workExperience?.length > 0
                  ? parsedData.workExperience.map((exp: any, i: number) => ({
                      ...exp,
                      id: exp.id || `exp-${i}`,
                    }))
                  : resumeData.workExperience,
              projects:
                parsedData.projects?.length > 0
                  ? parsedData.projects
                  : resumeData.projects,
              skills: {
                technical:
                  parsedData.skills?.technical?.length > 0
                    ? parsedData.skills.technical
                    : resumeData.skills.technical,
                soft:
                  parsedData.skills?.soft?.length > 0
                    ? parsedData.skills.soft
                    : resumeData.skills.soft,
                languages:
                  parsedData.skills?.languages?.length > 0
                    ? parsedData.skills.languages
                    : resumeData.skills.languages,
              },
              professionalSummary:
                parsedData.professionalSummary ||
                resumeData.professionalSummary,
            };

            // Update state with parsed data
            setResumeData(updatedResumeData);
          }
        } catch (parseError) {
          console.error("Failed to parse LaTeX into preview data:", parseError);
        }

        toast.success("Resume LaTeX updated with AI suggestions!");
      } else {
        // Fallback to resume improvement API
        const response = await fetch("/api/ai/resume-improvement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeData,
            userPrompt: userInput,
            atsScore: atsScore?.score,
          }),
        });

        if (!response.ok) {
          throw new Error("AI service unavailable");
        }

        const data = await response.json();

        const aiMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          type: data.type || "general",
        };

        setAiMessages((prev) => [...prev, aiMessage]);

        // If AI suggests changes, apply them
        if (data.updatedResumeData) {
          setResumeData(data.updatedResumeData);
          const baseResumeData: ResumeData = {
            ...data.updatedResumeData,
            personalInfo: {
              firstName: data.updatedResumeData.personalInfo.firstName,
              lastName: data.updatedResumeData.personalInfo.lastName,
              email: data.updatedResumeData.personalInfo.email,
              phone: data.updatedResumeData.personalInfo.phone,
              location: data.updatedResumeData.personalInfo.location,
              linkedin: data.updatedResumeData.personalInfo.linkedin,
              website: data.updatedResumeData.personalInfo.website,
            },
          };
          const newScore = calculateATSScore(baseResumeData);
          setAtsScore(newScore);
          toast.success("Resume updated with AI suggestions!");
        }
      }
    } catch (error) {
      console.error("Error with AI chat:", error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error
            ? `I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`
            : "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAIThinking(false);
    }
  };

  // Function to parse LaTeX code and update the preview
  const parseLatexAndUpdatePreview = async () => {
    if (!latexCode || !resumeData) return false;

    setIsUpdatingPreview(true);
    try {
      // Import the parser when needed
      const { parseLatexToData } = await import("@/lib/latex-parser");
      const parsedData = parseLatexToData(latexCode);

      // Update resume data with the parsed content
      if (parsedData) {
        // Create updated data by merging parsed LaTeX data with current data
        const updatedResumeData = {
          ...resumeData,
          personalInfo: {
            ...resumeData.personalInfo,
            ...(parsedData.personalInfo || {}),
          },
          // Use parsed data if available, otherwise keep existing data
          education:
            parsedData.education?.length > 0
              ? parsedData.education
              : resumeData.education,
          workExperience:
            parsedData.workExperience?.length > 0
              ? parsedData.workExperience.map((exp: any, i: number) => ({
                  ...exp,
                  id: exp.id || `exp-${i}`,
                }))
              : resumeData.workExperience,
          projects:
            parsedData.projects?.length > 0
              ? parsedData.projects
              : resumeData.projects,
          skills: {
            technical:
              parsedData.skills?.technical?.length > 0
                ? parsedData.skills.technical
                : resumeData.skills.technical,
            soft:
              parsedData.skills?.soft?.length > 0
                ? parsedData.skills.soft
                : resumeData.skills.soft,
            languages:
              parsedData.skills?.languages?.length > 0
                ? parsedData.skills.languages
                : resumeData.skills.languages,
          },
          professionalSummary:
            parsedData.professionalSummary || resumeData.professionalSummary,
          selectedTemplate: resumeData.selectedTemplate,
        };

        // Update state with parsed data
        setResumeData(updatedResumeData);

        // Switch to preview tab to show changes
        setActiveTab("preview");

        toast.success("Preview updated from LaTeX code");
        return true;
      }
      return false;
    } catch (parseError) {
      console.error("Failed to parse LaTeX into preview data:", parseError);
      toast.error("Failed to update preview: Error parsing LaTeX");
      return false;
    } finally {
      setIsUpdatingPreview(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-emerald-400 to-green-500";
    if (score >= 80) return "from-blue-400 to-cyan-500";
    if (score >= 70) return "from-amber-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setActiveSuggestion(index);
    setUserInput(suggestion);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900">
            <FaSpinner className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">
            Loading Resume
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Preparing your resume data and ATS analysis...
          </p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <FaExclamationTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Resume Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The resume you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              <h1 className="text-xl font-medium text-slate-900 dark:text-white flex items-center">
                {resumeData.personalInfo.firstName}{" "}
                {resumeData.personalInfo.lastName}'s Resume
                {resumeData.personalInfo.jobRole && (
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    {resumeData.personalInfo.jobRole}
                  </Badge>
                )}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {lastSaved && (
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline-block">
                  Last saved: {formatDate(lastSaved)}
                </span>
              )}

              {atsScore && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                        <span className="text-sm font-medium">ATS Score:</span>
                        <div
                          className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${getScoreColor(
                            atsScore.score
                          )} text-white font-medium text-sm`}
                        >
                          {atsScore.score}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-sm">
                        Your resume's compatibility with Applicant Tracking
                        Systems
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-sm"
              >
                {saving ? (
                  <>
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <div className="hidden md:flex">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <FaDownload className="w-4 h-4 mr-2" />
                  Export PDF
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Resume Preview & Editor */}
              <div className="flex-1 min-w-0">
                <Card className="shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* Header with controls in a more intuitive layout */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/10 rounded-full p-2">
                        <FaEye className="w-5 h-5 text-blue-500" />
                      </div>
                      <CardTitle className="text-lg font-medium">
                        Resume Editor
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Move zoom control to the right side */}
                      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-none border-r border-slate-200 dark:border-slate-700"
                          onClick={() =>
                            setZoomLevel(Math.max(0.5, zoomLevel - 0.1))
                          }
                        >
                          <FaMinus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="px-3 py-1 font-medium text-sm">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-none border-l border-slate-200 dark:border-slate-700"
                          onClick={() =>
                            setZoomLevel(Math.min(1.5, zoomLevel + 0.1))
                          }
                        >
                          <FaPlus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Tab navigation with more modern styling */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="border-t border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                      <TabsList className="p-0 h-12 bg-transparent w-full flex rounded-none">
                        <TabsTrigger
                          value="preview"
                          className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:border-t-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <FaEye className="w-4 h-4" />
                            <span className="font-medium">Preview</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="latex"
                          className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:border-t-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <FaCode className="w-4 h-4" />
                            <span className="font-medium">LaTeX Code</span>
                          </div>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="relative">
                      <TabsContent value="preview" className="m-0 p-0">
                        <div className="p-6">
                          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl relative border border-slate-200 dark:border-slate-700 p-6">
                            {isUpdatingPreview && (
                              <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                                <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-xl flex items-center space-x-3">
                                  <div className="animate-spin h-5 w-5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      className="h-5 w-5 text-blue-600"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  </div>
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    Updating preview...
                                  </span>
                                </div>
                              </div>
                            )}

                            {previewNeedsUpdate && (
                              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="bg-amber-100 dark:bg-amber-800/50 p-1.5 rounded-full mr-3">
                                    <FaExclamationTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <span className="text-sm text-amber-800 dark:text-amber-300">
                                    Preview needs to be updated with recent
                                    changes
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={parseLatexAndUpdatePreview}
                                  className="ml-2 bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:hover:bg-amber-700/70 dark:text-amber-200 border-0"
                                >
                                  <FaSync className="w-3 h-3 mr-1" /> Update now
                                </Button>
                              </div>
                            )}

                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-inner">
                              {/* Removed fixed height and overflow to allow natural expansion */}
                              <div
                                className="relative transition-transform duration-300 ease-in-out"
                                style={{
                                  transform: `scale(${zoomLevel})`,
                                  transformOrigin: "top center",
                                }}
                              >
                                {resumeData && (
                                  <ResumePreview
                                    data={resumeData}
                                    templateId={resumeData.selectedTemplate}
                                    latexCode={latexCode}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="latex" className="m-0 p-0">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="bg-indigo-500/10 rounded-full p-1.5">
                                <FaCode className="w-4 h-4 text-indigo-500" />
                              </div>
                              <Label
                                htmlFor="latex-editor"
                                className="text-sm font-medium"
                              >
                                LaTeX Source Code
                              </Label>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={parseLatexAndUpdatePreview}
                                disabled={isUpdatingPreview}
                                className="h-9 border-slate-300 dark:border-slate-600"
                              >
                                <FaSync className="w-3.5 h-3.5 mr-1.5" />
                                Update Preview
                              </Button>

                              <Button
                                variant={isEditingLatex ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setIsEditingLatex(!isEditingLatex)
                                }
                                className={`h-9 ${
                                  isEditingLatex
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                <FaEdit className="w-3.5 h-3.5 mr-1.5" />
                                {isEditingLatex ? "Editing Mode" : "Edit Code"}
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(latexCode);
                                  toast.success(
                                    "LaTeX code copied to clipboard!"
                                  );
                                }}
                                className="h-9 border-slate-300 dark:border-slate-600"
                              >
                                <FaCopy className="w-3.5 h-3.5 mr-1.5" />
                                Copy Code
                              </Button>
                            </div>
                          </div>

                          {/* Improved textarea container */}
                          <div className="relative border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm">
                            <textarea
                              id="latex-editor"
                              value={latexCode}
                              onChange={(e) => {
                                setLatexCode(e.target.value);
                                setPreviewNeedsUpdate(true);
                              }}
                              readOnly={!isEditingLatex}
                              className={`w-full h-full p-5 font-mono text-[15px] leading-relaxed whitespace-pre focus:outline-none focus:ring-0 ${
                                isEditingLatex
                                  ? "bg-white dark:bg-slate-800 shadow-inner"
                                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                              }`}
                              placeholder="LaTeX code will appear here..."
                              spellCheck={false}
                              style={{
                                display: "block",
                                resize: "none",
                                minHeight: "calc(100vh - 300px)", // Dynamic height that takes up available space
                              }}
                            />
                            {!isEditingLatex && (
                              <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
                            )}
                          </div>

                          {isEditingLatex && (
                            <div className="flex items-center justify-between mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                              <div className="flex items-start space-x-3">
                                <div className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full">
                                  <FaLightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  Use AI chat to modify LaTeX code, or edit
                                  directly. Changes will not be saved until you
                                  click 'Save Changes'.
                                </p>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setLatexCode(latexCode);
                                    setIsEditingLatex(false);
                                    setPreviewNeedsUpdate(false);
                                  }}
                                  className="h-8 border-slate-300 bg-white dark:bg-transparent"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    await saveLatexCode(latexCode);
                                    setIsEditingLatex(false);
                                    setPreviewNeedsUpdate(true);
                                  }}
                                  className="h-8 bg-blue-600 hover:bg-blue-700"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>
              </div>

              {/* Sidebar - ATS Score & AI Chat */}
              <div className="md:w-80 lg:w-96 space-y-6">
                {/* ATS Score Card */}
                {atsScore && (
                  <Card>
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-base font-medium flex items-center">
                        <FaChartLine className="w-4 h-4 text-blue-500 mr-2" />
                        <span>ATS Compatibility Score</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-4 pb-2 space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative h-24 w-24 flex items-center justify-center">
                          <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="10"
                              className="dark:stroke-slate-700"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="url(#scoreGradient)"
                              strokeWidth="10"
                              strokeDasharray={`${atsScore.score * 2.83} 283`}
                              strokeDashoffset="0"
                              transform="rotate(-90 50 50)"
                            />
                            <defs>
                              <linearGradient
                                id="scoreGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={
                                    atsScore.score >= 80
                                      ? "#10b981"
                                      : atsScore.score >= 70
                                      ? "#3b82f6"
                                      : atsScore.score >= 60
                                      ? "#f59e0b"
                                      : "#ef4444"
                                  }
                                />
                                <stop
                                  offset="100%"
                                  stopColor={
                                    atsScore.score >= 80
                                      ? "#34d399"
                                      : atsScore.score >= 70
                                      ? "#60a5fa"
                                      : atsScore.score >= 60
                                      ? "#fbbf24"
                                      : "#f87171"
                                  }
                                />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                              {atsScore.score}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm text-slate-600 dark:text-slate-400 px-2">
                        {atsScore.feedback[0]}
                      </div>

                      <Tabs defaultValue="strengths" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger
                            value="strengths"
                            className="text-xs py-1"
                          >
                            Strengths
                          </TabsTrigger>
                          <TabsTrigger
                            value="improvements"
                            className="text-xs py-1"
                          >
                            Improve
                          </TabsTrigger>
                          <TabsTrigger
                            value="feedback"
                            className="text-xs py-1"
                          >
                            Tips
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="strengths"
                          className="space-y-2 mt-3"
                        >
                          <ScrollArea className="h-[180px]">
                            <div className="pr-4 space-y-2">
                              {atsScore.strengths.length > 0 ? (
                                atsScore.strengths.map((strength, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start space-x-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-md"
                                  >
                                    <FaCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                      {strength}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-sm text-slate-500">
                                    No strengths identified yet.
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent
                          value="improvements"
                          className="space-y-2 mt-3"
                        >
                          <ScrollArea className="h-[180px]">
                            <div className="pr-4 space-y-2">
                              {atsScore.improvements.length > 0 ? (
                                atsScore.improvements.map(
                                  (improvement, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md"
                                    >
                                      <FaExclamationTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-slate-700 dark:text-slate-300">
                                        {improvement}
                                      </p>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-sm text-slate-500">
                                    No improvement areas identified.
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent
                          value="feedback"
                          className="space-y-2 mt-3"
                        >
                          <ScrollArea className="h-[180px]">
                            <div className="pr-4 space-y-2">
                              {atsScore.feedback.slice(1).length > 0 ? (
                                atsScore.feedback.slice(1).map((tip, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start space-x-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md"
                                  >
                                    <FaLightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                      {tip}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-sm text-slate-500">
                                    No additional tips available.
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </CardContent>

                    <CardFooter className="pt-0 pb-4 flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setUserInput("How can I improve my ATS score?");
                          setActiveSuggestion(null);
                          handleAIChat();
                        }}
                      >
                        <HiSparkles className="w-3 h-3 mr-1.5 text-amber-500" />
                        <span className="text-xs">Get AI Recommendations</span>
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {/* AI Chat Card */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium flex items-center">
                        <FaRobot className="w-4 h-4 text-purple-500 mr-2" />
                        <span>AI Resume Assistant</span>
                        <HiSparkles className="w-3 h-3 text-yellow-500 ml-1" />
                      </CardTitle>
                      <Tabs
                        value={aiPanel}
                        onValueChange={(value: string) => {
                          if (value === "chat" || value === "suggestions") {
                            setAiPanel(value);
                          }
                        }}
                        className="w-auto"
                      >
                        <TabsList className="h-8">
                          <TabsTrigger value="chat" className="text-xs px-2">
                            Chat
                          </TabsTrigger>
                          <TabsTrigger
                            value="suggestions"
                            className="text-xs px-2"
                          >
                            Quick Help
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 pb-4 flex flex-col relative">
                    <AnimatePresence mode="wait">
                      {aiPanel === "chat" ? (
                        <motion.div
                          key="chat"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col h-[380px]"
                        >
                          <ScrollArea className="flex-1 pr-4 mb-4">
                            <div className="space-y-4">
                              {aiMessages.length === 0 ? (
                                <div className="text-center py-8">
                                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaRobot className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                                  </div>
                                  <h3 className="font-medium text-sm mb-1">
                                    Resume AI Assistant
                                  </h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto">
                                    Ask me anything about improving your resume
                                    or optimizing it for ATS!
                                  </p>
                                </div>
                              ) : (
                                aiMessages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${
                                      message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                        message.role === "user"
                                          ? "bg-blue-500 text-white"
                                          : message.type === "improvement"
                                          ? "bg-green-100 dark:bg-green-900/30 text-slate-800 dark:text-slate-200"
                                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                                      }`}
                                    >
                                      {message.content}
                                      {message.timestamp && (
                                        <div className="mt-1 text-xs opacity-70 text-right">
                                          {message.timestamp.toLocaleTimeString(
                                            [],
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}

                              {isAIThinking && (
                                <div className="flex justify-start">
                                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div
                                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                          style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                          style={{ animationDelay: "0.2s" }}
                                        ></div>
                                      </div>
                                      <span className="text-slate-600 dark:text-slate-400">
                                        AI is thinking...
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </ScrollArea>

                          <div className="flex space-x-2 mt-2">
                            <Input
                              placeholder="Ask AI to improve your resume..."
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleAIChat()
                              }
                              disabled={isAIThinking}
                              className="text-sm"
                            />
                            <Button
                              onClick={handleAIChat}
                              disabled={isAIThinking || !userInput.trim()}
                              size="icon"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              <FaPaperPlane className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="suggestions"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="h-[380px]"
                        >
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">
                              Common Resume Questions
                            </h3>
                            <p className="text-xs text-slate-500 mb-4">
                              Click on any suggestion to get AI help:
                            </p>

                            <div className="space-y-2">
                              {aiSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  onClick={() =>
                                    handleSuggestionClick(suggestion, index)
                                  }
                                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    activeSuggestion === index
                                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800"
                                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                  }`}
                                >
                                  <div className="flex items-start">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                                        activeSuggestion === index
                                          ? "bg-indigo-100 dark:bg-indigo-800"
                                          : "bg-slate-100 dark:bg-slate-700"
                                      }`}
                                    >
                                      {activeSuggestion === index ? (
                                        <FaStar className="w-3 h-3 text-indigo-500" />
                                      ) : (
                                        <FaLightbulb className="w-3 h-3 text-amber-500" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm">{suggestion}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {activeSuggestion !== null && (
                            <div className="absolute bottom-4 left-4 right-4">
                              <Button
                                onClick={() => {
                                  handleAIChat();
                                  setAiPanel("chat");
                                }}
                                disabled={isAIThinking || !userInput}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                              >
                                <HiSparkles className="w-4 h-4 mr-2" />
                                Get AI Help
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
