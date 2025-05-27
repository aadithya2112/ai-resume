"use client";
import { useMemo } from "react";
import Latex from "react-latex-next";
import DownloadPDFButton from "../download-pdf";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  location?: string;
  id?: string | number;
}

interface WorkExperienceItem {
  id: string | number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description?: string;
}

interface ProjectItem {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  url?: string;
  github?: string;
  technologies: string[];
  id?: string | number;
}

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  projects: ProjectItem[];
  skills: Skills;
  professionalSummary?: string;
  selectedTemplate: string;
}

interface ResumePreviewProps {
  data: ResumeData;
  templateId?: string;
  latexContent?: string; // New prop for raw LaTeX content
  latexCode: string; // Optional prop for LaTeX code, if needed
}

export function ResumePreview({
  data,
  templateId = "modern",
  latexContent, // Destructure the new prop
  latexCode,
}: ResumePreviewProps) {
  // Add unique keys to items that might be missing them
  const processedData = useMemo(() => {
    return {
      ...data,
      education: data.education.map((edu, index) => ({
        ...edu,
        id: edu.id ?? `edu-${index}`,
      })),
      projects: data.projects.map((project, index) => ({
        ...project,
        id: project.id ?? `proj-${index}`,
      })),
      workExperience: data.workExperience.map((exp, index) => ({
        ...exp,
        id: exp.id ?? `exp-${index}`, // Add a fallback ID if none exists
      })),
    };
  }, [data]);

  const renderProfessionalTemplate = () => (
    <div
      className="bg-white text-black p-8 shadow-lg max-w-4xl mx-auto font-serif resume-template-content"
      style={{ fontFamily: "Times, serif" }}
    >
      {/* Header */}
      <div className="border-b border-black pb-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">
              {processedData.personalInfo.firstName}{" "}
              {processedData.personalInfo.lastName}
            </h1>
            {processedData.personalInfo.website && (
              <div className="text-sm text-blue-600 underline">
                {processedData.personalInfo.website}
              </div>
            )}
          </div>
          <div className="text-right text-sm">
            {processedData.personalInfo.email && (
              <div className="mb-1">
                Email:{" "}
                <span className="text-blue-600 underline">
                  {processedData.personalInfo.email}
                </span>
              </div>
            )}
            {processedData.personalInfo.phone && (
              <div>Mobile: {processedData.personalInfo.phone}</div>
            )}
            {processedData.personalInfo.location && (
              <div>Location: {processedData.personalInfo.location}</div>
            )}
            {processedData.personalInfo.linkedin && (
              <div>
                LinkedIn:{" "}
                <span className="text-blue-600 underline">
                  {processedData.personalInfo.linkedin}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Education */}
      {processedData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wider border-b border-black pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {processedData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-bold text-black">
                      {edu.institution}
                    </div>
                    <div className="italic text-sm">
                      {edu.degree} in {edu.field}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                  <div className="text-right text-sm italic">
                    {edu.startDate} — {edu.endDate}
                    {edu.location && <div>{edu.location}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {processedData.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wider border-b border-black pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {processedData.workExperience.map((exp, index) => (
              <div key={exp.id || `experience-${index}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-black">{exp.company}</div>
                    <div className="italic text-sm">{exp.position}</div>
                  </div>
                  <div className="text-right text-sm italic">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    <div>{exp.location}</div>
                  </div>
                </div>
                {exp.description && (
                  <div className="ml-4">
                    {exp.description.split("\n").map((line, index) => {
                      if (
                        line.trim().startsWith("•") ||
                        line.trim().startsWith("-")
                      ) {
                        return (
                          <div
                            key={`${exp.id}-line-${index}`}
                            className="flex items-start mb-1"
                          >
                            <span className="mr-2">•</span>
                            <span className="text-sm">
                              {line.replace(/^[•-]\s*/, "")}
                            </span>
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <div
                          key={`${exp.id}-line-${index}`}
                          className="text-sm mb-1"
                        >
                          {line}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {processedData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wider border-b border-black pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {processedData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-black">
                      {project.name}
                      {project.url && (
                        <span className="text-blue-600 underline ml-2 text-sm font-normal">
                          |{" "}
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo
                          </a>
                        </span>
                      )}
                      {project.github && (
                        <span className="text-blue-600 underline ml-2 text-sm font-normal">
                          |{" "}
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub
                          </a>
                        </span>
                      )}
                    </div>
                    {project.technologies.length > 0 && (
                      <div className="italic text-sm">
                        <span className="font-bold">Technologies:</span>{" "}
                        {project.technologies.join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm italic">
                    {project.startDate} —{" "}
                    {project.current ? "Present" : project.endDate}
                  </div>
                </div>
                {project.description && (
                  <div className="ml-4">
                    {project.description.split("\n").map((line, index) => {
                      if (
                        line.trim().startsWith("•") ||
                        line.trim().startsWith("-")
                      ) {
                        return (
                          <div
                            key={`${project.id}-line-${index}`}
                            className="flex items-start mb-1"
                          >
                            <span className="mr-2">•</span>
                            <span className="text-sm">
                              {line.replace(/^[•-]\s*/, "")}
                            </span>
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <div
                          key={`${project.id}-line-${index}`}
                          className="text-sm mb-1"
                        >
                          {line}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {processedData.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wider border-b border-black pb-1">
            Summary
          </h2>
          <div className="text-sm leading-relaxed">
            {processedData.professionalSummary}
          </div>
        </div>
      )}

      {/* Skills */}
      {(processedData.skills.technical.length > 0 ||
        processedData.skills.soft.length > 0 ||
        processedData.skills.languages.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wider border-b border-black pb-1">
            Skills
          </h2>
          <div className="space-y-2">
            {processedData.skills.technical.length > 0 && (
              <div className="flex">
                <span className="font-bold text-black mr-2">Languages:</span>
                <span className="text-sm">
                  {processedData.skills.technical.join(", ")}
                </span>
              </div>
            )}
            {processedData.skills.soft.length > 0 && (
              <div className="flex">
                <span className="font-bold text-black mr-2">Technologies:</span>
                <span className="text-sm">
                  {processedData.skills.soft.join(", ")}
                </span>
              </div>
            )}
            {processedData.skills.languages.length > 0 && (
              <div className="flex">
                <span className="font-bold text-black mr-2">Languages:</span>
                <span className="text-sm">
                  {processedData.skills.languages.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderMinimalTemplate = () => (
    <div
      className="bg-white text-black p-8 shadow-lg max-w-4xl mx-auto font-sans resume-template-content"
      style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          {processedData.personalInfo.firstName}{" "}
          {processedData.personalInfo.lastName}
        </h1>
        <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-x-3">
          {processedData.personalInfo.email && (
            <span>{processedData.personalInfo.email}</span>
          )}
          {processedData.personalInfo.phone && (
            <span>{processedData.personalInfo.phone}</span>
          )}
          {processedData.personalInfo.location && (
            <span>{processedData.personalInfo.location}</span>
          )}
          {processedData.personalInfo.linkedin && (
            <span>{processedData.personalInfo.linkedin}</span>
          )}
          {processedData.personalInfo.website && (
            <span>{processedData.personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {processedData.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
            Summary
          </h2>
          <div className="text-sm leading-relaxed text-gray-700">
            {processedData.professionalSummary}
          </div>
        </div>
      )}

      {/* Skills */}
      {(processedData.skills.technical.length > 0 ||
        processedData.skills.soft.length > 0 ||
        processedData.skills.languages.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="space-y-1 text-sm text-gray-700">
            {processedData.skills.technical.length > 0 && (
              <div className="flex">
                <span className="font-medium mr-2">Languages:</span>
                <span>{processedData.skills.technical.join(", ")}</span>
              </div>
            )}
            {processedData.skills.soft.length > 0 && (
              <div className="flex">
                <span className="font-medium mr-2">Technologies:</span>
                <span>{processedData.skills.soft.join(", ")}</span>
              </div>
            )}
            {processedData.skills.languages.length > 0 && (
              <div className="flex">
                <span className="font-medium mr-2">Languages:</span>
                <span>{processedData.skills.languages.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {processedData.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {processedData.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-800">
                      {exp.position}
                    </div>
                    <div className="text-sm text-gray-700">
                      {exp.company}, {exp.location}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <div className="mt-1">
                    {exp.description.split("\n").map((line, index) => {
                      if (
                        line.trim().startsWith("•") ||
                        line.trim().startsWith("-")
                      ) {
                        return (
                          <div
                            key={`${exp.id}-line-${index}`}
                            className="flex items-start mb-1 text-sm text-gray-700"
                          >
                            <span className="mr-2">•</span>
                            <span>{line.replace(/^[•-]\s*/, "")}</span>
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <div
                          key={`${exp.id}-line-${index}`}
                          className="text-sm text-gray-700 mb-1"
                        >
                          {line}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {processedData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {processedData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-800">
                      {edu.institution}
                    </div>
                    <div className="text-sm text-gray-700">
                      {edu.degree} in {edu.field}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {edu.startDate} — {edu.endDate}
                    {edu.location && <div>{edu.location}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {processedData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {processedData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-800">
                      {project.name}
                      {(project.url || project.github) && (
                        <span className="text-gray-600 ml-2 text-sm font-normal">
                          (
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Demo
                            </a>
                          )}
                          {project.url && project.github && " | "}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Code
                            </a>
                          )}
                          )
                        </span>
                      )}
                    </div>
                    {project.technologies.length > 0 && (
                      <div className="text-xs text-gray-600 mt-0.5">
                        {project.technologies.join(" • ")}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {project.startDate} —{" "}
                    {project.current ? "Present" : project.endDate}
                  </div>
                </div>
                {project.description && (
                  <div className="mt-1">
                    {project.description.split("\n").map((line, index) => {
                      if (
                        line.trim().startsWith("•") ||
                        line.trim().startsWith("-")
                      ) {
                        return (
                          <div
                            key={`${project.id}-line-${index}`}
                            className="flex items-start mb-1 text-sm text-gray-700"
                          >
                            <span className="mr-2">•</span>
                            <span>{line.replace(/^[•-]\s*/, "")}</span>
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <div
                          key={`${project.id}-line-${index}`}
                          className="text-sm text-gray-700 mb-1"
                        >
                          {line}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLatexPreview = () => (
    <div className="bg-white text-black p-8 shadow-lg max-w-4xl mx-auto resume-template-content latex-content">
      <Latex>{latexContent || ""}</Latex>
    </div>
  );

  const renderTemplate = () => {
    if (latexContent) {
      return renderLatexPreview();
    }
    switch (templateId) {
      case "minimal":
        return renderMinimalTemplate();
      case "professional":
      case "modern":
      default:
        return renderProfessionalTemplate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Resume Preview
        </h3>
        <DownloadPDFButton latexCode={latexCode} />
      </div>

      <div
        className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white overflow-auto"
        style={{ height: "600px" }}
      >
        {/* Changed from overflow-hidden to overflow-auto and added fixed height */}
        <div
          className="transform scale-[0.75] origin-top-left"
          style={{ width: "133.33%" }}
        >
          {renderTemplate()}
        </div>
      </div>

      {/* Print styles to make the resume print properly */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-template-content,
          .resume-template-content * {
            visibility: visible;
          }
          .resume-template-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            transform: scale(1);
          }
        }

        /* Add specific styles for LaTeX content */
        .latex-content {
          width: 100%;
          min-width: 100%;
          overflow-x: auto;
        }

        .latex-content .katex-display {
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.5em 0;
        }
      `}</style>
    </div>
  );
}
