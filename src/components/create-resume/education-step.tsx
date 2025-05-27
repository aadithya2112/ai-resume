"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaTrash, FaGraduationCap, FaEdit } from "react-icons/fa";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface EducationStepProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export function EducationStep({ data, onUpdate }: EducationStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    onUpdate([...data, newEducation]);
    setEditingId(newEducation.id);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    const updated = data.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updated);
  };

  const removeEducation = (id: string) => {
    onUpdate(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Your education
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Add your educational background, starting with your highest degree.
        </p>
      </div>

      <div className="space-y-6">
        {data.length === 0 ? (
          <Card className="bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FaGraduationCap className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No education added yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Add your educational background to showcase your qualifications.
              </p>
              <Button
                onClick={addEducation}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {data.map((education, index) => (
              <Card
                key={education.id}
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
                        {education.degree || "New Education"}{" "}
                        {education.institution && `at ${education.institution}`}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditingId(
                            editingId === education.id ? null : education.id
                          )
                        }
                        className="text-slate-600 dark:text-slate-400"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeEducation(education.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingId === education.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${education.id}`}>
                            Institution *
                          </Label>
                          <Input
                            id={`institution-${education.id}`}
                            value={education.institution}
                            onChange={(e) =>
                              updateEducation(
                                education.id,
                                "institution",
                                e.target.value
                              )
                            }
                            placeholder="Stanford University"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${education.id}`}>
                            Degree *
                          </Label>
                          <Input
                            id={`degree-${education.id}`}
                            value={education.degree}
                            onChange={(e) =>
                              updateEducation(
                                education.id,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="Bachelor of Science"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`field-${education.id}`}>
                          Field of Study *
                        </Label>
                        <Input
                          id={`field-${education.id}`}
                          value={education.field}
                          onChange={(e) =>
                            updateEducation(
                              education.id,
                              "field",
                              e.target.value
                            )
                          }
                          placeholder="Computer Science"
                          className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${education.id}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`startDate-${education.id}`}
                            type="month"
                            value={education.startDate}
                            onChange={(e) =>
                              updateEducation(
                                education.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`endDate-${education.id}`}>
                            End Date
                          </Label>
                          <Input
                            id={`endDate-${education.id}`}
                            type="month"
                            value={education.endDate}
                            onChange={(e) =>
                              updateEducation(
                                education.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`gpa-${education.id}`}>
                            GPA (Optional)
                          </Label>
                          <Input
                            id={`gpa-${education.id}`}
                            value={education.gpa}
                            onChange={(e) =>
                              updateEducation(
                                education.id,
                                "gpa",
                                e.target.value
                              )
                            }
                            placeholder="3.8"
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => setEditingId(null)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                      >
                        Save Education
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {education.degree} in {education.field}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400">
                            {education.institution}
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                          <p>
                            {education.startDate} - {education.endDate}
                          </p>
                          {education.gpa && <p>GPA: {education.gpa}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={addEducation}
              variant="outline"
              className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-dashed"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Another Education
            </Button>
          </>
        )}
      </div>

      {/* Tips */}
      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center space-x-1">
            <FaGraduationCap className="w-4 h-4" />
            <span>Education Tips</span>
          </h4>
          <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
            <li>• List your highest degree first</li>
            <li>• Include GPA only if it's 3.5 or higher</li>
            <li>• Add relevant coursework, honors, or achievements</li>
            <li>• Include certifications and professional development</li>
            <li>
              • For recent graduates, education can come before experience
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
