"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PersonalInfoStep } from "@/components/create-resume/personal-info-step";
import { ProfessionalSummaryStep } from "@/components/create-resume/professional-summary-step";
import { WorkExperienceStep } from "@/components/create-resume/work-experience-step";
import { ProjectsStep } from "@/components/create-resume/projects-step";
import { EducationStep } from "@/components/create-resume/education-step";
import { SkillsStep } from "@/components/create-resume/skills-step";
import { TemplateSelectionStep } from "@/components/create-resume/template-selection-step";
import { ReviewStep } from "@/components/create-resume/review-step";
import { FaArrowLeft, FaArrowRight, FaRocket, FaCheck } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    jobRole: string;
  };
  professionalSummary: string;
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    current: boolean;
    url?: string;
    github?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  selectedTemplate: string;
}

const steps = [
  { id: 1, title: "Personal Info", description: "Basic contact information" },
  { id: 2, title: "Summary", description: "Professional summary" },
  { id: 3, title: "Experience", description: "Work history" },
  { id: 4, title: "Projects", description: "Personal & professional projects" },
  { id: 5, title: "Education", description: "Educational background" },
  { id: 6, title: "Skills", description: "Technical & soft skills" },
  { id: 7, title: "Template", description: "Choose design" },
  { id: 8, title: "Review", description: "Final review" },
];

export default function CreateResumePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      jobRole: "",
    },
    professionalSummary: "",
    workExperience: [],
    projects: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
    selectedTemplate: "professional",
  });

  const handleCreateResume = async () => {
    try {
      setIsSubmitting(true);
      console.log("Saving resume data to database:", resumeData);

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save resume to database");
      }

      toast({
        title: "Resume created!",
        description: "Your resume has been saved successfully.",
        variant: "default",
      });

      // Wait a moment for better UX
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 1000);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const validatePersonalInfo = () => {
    const { firstName, lastName, email, phone, location, jobRole } =
      resumeData.personalInfo;
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      location.trim() !== "" &&
      jobRole.trim() !== ""
    );
  };

  const validateProfessionalSummary = () => {
    return resumeData.professionalSummary.trim().length >= 50;
  };

  const validateWorkExperience = () => {
    // Work experience is now optional
    return true;
  };

  const validateProjects = () => {
    // Projects are optional
    return true;
  };

  const validateEducation = () => {
    return (
      resumeData.education.length > 0 &&
      resumeData.education.every(
        (edu) =>
          edu.institution.trim() !== "" &&
          edu.degree.trim() !== "" &&
          edu.field.trim() !== ""
      )
    );
  };

  const validateSkills = () => {
    return (
      resumeData.skills.technical.length > 0 ||
      resumeData.skills.soft.length > 0 ||
      resumeData.skills.languages.length > 0
    );
  };

  const validateTemplate = () => {
    return resumeData.selectedTemplate.trim() !== "";
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return validatePersonalInfo();
      case 2:
        return validateProfessionalSummary();
      case 3:
        return validateWorkExperience();
      case 4:
        return validateProjects();
      case 5:
        return validateEducation();
      case 6:
        return validateSkills();
      case 7:
        return validateTemplate();
      case 8:
        return true; // Review step doesn't need validation
      default:
        return false;
    }
  };

  const getValidationMessage = () => {
    switch (currentStep) {
      case 1:
        return "Please fill in all required fields: First Name, Last Name, Email, Phone, Location, and Job Role";
      case 2:
        return "Please write a professional summary of at least 50 characters";
      case 3:
        return "Work experience is optional. You can skip this step or add your experience.";
      case 4:
        return "Projects are optional. You can skip this step or add your projects.";
      case 5:
        return "Please add at least one education entry with Institution, Degree, and Field of Study";
      case 6:
        return "Please add at least one skill (technical, soft, or language)";
      case 7:
        return "Please select a template";
      default:
        return "";
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo}
            onUpdate={(data) => updateResumeData("personalInfo", data)}
          />
        );
      case 2:
        return (
          <ProfessionalSummaryStep
            data={resumeData.professionalSummary}
            onUpdate={(data) => updateResumeData("professionalSummary", data)}
          />
        );
      case 3:
        return (
          <WorkExperienceStep
            data={resumeData.workExperience}
            onUpdate={(data) => updateResumeData("workExperience", data)}
          />
        );
      case 4:
        return (
          <ProjectsStep
            data={resumeData.projects}
            onUpdate={(data) => updateResumeData("projects", data)}
          />
        );
      case 5:
        return (
          <EducationStep
            data={resumeData.education}
            onUpdate={(data) => updateResumeData("education", data)}
          />
        );
      case 6:
        return (
          <SkillsStep
            data={resumeData.skills}
            onUpdate={(data) => updateResumeData("skills", data)}
          />
        );
      case 7:
        return (
          <TemplateSelectionStep
            data={resumeData.selectedTemplate}
            onUpdate={(data) => updateResumeData("selectedTemplate", data)}
          />
        );
      case 8:
        return (
          <ReviewStep
            data={resumeData}
            onUpdate={handleResumeUpdate}
            onSave={handleCreateResume}
          />
        );
      default:
        return null;
    }
  };

  const handleResumeUpdate = (updatedData: any) => {
    // Convert the updated data to match our local ResumeData type
    setResumeData(updatedData);
  };

  // If we're on the review step, render it full screen
  if (currentStep === 8) {
    return (
      <ReviewStep
        data={resumeData}
        onUpdate={handleResumeUpdate}
        onSave={handleCreateResume}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-cyan-950/20">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FaRocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border-0"
          >
            <HiSparkles className="w-4 h-4 mr-1 text-blue-500" />
            AI-Powered Builder
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Create Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI-Optimized
              </span>{" "}
              Resume
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Step {currentStep} of {steps.length}:{" "}
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : currentStep === step.id
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <FaCheck className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${
                        currentStep >= step.id
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-xl">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700/50">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">{renderStep()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {/* <Button
                variant="ghost"
                className="text-slate-600 dark:text-slate-400"
              >
                Save Draft
              </Button> */}
              {currentStep < steps.length ? (
                <div className="flex flex-col items-end space-y-2">
                  {!isCurrentStepValid() &&
                    (currentStep === 1 ||
                      currentStep === 2 ||
                      currentStep === 5 ||
                      currentStep === 6 ||
                      currentStep === 7) && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-right max-w-xs">
                        {getValidationMessage()}
                      </p>
                    )}
                  {(currentStep === 3 || currentStep === 4) && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-right max-w-xs">
                      {getValidationMessage()}
                    </p>
                  )}
                  <Button
                    onClick={nextStep}
                    disabled={
                      !isCurrentStepValid() &&
                      (currentStep === 1 ||
                        currentStep === 2 ||
                        currentStep === 5 ||
                        currentStep === 6 ||
                        currentStep === 7)
                    }
                    className={`${
                      isCurrentStepValid() ||
                      currentStep === 3 ||
                      currentStep === 4
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                        : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed border-0"
                    }`}
                  >
                    Next Step
                    <FaArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleCreateResume}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaRocket className="w-4 h-4 mr-2" />
                      Create Resume
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
