"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGlobe,
  FaBriefcase,
} from "react-icons/fa";

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  jobRole: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onUpdate: (data: PersonalInfoData) => void;
}

export function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Let's start with your basic information
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          This information will appear at the top of your resume and help
          recruiters contact you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FaUser className="w-5 h-5 text-blue-500" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>
              Your name and primary contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-slate-700 dark:text-slate-300"
                >
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <FaEnvelope className="w-4 h-4" />
                <span>Email Address *</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john.doe@email.com"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <FaPhone className="w-4 h-4" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>Location *</span>
              </Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="San Francisco, CA"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="jobRole"
                className="text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <FaBriefcase className="w-4 h-4" />
                <span>Job Role/Title *</span>
              </Label>
              <Input
                id="jobRole"
                value={data.jobRole}
                onChange={(e) => handleChange("jobRole", e.target.value)}
                placeholder="Software Engineer, Product Manager, etc."
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card className="bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FaGlobe className="w-5 h-5 text-cyan-500" />
              <span>Online Presence</span>
            </CardTitle>
            <CardDescription>
              Your professional online profiles (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="linkedin"
                className="text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <FaLinkedin className="w-4 h-4" />
                <span>LinkedIn Profile</span>
              </Label>
              <Input
                id="linkedin"
                value={data.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johndoe"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <FaGlobe className="w-4 h-4" />
                <span>Personal Website/Portfolio</span>
              </Label>
              <Input
                id="website"
                value={data.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="johndoe.com"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              />
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Pro Tips
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Use a professional email address</li>
                <li>• Include your LinkedIn profile for networking</li>
                <li>• Add a portfolio if you're in a creative field</li>
                <li>• Keep your location general (city, state)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
