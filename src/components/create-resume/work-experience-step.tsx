"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaTrash, FaBriefcase, FaRobot, FaEdit } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface WorkExperienceStepProps {
  data: WorkExperience[];
  onUpdate: (data: WorkExperience[]) => void;
}

export function WorkExperienceStep({
  data,
  onUpdate,
}: WorkExperienceStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onUpdate([...data, newExperience]);
    setEditingId(newExperience.id);
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: any
  ) => {
    const updated = data.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updated);
  };

  const removeExperience = (id: string) => {
    onUpdate(data.filter((exp) => exp.id !== id));
  };

  const generateDescription = async (id: string) => {
    const experience = data.find((exp) => exp.id === id);
    if (!experience) return;

    // Simulate AI generation
    const aiDescription = `• Led cross-functional teams to deliver high-impact projects, resulting in 25% increase in efficiency
• Developed and implemented strategic initiatives that improved customer satisfaction by 30%
• Collaborated with stakeholders to identify opportunities and drive business growth
• Managed budget of $500K+ and consistently delivered projects on time and under budget`;

    updateExperience(id, "description", aiDescription);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Your work experience
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Add your professional experience, starting with your most recent
          position.
        </p>
      </div>

      <div className="space-y-6">
        {data.length === 0 ? (
          <Card className="bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FaBriefcase className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No work experience added yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Add your professional experience to showcase your career
                journey.
              </p>
              <Button
                onClick={addExperience}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add First Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {data.map((experience, index) => (
              <Card
                key={experience.id}
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50"
              >
                <CardHeader className="border-b border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      >
                        {index + 1}
                      </Badge>
                      <CardTitle className="text-lg">
                        {experience.position || "New Position"}{" "}
                        {experience.company && `at ${experience.company}`}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditingId(
                            editingId === experience.id ? null : experience.id
                          )
                        }
                        className="text-slate-600 dark:text-slate-400"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeExperience(experience.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingId === experience.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`position-${experience.id}`}>
                            Position Title *
                          </Label>
                          <Input
                            id={`position-${experience.id}`}
                            value={experience.position}
                            onChange={(e) =>
                              updateExperience(
                                experience.id,
                                "position",
                                e.target.value
                              )
                            }
                            placeholder="Software Engineer"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`company-${experience.id}`}>
                            Company *
                          </Label>
                          <Input
                            id={`company-${experience.id}`}
                            value={experience.company}
                            onChange={(e) =>
                              updateExperience(
                                experience.id,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="Google"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`location-${experience.id}`}>
                            Location
                          </Label>
                          <Input
                            id={`location-${experience.id}`}
                            value={experience.location}
                            onChange={(e) =>
                              updateExperience(
                                experience.id,
                                "location",
                                e.target.value
                              )
                            }
                            placeholder="San Francisco, CA"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${experience.id}`}>
                            Start Date *
                          </Label>
                          <Input
                            id={`startDate-${experience.id}`}
                            type="month"
                            value={experience.startDate}
                            onChange={(e) =>
                              updateExperience(
                                experience.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`endDate-${experience.id}`}>
                            End Date
                          </Label>
                          <Input
                            id={`endDate-${experience.id}`}
                            type="month"
                            value={experience.endDate}
                            onChange={(e) =>
                              updateExperience(
                                experience.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            disabled={experience.current}
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${experience.id}`}
                          checked={experience.current}
                          onCheckedChange={(checked) => {
                            updateExperience(experience.id, "current", checked);
                            if (checked) {
                              updateExperience(experience.id, "endDate", "");
                            }
                          }}
                        />
                        <Label
                          htmlFor={`current-${experience.id}`}
                          className="text-sm"
                        >
                          I currently work here
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`description-${experience.id}`}>
                            Job Description
                          </Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateDescription(experience.id)}
                            className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/20"
                          >
                            <FaRobot className="w-4 h-4 mr-1" />
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          id={`description-${experience.id}`}
                          value={experience.description}
                          onChange={(e) =>
                            updateExperience(
                              experience.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include specific metrics and results when possible"
                          className="min-h-[120px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                        />
                      </div>

                      <Button
                        onClick={() => setEditingId(null)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                      >
                        Save Experience
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {experience.position}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400">
                            {experience.company}
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                          <p>{experience.location}</p>
                          <p>
                            {experience.startDate} -{" "}
                            {experience.current
                              ? "Present"
                              : experience.endDate}
                          </p>
                        </div>
                      </div>
                      {experience.description && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                          {experience.description}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={addExperience}
              variant="outline"
              className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-dashed"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Another Experience
            </Button>
          </>
        )}
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-1">
            <HiSparkles className="w-4 h-4" />
            <span>Pro Tips for Work Experience</span>
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              • Start each bullet point with an action verb (Led, Developed,
              Managed)
            </li>
            <li>
              • Include specific numbers and metrics when possible (increased
              sales by 25%)
            </li>
            <li>• Focus on achievements rather than just responsibilities</li>
            <li>
              • Tailor your descriptions to match the job you're applying for
            </li>
            <li>
              • Use our AI assistant to help write compelling descriptions
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
