// ATS Scoring Algorithm
// This analyzes a resume and provides a score from 0-100 with feedback

export interface ATSScore {
  score: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
}

export function calculateATSScore(resumeData: any): ATSScore {
  let score = 0;
  const feedback: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Personal Info Section (20 points)
  const personalInfo = resumeData.personalInfo;
  if (personalInfo?.firstName && personalInfo?.lastName) {
    score += 5;
    strengths.push("Complete name provided");
  } else {
    improvements.push("Add complete first and last name");
  }

  if (personalInfo?.email && personalInfo.email.includes("@")) {
    score += 5;
    strengths.push("Valid email address");
  } else {
    improvements.push("Add a valid email address");
  }

  if (personalInfo?.phone) {
    score += 3;
    strengths.push("Phone number included");
  } else {
    improvements.push("Add phone number for contact");
  }

  if (personalInfo?.location) {
    score += 3;
    strengths.push("Location information provided");
  } else {
    improvements.push("Add location for job matching");
  }

  if (personalInfo?.linkedin) {
    score += 2;
    strengths.push("LinkedIn profile included");
  }

  if (personalInfo?.jobRole) {
    score += 2;
    strengths.push("Clear job role specified");
  } else {
    improvements.push("Specify target job role");
  }

  // Professional Summary (15 points)
  if (resumeData.professionalSummary) {
    const summaryLength = resumeData.professionalSummary.length;
    if (summaryLength >= 100 && summaryLength <= 300) {
      score += 15;
      strengths.push("Well-sized professional summary (100-300 characters)");
    } else if (summaryLength >= 50) {
      score += 10;
      feedback.push(
        "Professional summary could be optimized (aim for 100-300 characters)"
      );
    } else {
      score += 5;
      improvements.push("Expand your professional summary");
    }
  } else {
    improvements.push("Add a professional summary");
  }

  // Work Experience (25 points)
  const workExperience = resumeData.workExperience || [];
  if (workExperience.length > 0) {
    score += 10;
    strengths.push("Work experience included");

    // Check for quantified achievements
    const hasQuantifiedAchievements = workExperience.some(
      (exp: any) => exp.description && /\d+/.test(exp.description)
    );
    if (hasQuantifiedAchievements) {
      score += 8;
      strengths.push("Quantified achievements in experience");
    } else {
      improvements.push(
        "Add numbers and metrics to quantify your achievements"
      );
    }

    // Check for strong action verbs
    const hasStrongVerbs = workExperience.some(
      (exp: any) =>
        exp.description &&
        /\b(led|managed|developed|created|improved|increased|reduced|achieved|delivered)\b/i.test(
          exp.description
        )
    );
    if (hasStrongVerbs) {
      score += 7;
      strengths.push("Strong action verbs used");
    } else {
      improvements.push(
        "Use stronger action verbs (led, managed, developed, etc.)"
      );
    }
  } else {
    improvements.push("Add work experience if available");
  }

  // Skills Section (20 points)
  const skills = resumeData.skills;
  const totalSkills =
    (skills?.technical?.length || 0) +
    (skills?.soft?.length || 0) +
    (skills?.languages?.length || 0);

  if (totalSkills >= 8) {
    score += 20;
    strengths.push("Comprehensive skills section");
  } else if (totalSkills >= 5) {
    score += 15;
    feedback.push("Good skills coverage, consider adding more relevant skills");
  } else if (totalSkills >= 3) {
    score += 10;
    improvements.push("Add more relevant skills to your profile");
  } else {
    improvements.push("Expand your skills section significantly");
  }

  // Education Section (10 points)
  const education = resumeData.education || [];
  if (education.length > 0) {
    score += 10;
    strengths.push("Education information included");
  } else {
    improvements.push("Add education background");
  }

  // Projects Section (10 points - bonus)
  const projects = resumeData.projects || [];
  if (projects.length > 0) {
    score += 5;
    strengths.push("Projects showcase your work");

    const hasProjectLinks = projects.some(
      (proj: any) => proj.url || proj.github
    );
    if (hasProjectLinks) {
      score += 5;
      strengths.push("Project links provided for verification");
    }
  }

  // Job Role Keyword Matching (bonus points)
  if (personalInfo?.jobRole) {
    const jobRole = personalInfo.jobRole.toLowerCase();
    const allText = [
      resumeData.professionalSummary,
      ...workExperience.map((exp: any) => exp.description),
      ...projects.map((proj: any) => proj.description),
      ...(skills?.technical || []),
    ]
      .join(" ")
      .toLowerCase();

    // Check for relevant keywords based on job role
    let keywordScore = 0;
    if (
      jobRole.includes("software") ||
      jobRole.includes("developer") ||
      jobRole.includes("engineer")
    ) {
      const techKeywords = [
        "programming",
        "coding",
        "development",
        "software",
        "api",
        "database",
        "framework",
      ];
      keywordScore = techKeywords.filter((keyword) =>
        allText.includes(keyword)
      ).length;
    } else if (jobRole.includes("manager") || jobRole.includes("lead")) {
      const managementKeywords = [
        "team",
        "leadership",
        "management",
        "strategy",
        "planning",
        "coordination",
      ];
      keywordScore = managementKeywords.filter((keyword) =>
        allText.includes(keyword)
      ).length;
    } else if (jobRole.includes("design")) {
      const designKeywords = [
        "design",
        "user",
        "interface",
        "experience",
        "prototype",
        "visual",
      ];
      keywordScore = designKeywords.filter((keyword) =>
        allText.includes(keyword)
      ).length;
    }

    if (keywordScore >= 3) {
      score += 5;
      strengths.push("Good keyword alignment with target role");
    } else if (keywordScore >= 1) {
      feedback.push(
        "Consider adding more keywords related to your target role"
      );
    } else {
      improvements.push(
        "Include more keywords relevant to your target job role"
      );
    }
  }

  // Ensure score doesn't exceed 100
  score = Math.min(score, 100);

  // Add overall feedback based on score
  if (score >= 90) {
    feedback.unshift("Excellent! Your resume is highly ATS-friendly");
  } else if (score >= 80) {
    feedback.unshift(
      "Great job! Your resume should perform well with ATS systems"
    );
  } else if (score >= 70) {
    feedback.unshift("Good foundation, but there's room for improvement");
  } else if (score >= 60) {
    feedback.unshift("Your resume needs some optimization for ATS systems");
  } else {
    feedback.unshift("Significant improvements needed for ATS compatibility");
  }

  return {
    score,
    feedback,
    strengths,
    improvements,
  };
}

export function getATSScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-yellow-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
}

export function getATSScoreBackground(score: number): string {
  if (score >= 90) return "bg-green-100 border-green-200";
  if (score >= 80) return "bg-blue-100 border-blue-200";
  if (score >= 70) return "bg-yellow-100 border-yellow-200";
  if (score >= 60) return "bg-orange-100 border-orange-200";
  return "bg-red-100 border-red-200";
}
