"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FaPlus,
  FaTrash,
  FaCode,
  FaRobot,
  FaEdit,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  github?: string;
}

interface ProjectsStepProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
}

export function ProjectsStep({ data, onUpdate }: ProjectsStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTechnology, setNewTechnology] = useState<{ [key: string]: string }>(
    {}
  );

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      current: false,
      url: "",
      github: "",
    };
    onUpdate([...data, newProject]);
    setEditingId(newProject.id);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = data.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdate(updated);
  };

  const removeProject = (id: string) => {
    onUpdate(data.filter((project) => project.id !== id));
  };

  const addTechnology = (projectId: string, technology: string) => {
    if (technology.trim()) {
      const project = data.find((p) => p.id === projectId);
      if (project && !project.technologies.includes(technology.trim())) {
        updateProject(projectId, "technologies", [
          ...project.technologies,
          technology.trim(),
        ]);
        setNewTechnology({ ...newTechnology, [projectId]: "" });
      }
    }
  };

  const removeTechnology = (projectId: string, technology: string) => {
    const project = data.find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        "technologies",
        project.technologies.filter((tech) => tech !== technology)
      );
    }
  };

  const generateDescription = async (id: string) => {
    const project = data.find((p) => p.id === id);
    if (!project) return;

    // Simulate AI generation
    const aiDescription = `• Developed a comprehensive ${project.name.toLowerCase()} using modern technologies and best practices
• Implemented responsive design and user-friendly interface with ${project.technologies
      .slice(0, 2)
      .join(" and ")}
• Integrated advanced features including real-time data processing and secure authentication
• Achieved 95% user satisfaction rate and improved performance by 40% compared to previous solutions`;

    updateProject(id, "description", aiDescription);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Your projects
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Showcase your personal and professional projects to demonstrate your
          skills and experience.
        </p>
      </div>

      <div className="space-y-6">
        {data.length === 0 ? (
          <Card className="bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FaCode className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No projects added yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Add your projects to showcase your technical skills and
                creativity.
              </p>
              <Button
                onClick={addProject}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {data.map((project, index) => (
              <Card
                key={project.id}
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50"
              >
                <CardHeader className="border-b border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                      >
                        {index + 1}
                      </Badge>
                      <CardTitle className="text-lg">
                        {project.name || "New Project"}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditingId(
                            editingId === project.id ? null : project.id
                          )
                        }
                        className="text-slate-600 dark:text-slate-400"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProject(project.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingId === project.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${project.id}`}>
                            Project Name *
                          </Label>
                          <Input
                            id={`name-${project.id}`}
                            value={project.name}
                            onChange={(e) =>
                              updateProject(project.id, "name", e.target.value)
                            }
                            placeholder="E-commerce Platform"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`url-${project.id}`}>
                            Live URL (Optional)
                          </Label>
                          <Input
                            id={`url-${project.id}`}
                            value={project.url}
                            onChange={(e) =>
                              updateProject(project.id, "url", e.target.value)
                            }
                            placeholder="https://myproject.com"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`github-${project.id}`}>
                          GitHub Repository (Optional)
                        </Label>
                        <Input
                          id={`github-${project.id}`}
                          value={project.github}
                          onChange={(e) =>
                            updateProject(project.id, "github", e.target.value)
                          }
                          placeholder="https://github.com/username/project"
                          className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${project.id}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`startDate-${project.id}`}
                            type="month"
                            value={project.startDate}
                            onChange={(e) =>
                              updateProject(
                                project.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`endDate-${project.id}`}>
                            End Date
                          </Label>
                          <Input
                            id={`endDate-${project.id}`}
                            type="month"
                            value={project.endDate}
                            onChange={(e) =>
                              updateProject(
                                project.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            disabled={project.current}
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${project.id}`}
                          checked={project.current}
                          onCheckedChange={(checked) => {
                            updateProject(project.id, "current", checked);
                            if (checked) {
                              updateProject(project.id, "endDate", "");
                            }
                          }}
                        />
                        <Label
                          htmlFor={`current-${project.id}`}
                          className="text-sm"
                        >
                          This is an ongoing project
                        </Label>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-2">
                        <Label>Technologies Used</Label>
                        <div className="flex space-x-2">
                          <Input
                            value={newTechnology[project.id] || ""}
                            onChange={(e) =>
                              setNewTechnology({
                                ...newTechnology,
                                [project.id]: e.target.value,
                              })
                            }
                            placeholder="Add technology (e.g., React, Node.js)"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addTechnology(
                                  project.id,
                                  newTechnology[project.id] || ""
                                );
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              addTechnology(
                                project.id,
                                newTechnology[project.id] || ""
                              )
                            }
                            size="icon"
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            <FaPlus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/70"
                            >
                              {tech}
                              <button
                                onClick={() =>
                                  removeTechnology(project.id, tech)
                                }
                                className="ml-1 hover:text-red-500"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`description-${project.id}`}>
                            Project Description
                          </Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateDescription(project.id)}
                            className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/20"
                          >
                            <FaRobot className="w-4 h-4 mr-1" />
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          id={`description-${project.id}`}
                          value={project.description}
                          onChange={(e) =>
                            updateProject(
                              project.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="• Describe what the project does and your role&#10;• Highlight key features and technologies used&#10;• Include any notable achievements or metrics"
                          className="min-h-[120px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                        />
                      </div>

                      <Button
                        onClick={() => setEditingId(null)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                      >
                        Save Project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {project.name}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1"
                              >
                                <FaExternalLinkAlt className="w-3 h-3" />
                                <span>Live Demo</span>
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-600 dark:text-slate-400 hover:underline text-sm flex items-center space-x-1"
                              >
                                <FaGithub className="w-3 h-3" />
                                <span>GitHub</span>
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                          <p>
                            {project.startDate} -{" "}
                            {project.current ? "Present" : project.endDate}
                          </p>
                        </div>
                      </div>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {project.description && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                          {project.description}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={addProject}
              variant="outline"
              className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-dashed"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Another Project
            </Button>
          </>
        )}
      </div>

      {/* Tips */}
      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center space-x-1">
            <HiSparkles className="w-4 h-4" />
            <span>Project Tips</span>
          </h4>
          <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
            <li>• Include both personal and professional projects</li>
            <li>• Highlight the technologies and tools you used</li>
            <li>• Mention your specific role and contributions</li>
            <li>• Include links to live demos or GitHub repositories</li>
            <li>
              • Quantify impact where possible (users, performance improvements,
              etc.)
            </li>
            <li>• Focus on projects relevant to your target role</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
