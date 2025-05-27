"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaTimes, FaCode, FaUsers, FaGlobe } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

interface SkillsStepProps {
  data: Skills;
  onUpdate: (data: Skills) => void;
}

const suggestedSkills = {
  technical: [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "AWS",
    "Docker",
    "Git",
    "TypeScript",
    "Java",
    "C++",
    "MongoDB",
    "PostgreSQL",
    "Kubernetes",
    "Jenkins",
    "HTML/CSS",
    "Vue.js",
    "Angular",
    "Express.js",
    "Redis",
    "GraphQL",
    "REST APIs",
  ],
  soft: [
    "Leadership",
    "Communication",
    "Problem Solving",
    "Team Collaboration",
    "Project Management",
    "Critical Thinking",
    "Adaptability",
    "Time Management",
    "Creativity",
    "Analytical Thinking",
    "Attention to Detail",
    "Customer Service",
    "Negotiation",
    "Public Speaking",
    "Mentoring",
  ],
  languages: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese (Mandarin)",
    "Japanese",
    "Korean",
    "Portuguese",
    "Italian",
    "Russian",
    "Arabic",
    "Hindi",
    "Dutch",
    "Swedish",
  ],
};

export function SkillsStep({ data, onUpdate }: SkillsStepProps) {
  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
  });

  const addSkill = (category: keyof Skills, skill: string) => {
    if (skill.trim() && !data[category].includes(skill.trim())) {
      onUpdate({
        ...data,
        [category]: [...data[category], skill.trim()],
      });
      setNewSkill({ ...newSkill, [category]: "" });
    }
  };

  const removeSkill = (category: keyof Skills, skillToRemove: string) => {
    onUpdate({
      ...data,
      [category]: data[category].filter((skill) => skill !== skillToRemove),
    });
  };

  const addSuggestedSkill = (category: keyof Skills, skill: string) => {
    addSkill(category, skill);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Your skills
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Add your technical skills, soft skills, and languages to showcase your
          capabilities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Technical Skills */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FaCode className="w-5 h-5 text-blue-500" />
              <span>Technical Skills</span>
            </CardTitle>
            <CardDescription>
              Programming languages, frameworks, tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newSkill.technical}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, technical: e.target.value })
                }
                placeholder="Add a technical skill"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addSkill("technical", newSkill.technical);
                  }
                }}
              />
              <Button
                onClick={() => addSkill("technical", newSkill.technical)}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <FaPlus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.technical.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70 cursor-pointer"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill("technical", skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Suggested Skills:
              </Label>
              <div className="flex flex-wrap gap-1">
                {suggestedSkills.technical
                  .filter((skill) => !data.technical.includes(skill))
                  .slice(0, 8)
                  .map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSuggestedSkill("technical", skill)}
                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FaUsers className="w-5 h-5 text-purple-500" />
              <span>Soft Skills</span>
            </CardTitle>
            <CardDescription>
              Interpersonal and professional skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newSkill.soft}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, soft: e.target.value })
                }
                placeholder="Add a soft skill"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addSkill("soft", newSkill.soft);
                  }
                }}
              />
              <Button
                onClick={() => addSkill("soft", newSkill.soft)}
                size="icon"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <FaPlus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.soft.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70 cursor-pointer"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill("soft", skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Suggested Skills:
              </Label>
              <div className="flex flex-wrap gap-1">
                {suggestedSkills.soft
                  .filter((skill) => !data.soft.includes(skill))
                  .slice(0, 8)
                  .map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSuggestedSkill("soft", skill)}
                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FaGlobe className="w-5 h-5 text-green-500" />
              <span>Languages</span>
            </CardTitle>
            <CardDescription>Languages you speak fluently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newSkill.languages}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, languages: e.target.value })
                }
                placeholder="Add a language"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addSkill("languages", newSkill.languages);
                  }
                }}
              />
              <Button
                onClick={() => addSkill("languages", newSkill.languages)}
                size="icon"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FaPlus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.languages.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70 cursor-pointer"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill("languages", skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Suggested Languages:
              </Label>
              <div className="flex flex-wrap gap-1">
                {suggestedSkills.languages
                  .filter((skill) => !data.languages.includes(skill))
                  .slice(0, 8)
                  .map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSuggestedSkill("languages", skill)}
                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-green-950/20 border-slate-200 dark:border-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center space-x-1">
            <HiSparkles className="w-4 h-4" />
            <span>Skills Tips</span>
          </h4>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>• Include skills that are relevant to your target job</li>
            <li>
              • Be honest about your skill level - only include skills you can
              demonstrate
            </li>
            <li>• Mix technical and soft skills for a well-rounded profile</li>
            <li>• Use industry-standard terminology and tool names</li>
            <li>
              • Consider adding proficiency levels for languages (e.g., "Spanish
              (Fluent)")
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
