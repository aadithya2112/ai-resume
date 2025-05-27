// LaTeX resume templates

export const modernResumeTemplate = `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}

\\usepackage[scale=0.85]{geometry}
\\usepackage{multicol}

% Personal data
\\name{[FIRST_NAME]}{[LAST_NAME]}
\\title{[JOB_ROLE]}
\\address{[LOCATION]}{}{}
\\phone{[PHONE]}
\\email{[EMAIL]}
\\social[linkedin]{[LINKEDIN]}
\\social[github]{[GITHUB]}

\\begin{document}
\\makecvtitle

\\section{Professional Summary}
\\cvitem{}{[PROFESSIONAL_SUMMARY]}

\\section{Experience}
[WORK_EXPERIENCE]

\\section{Education}
[EDUCATION]

\\section{Skills}
\\cvitem{Technical}{[TECHNICAL_SKILLS]}
\\cvitem{Languages}{[LANGUAGES]}

\\section{Projects}
[PROJECTS]

\\end{document}`;

export const classicResumeTemplate = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titleformat{\\subsection}{\\bfseries}{}{0em}{}

\\begin{document}

\\begin{center}
{\\Large\\bfseries [FIRST_NAME] [LAST_NAME]}\\\\
[JOB_ROLE]\\\\
[LOCATION] | [PHONE] | [EMAIL]\\\\
LinkedIn: [LINKEDIN] | GitHub: [GITHUB]
\\end{center}

\\section{Professional Summary}
[PROFESSIONAL_SUMMARY]

\\section{Experience}
[WORK_EXPERIENCE]

\\section{Education}
[EDUCATION]

\\section{Skills}
\\textbf{Technical Skills:} [TECHNICAL_SKILLS]\\\\
\\textbf{Languages:} [LANGUAGES]

\\section{Projects}
[PROJECTS]

\\end{document}`;

export function generateLatexFromResumeData(
  resumeData: any,
  template: string = "modern"
): string {
  const templateToUse =
    template === "classic" ? classicResumeTemplate : modernResumeTemplate;

  let latex = templateToUse
    .replace(/\[FIRST_NAME\]/g, resumeData.personalInfo?.firstName || "John")
    .replace(/\[LAST_NAME\]/g, resumeData.personalInfo?.lastName || "Doe")
    .replace(
      /\[JOB_ROLE\]/g,
      resumeData.personalInfo?.jobRole || "Professional"
    )
    .replace(
      /\[LOCATION\]/g,
      resumeData.personalInfo?.location || "City, Country"
    )
    .replace(
      /\[PHONE\]/g,
      resumeData.personalInfo?.phone || "+1 (555) 123-4567"
    )
    .replace(
      /\[EMAIL\]/g,
      resumeData.personalInfo?.email || "john.doe@email.com"
    )
    .replace(
      /\[LINKEDIN\]/g,
      resumeData.personalInfo?.linkedin || "linkedin.com/in/johndoe"
    )
    .replace(
      /\[GITHUB\]/g,
      resumeData.personalInfo?.github || "github.com/johndoe"
    )
    .replace(
      /\[PROFESSIONAL_SUMMARY\]/g,
      resumeData.professionalSummary ||
        "Experienced professional with a strong background in technology and innovation."
    );

  // Generate work experience
  let workExperience = "";
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    resumeData.workExperience.forEach((exp: any) => {
      if (template === "modern") {
        workExperience += `\\cventry{${exp.startDate} -- ${exp.endDate}}{${exp.position}}{${exp.company}}{${exp.location}}{}{${exp.description}}\\n`;
      } else {
        workExperience += `\\subsection{${exp.position} | ${exp.company} | ${exp.startDate} -- ${exp.endDate}}\\n${exp.description}\\n\\n`;
      }
    });
  }

  // Generate education
  let education = "";
  if (resumeData.education && resumeData.education.length > 0) {
    resumeData.education.forEach((edu: any) => {
      if (template === "modern") {
        education += `\\cventry{${edu.startDate} -- ${edu.endDate}}{${
          edu.degree
        }}{${edu.institution}}{${edu.location}}{}{${edu.field || ""}}\\n`;
      } else {
        education += `\\subsection{${edu.degree} | ${edu.institution} | ${
          edu.startDate
        } -- ${edu.endDate}}\\n${edu.field || ""}\\n\\n`;
      }
    });
  }

  // Generate projects
  let projects = "";
  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeData.projects.forEach((proj: any) => {
      if (template === "modern") {
        projects += `\\cvitem{${proj.name}}{${proj.description} Technologies: ${
          proj.technologies?.join(", ") || "N/A"
        }}\\n`;
      } else {
        projects += `\\subsection{${proj.name}}\\n${
          proj.description
        }\\nTechnologies: ${proj.technologies?.join(", ") || "N/A"}\\n\\n`;
      }
    });
  }

  latex = latex
    .replace(/\[WORK_EXPERIENCE\]/g, workExperience)
    .replace(/\[EDUCATION\]/g, education)
    .replace(/\[PROJECTS\]/g, projects)
    .replace(
      /\[TECHNICAL_SKILLS\]/g,
      resumeData.skills?.technical?.join(", ") ||
        "Programming, Software Development"
    )
    .replace(
      /\[LANGUAGES\]/g,
      resumeData.skills?.languages?.join(", ") || "English"
    );

  return latex;
}
