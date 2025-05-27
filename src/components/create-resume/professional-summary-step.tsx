"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaMagic, FaLightbulb } from "react-icons/fa";

interface ProfessionalSummaryStepProps {
  data: string;
  onUpdate: (data: string) => void;
}

export function ProfessionalSummaryStep({
  data,
  onUpdate,
}: ProfessionalSummaryStepProps) {
  const getWordCount = (text: string) => {
    return text.split(" ").filter((word) => word.length > 0).length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Tell us about yourself
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Write a compelling professional summary that highlights your key
          achievements and skills.
        </p>
      </div>

      <div className="space-y-4">
        {/* Main Input */}
        <Card className="bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FaLightbulb className="w-5 h-5 text-amber-500" />
              <span>Professional Summary</span>
            </CardTitle>
            <CardDescription>
              A brief overview of your professional background, key skills, and
              career achievements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="summary"
                className="text-slate-700 dark:text-slate-300"
              >
                Your Professional Summary
              </Label>
              <Textarea
                id="summary"
                value={data}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="Write a compelling 2-3 sentence summary that highlights your experience, skills, and what makes you unique..."
                className="min-h-[120px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 resize-none"
              />
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Aim for 2-3 sentences (50-150 words)</span>
                <span>{getWordCount(data)} words</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-1">
              <FaMagic className="w-4 h-4" />
              <span>Writing Tips</span>
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Start with your years of experience and key expertise</li>
              <li>• Include 2-3 of your most impressive achievements</li>
              <li>• Mention specific skills relevant to your target role</li>
              <li>• Use action words and quantify results when possible</li>
              <li>• Keep it concise but impactful</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
