"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaCheck, FaPalette, FaEye, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Image from "next/image";

interface TemplateSelectionStepProps {
  data: string;
  onUpdate: (data: string) => void;
}

const templates = [
  {
    id: "professional",
    name: "Professional Classic",
    description:
      "Clean, ATS-friendly template inspired by the popular Overleaf resume format",
    preview:
      "/placeholder.svg?height=400&width=300&query=Professional Classic Resume Template with clean layout and sections",
    features: [
      "ATS-Optimized",
      "Clean Layout",
      "Professional Typography",
      "Section Dividers",
    ],
    recommended: true,
    category: "Professional",
    color: "blue",
    popularity: 98,
  },
];

const categories = ["Professional"];

export function TemplateSelectionStep({
  data,
  onUpdate,
}: TemplateSelectionStepProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((template) => template.category === selectedCategory);

  const getColorClasses = (color: string, selected: boolean) => {
    const colors = {
      blue: selected
        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
        : "hover:border-blue-300 dark:hover:border-blue-600",
      slate: selected
        ? "ring-2 ring-slate-500 bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800"
        : "hover:border-slate-300 dark:hover:border-slate-600",
      purple: selected
        ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
        : "hover:border-purple-300 dark:hover:border-purple-600",
      green: selected
        ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
        : "hover:border-green-300 dark:hover:border-green-600",
      cyan: selected
        ? "ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800"
        : "hover:border-cyan-300 dark:hover:border-cyan-600",
      indigo: selected
        ? "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800"
        : "hover:border-indigo-300 dark:hover:border-indigo-600",
      orange: selected
        ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
        : "hover:border-orange-300 dark:hover:border-orange-600",
      emerald: selected
        ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
        : "hover:border-emerald-300 dark:hover:border-emerald-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Choose your template
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select our professionally designed template based on the popular
          Overleaf resume format, optimized for ATS systems and maximum
          readability.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
              data === template.id
                ? getColorClasses(template.color, true)
                : `bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 ${getColorClasses(
                    template.color,
                    false
                  )}`
            }`}
            onClick={() => onUpdate(template.id)}
          >
            <CardHeader className="relative p-6">
              {/* Recommended Badge */}
              {template.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 z-20">
                  <HiSparkles className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}

              {/* Selection indicator - moved to top right corner, below recommended badge */}
              {data === template.id && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                  <FaCheck className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs border-${template.color}-200 text-${template.color}-600 dark:text-${template.color}-400`}
                      >
                        {template.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span>{template.popularity}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardDescription className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {template.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      +{template.features.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Click to select
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template.id);
                        }}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-slate-600"
                      >
                        <FaEye className="w-3 h-3 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <span>{template.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                            <Image
                              src={template.preview || "/placeholder.svg"}
                              alt={template.name}
                              width={400}
                              height={533}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FaStar className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">
                                {template.popularity}% popularity
                              </span>
                            </div>
                            <Button
                              onClick={() => {
                                onUpdate(template.id);
                                setPreviewTemplate(null);
                              }}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                            >
                              Select Template
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Description
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                              {template.description}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Features
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                              {template.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <FaCheck className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Best For
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {template.category} Roles
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>

            {/* Selection Overlay */}
            {data === template.id && (
              <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
            )}
          </Card>
        ))}
      </div>

      {/* Template Features */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800/50">
        <CardContent className="p-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center space-x-2">
            <FaPalette className="w-4 h-4" />
            <span>Template Features</span>
          </h4>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
              <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>ATS-Optimized Format</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
              <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Clean Section Dividers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
              <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Professional Typography</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
              <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Industry Standard Layout</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <FaCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="font-medium">
                  Template Selected:{" "}
                  {templates.find((t) => t.id === data)?.name}
                </span>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                {templates.find((t) => t.id === data)?.category}
              </Badge>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You can always change your template later or customize the design.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
