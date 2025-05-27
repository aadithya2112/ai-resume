"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
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
  FaTimes,
  FaStar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { toast } from "sonner";
import Link from "next/link";
import { ResumePreview } from "./resume-preview";
import {
  calculateATSScore,
  getATSScoreColor,
  getATSScoreBackground,
  type ATSScore,
} from "@/lib/ats-scoring";
import { generateLatexFromResumeData } from "@/lib/latex-templates";
import type { ResumeData } from "./resume-preview";
import { motion, AnimatePresence } from "framer-motion";
import { redirect } from "next/navigation";

interface ReviewStepProps {
  data: ResumeData;
  onUpdate: (data: ResumeData) => void;
  onSave: () => void;
}

export function ReviewStep({ data, onUpdate, onSave }: ReviewStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState("overview");
  const [showSidebar, setShowSidebar] = useState(true);
  const [latexCode, setLatexCode] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [enhancementSuccesses, setEnhancementSuccesses] = useState<string[]>(
    []
  );
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  // Track screen size for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate ATS score when data changes
  useEffect(() => {
    const score = calculateATSScore(data);
    setAtsScore(score);
  }, [data]);

  // Generate LaTeX code when data changes
  useEffect(() => {
    const latex = generateLatexFromResumeData(data, data.selectedTemplate);
    setLatexCode(latex);
  }, [data]);

  const toggleFullscreen = () => {
    const element = previewRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          toast.error("Couldn't enable fullscreen mode");
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          toast.error("Couldn't exit fullscreen mode");
        });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setIsSaved(true);
      toast.success("Resume saved successfully!");
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      toast.error("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    // redirect to /resume/resumeId
    // get the current resume ID from the data prop
    // first save the current resume
    saveButtonRef.current?.click();
    redirect("/dashboard");
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Simple PDF download implementation
      window.print();
      toast.success("PDF download initiated!");
    } catch (error) {
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Resume link copied to clipboard!");
  };

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(Math.max(50, Math.min(150, newZoom)));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Custom function to get a consistent color scheme for ATS score backgrounds
  const getConsistentATSBackground = (score: number) => {
    // Light mode backgrounds
    const lightBg =
      score >= 80
        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        : score >= 60
        ? "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200"
        : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200";

    // Dark mode backgrounds (much darker and more consistent)
    const darkBg =
      score >= 80
        ? "dark:bg-gradient-to-br dark:from-green-900/30 dark:to-emerald-900/20 dark:border-green-800"
        : score >= 60
        ? "dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-sky-900/20 dark:border-blue-800"
        : "dark:bg-gradient-to-br dark:from-amber-900/30 dark:to-orange-900/20 dark:border-amber-800";

    return `${lightBg} ${darkBg}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <motion.div
        className="flex-shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 sticky top-0 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/create"
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="hidden md:block w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaRobot className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  AI Resume Editor
                </h1>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  Preview & enhance your resume
                </p>
              </div>
            </motion.div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleSidebar}
                    size="sm"
                    variant="outline"
                    className="md:hidden border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                  >
                    <FaEye className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showSidebar ? "Hide" : "Show"} ATS feedback
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Edit with AI button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size={isSmallScreen ? "sm" : "default"}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/50"
                onClick={handleEdit}
              >
                <FaMagic className="w-4 h-4 mr-1.5" />
                Edit with AI
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size={isSmallScreen ? "sm" : "default"}
                className={`${
                  isSaved
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors duration-300 font-medium`}
                ref={saveButtonRef}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Saving...
                  </span>
                ) : isSaved ? (
                  <span className="flex items-center">
                    <FaCheckCircle className="mr-1.5 h-4 w-4" />
                    Saved!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaSave className="mr-1.5 h-4 w-4" />
                    Save
                  </span>
                )}
              </Button>
            </motion.div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      size={isSmallScreen ? "sm" : "default"}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                    >
                      {isDownloading ? (
                        <HiSparkles className="w-4 h-4 animate-spin" />
                      ) : (
                        <FaDownload className="w-4 h-4" />
                      )}
                      <span className="hidden md:inline ml-2">PDF</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Download as PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - ATS Score */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="md:w-1/3 lg:w-1/4 p-4 overflow-y-auto border-r border-slate-200 dark:border-slate-700"
            >
              {atsScore && (
                <Card
                  className={`${getConsistentATSBackground(
                    atsScore.score
                  )} border-2 h-fit mb-4 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <FaChartLine className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            ATS Score
                          </CardTitle>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Applicant Tracking System compatibility
                          </p>
                        </div>
                      </div>
                      <motion.div
                        className="text-right"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div
                          className={`text-3xl font-bold ${getATSScoreColor(
                            atsScore.score
                          )}`}
                        >
                          {atsScore.score}
                        </div>
                        <Progress
                          value={atsScore.score}
                          className="w-16 mt-1 h-2"
                        />
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Tabs
                      value={activeFeedbackTab}
                      onValueChange={setActiveFeedbackTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 mb-4 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-md">
                        <TabsTrigger
                          value="overview"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all"
                        >
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="strengths"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all"
                        >
                          <span>Strengths</span>
                          <Badge
                            variant="outline"
                            className="ml-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          >
                            {atsScore.strengths.length}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger
                          value="improvements"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all"
                        >
                          <span>Improve</span>
                          <Badge
                            variant="outline"
                            className="ml-1 bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                          >
                            {atsScore.improvements.length}
                          </Badge>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4 mt-0">
                        {/* Overall Feedback */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center text-sm">
                            <FaLightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                            Assessment
                          </h4>
                          <ScrollArea className="h-[120px] border rounded-md bg-white/40 dark:bg-slate-800/60">
                            <div className="p-3 space-y-2">
                              {atsScore.feedback.map((item, index) => (
                                <motion.p
                                  key={index}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="text-xs text-gray-700 dark:text-gray-300 rounded px-2 py-1.5 border-l-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/30"
                                >
                                  {item}
                                </motion.p>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* Score Breakdown */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            Score Breakdown
                          </h4>
                          <div className="space-y-2 bg-white/40 dark:bg-slate-800/60 p-3 rounded-md border">
                            {[
                              {
                                name: "Personal Info",
                                score: 18,
                                max: 20,
                                color: "bg-blue-500",
                              },
                              {
                                name: "Summary",
                                score: 12,
                                max: 15,
                                color: "bg-indigo-500",
                              },
                              {
                                name: "Experience",
                                score: 20,
                                max: 25,
                                color: "bg-green-500",
                              },
                              {
                                name: "Skills",
                                score: 15,
                                max: 20,
                                color: "bg-yellow-500",
                              },
                              {
                                name: "Education",
                                score: 8,
                                max: 10,
                                color: "bg-red-500",
                              },
                              {
                                name: "Projects",
                                score: 7,
                                max: 10,
                                color: "bg-indigo-500",
                              },
                            ].map((item, index) => (
                              <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`w-2 h-2 rounded-full ${item.color} mr-2`}
                                  ></span>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {item.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Progress
                                    value={(item.score / item.max) * 100}
                                    className={`w-20 h-1.5 bg-gray-200 dark:bg-gray-700 [&>div]:${item.color}`}
                                  />
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {item.score}/{item.max}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="strengths" className="space-y-1 mt-0">
                        <ScrollArea className="h-[250px] border rounded-md bg-white/40 dark:bg-slate-800/60">
                          <div className="p-3 space-y-2">
                            {atsScore.strengths.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xs text-green-700 dark:text-green-400 bg-green-50/70 dark:bg-green-900/30 rounded-lg px-3 py-2.5 flex items-start border border-green-200 dark:border-green-800"
                              >
                                <FaCheckCircle className="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent
                        value="improvements"
                        className="space-y-1 mt-0"
                      >
                        <ScrollArea className="h-[250px] border rounded-md bg-white/40 dark:bg-slate-800/60">
                          <div className="p-3 space-y-2">
                            {atsScore.improvements.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xs text-orange-700 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-900/30 rounded-lg px-3 py-2.5 flex items-start border border-orange-200 dark:border-orange-800"
                              >
                                <FaExclamationTriangle className="w-3.5 h-3.5 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>

                    {/* How ATS Scoring Works */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          How ATS Scoring Works
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                        >
                          Learn more
                        </Button>
                      </div>
                      <motion.div
                        className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-2 bg-white/40 dark:bg-slate-800/60 p-2 rounded-md border"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
                          <strong>Personal Info:</strong> Contact details, job
                          role
                        </p>
                        <p className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2 flex-shrink-0"></span>
                          <strong>Summary:</strong> Professional summary quality
                        </p>
                        <p className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
                          <strong>Experience:</strong> Work history with metrics
                        </p>
                        <p className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2 flex-shrink-0"></span>
                          <strong>Skills:</strong> Relevant technical & soft
                          skills
                        </p>
                        <p className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
                          <strong>Education:</strong> Educational background
                        </p>
                        <p className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2 flex-shrink-0"></span>
                          <strong>Projects:</strong> Portfolio showcase
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side - Resume Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Resume Preview Controls */}
          <div className="p-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                onClick={() => handleZoomChange(zoomLevel - 10)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={zoomLevel <= 50}
              >
                <FaMinus className="h-3 w-3" />
              </Button>
              <div className="text-xs font-medium w-12 text-center bg-slate-100 dark:bg-slate-700 p-1 rounded">
                {zoomLevel}%
              </div>
              <Button
                onClick={() => handleZoomChange(zoomLevel + 10)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={zoomLevel >= 150}
              >
                <FaPlus className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleFullscreen}
                      size="sm"
                      variant="ghost"
                      className="h-8 p-0 w-8"
                    >
                      {isFullscreen ? (
                        <MdFullscreenExit className="h-4 w-4" />
                      ) : (
                        <MdFullscreen className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Badge
                variant="outline"
                className="bg-white/90 dark:bg-slate-700/90"
              >
                <FaSearch className="w-3 h-3 mr-1 text-slate-500" />
                <span className="text-xs">Preview</span>
              </Badge>

              {isSmallScreen && (
                <Button
                  onClick={toggleSidebar}
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                >
                  {showSidebar ? "Hide" : "Show"} ATS Feedback
                </Button>
              )}
            </div>
          </div>

          {/* Resume Content */}
          <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900 p-6">
            <motion.div
              className="mx-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-200"
              style={{
                maxWidth: "850px",
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
              ref={previewRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="p-6" style={{ minHeight: "29.7cm" }}>
                <ResumePreview data={data} latexCode={latexCode} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
