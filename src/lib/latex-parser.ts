function parseModernCVLatex(latexCode: string) {
  const data: any = {
    personalInfo: {},
    education: [],
    workExperience: [],
    projects: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
    professionalSummary: "",
  };

  try {
    // Extract personal info
    const nameMatch = latexCode.match(/\\name{(.*?)}{(.*?)}/);
    if (nameMatch) {
      data.personalInfo.firstName = nameMatch[1].trim();
      data.personalInfo.lastName = nameMatch[2].trim();
    }

    const emailMatch = latexCode.match(/\\email{(.*?)}/);
    if (emailMatch) {
      data.personalInfo.email = emailMatch[1].trim();
    }

    const phoneMatch = latexCode.match(/\\phone{(.*?)}/);
    if (phoneMatch) {
      data.personalInfo.phone = phoneMatch[1].trim();
    }

    const addressMatch = latexCode.match(/\\address{(.*?)}{(.*?)}{(.*?)}/);
    if (addressMatch) {
      // Take the first element for location, which is typically the city or address
      data.personalInfo.location = addressMatch[1].trim();
    }

    const linkedinMatch = latexCode.match(/\\social\[linkedin\]{(.*?)}/);
    if (linkedinMatch) {
      data.personalInfo.linkedin = linkedinMatch[1].trim();
    }

    const githubMatch = latexCode.match(/\\social\[github\]{(.*?)}/);
    if (githubMatch) {
      data.personalInfo.github = githubMatch[1].trim();
    }

    // Extract professional summary section
    const summarySection = latexCode.match(
      /\\section{Professional Summary}([\s\S]*?)(?:\\section|\\end{document})/
    );
    if (summarySection) {
      const cvItemMatch = summarySection[1].match(/\\cvitem{.*?}{([^}]*?)}/);
      if (cvItemMatch) {
        data.professionalSummary = cvItemMatch[1].trim();
      }
    }

    // Extract education section
    const educationSection = latexCode.match(
      /\\section{Education}([\s\S]*?)(?:\\section|\\end{document})/
    );
    if (educationSection) {
      const cvEntryMatches = [
        ...educationSection[1].matchAll(
          /\\cventry{(.*?)}{(.*?)}{(.*?)}{(.*?)}{(.*?)}{(.*?)}/g
        ),
      ];

      cvEntryMatches.forEach((match, index) => {
        const [_, dates, degree, institution, gpa, location, description] =
          match;

        // Parse dates
        let startDate = "";
        let endDate = "";

        if (dates.includes("--")) {
          [startDate, endDate] = dates.split("--").map((d) => d.trim());
        } else {
          startDate = dates.trim();
        }

        data.education.push({
          institution: institution.trim(),
          degree: degree.trim(),
          field: "", // Sometimes included in the degree string, but we'd need more complex parsing
          gpa: gpa.trim(),
          startDate,
          endDate,
          location: location.trim(),
          id: `edu-${index}`,
        });
      });
    }

    // Extract experience section
    const experienceSection = latexCode.match(
      /\\section{Experience}([\s\S]*?)(?:\\section|\\end{document})/
    );
    if (experienceSection) {
      const cvEntryMatches = [
        ...experienceSection[1].matchAll(
          /\\cventry{(.*?)}{(.*?)}{(.*?)}{(.*?)}{(.*?)}{(.*?)}/g
        ),
      ];

      cvEntryMatches.forEach((match, index) => {
        const [
          fullMatch,
          dates,
          position,
          company,
          location,
          empty,
          description,
        ] = match;

        // Parse dates
        let startDate = "";
        let endDate = "";
        let current = false;

        if (dates.includes("--")) {
          [startDate, endDate] = dates.split("--").map((d) => d.trim());
          current = endDate === "present" || endDate === "Present";
        } else {
          startDate = dates.trim();
        }

        data.workExperience.push({
          position: position.trim(),
          company: company.trim(),
          location: location.trim(),
          startDate,
          endDate: current ? "" : endDate,
          current,
          description: description.trim(),
          id: `exp-${index}`,
        });
      });
    }

    // Extract skills section
    const skillsSection = latexCode.match(
      /\\section{Skills}([\s\S]*?)(?:\\section|\\end{document})/
    );
    if (skillsSection) {
      const technicalMatch = skillsSection[1].match(
        /\\cvitem{Technical}{(.*?)}/
      );
      if (technicalMatch) {
        data.skills.technical = technicalMatch[1]
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      const languagesMatch = skillsSection[1].match(
        /\\cvitem{Languages}{(.*?)}/
      );
      if (languagesMatch) {
        data.skills.languages = languagesMatch[1]
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      // Check for other skill types
      const cvItemMatches = [
        ...skillsSection[1].matchAll(
          /\\cvitem{((?!Technical|Languages).*?)}{(.*?)}/g
        ),
      ];
      if (cvItemMatches.length > 0) {
        // Assign any other skills to soft skills
        const otherSkills = cvItemMatches.map((match) => match[2].trim());
        data.skills.soft = otherSkills
          .join(", ")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    // Extract projects section
    const projectsSection = latexCode.match(
      /\\section{Projects}([\s\S]*?)(?:\\end{document})/
    );
    if (projectsSection) {
      const projectItems = [
        ...projectsSection[1].matchAll(/\\cvitem{(.*?)}{(.*?)}/g),
      ];

      for (let i = 0; i < projectItems.length; i += 2) {
        const nameItem = projectItems[i];
        const descItem =
          i + 1 < projectItems.length ? projectItems[i + 1] : null;

        if (nameItem) {
          const name = nameItem[1].trim();
          const description = descItem ? descItem[2].trim() : "";

          data.projects.push({
            name,
            description,
            startDate: "", // These would need to be parsed from the description
            endDate: "",
            technologies: [], // Would need to be extracted from description
            id: `proj-${i / 2}`,
          });
        }
      }
    }

    return data;
  } catch (error) {
    console.error("Error parsing ModernCV LaTeX:", error);
    return data;
  }
}

export function parseLatexToData(latexCode: string) {
  const data: any = {
    personalInfo: {},
    education: [],
    workExperience: [],
    projects: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
  };

  try {
    // Handle moderncv format
    if (
      latexCode.includes("\\documentclass") &&
      latexCode.includes("moderncv")
    ) {
      console.log("Parsing moderncv format LaTeX");
      return parseModernCVLatex(latexCode);
    }

    // Handle standard resume format
    // Extract personal info
    const nameMatch = latexCode.match(
      /\\textbf{\\Huge \\scshape (.*?)\s+(.*?)}\s*\\\\/
    );
    if (nameMatch) {
      data.personalInfo.firstName = nameMatch[1];
      data.personalInfo.lastName = nameMatch[2];
    }

    const emailMatch = latexCode.match(
      /\\href{mailto:(.*?)}{\\underline{(.*?)}}/
    );
    if (emailMatch) {
      data.personalInfo.email = emailMatch[1];
    }

    const phoneMatch = latexCode.match(/\\small ([\d\+\-\(\)\s]+) \$\|/);
    if (phoneMatch) {
      data.personalInfo.phone = phoneMatch[1];
    }

    const linkedinMatch = latexCode.match(
      /\\href{(https:\/\/.*?linkedin.*?)}{\\underline{(.*?)}}/
    );
    if (linkedinMatch) {
      data.personalInfo.linkedin = linkedinMatch[1];
    }

    const websiteMatch = latexCode.match(
      /\\href{(https:\/\/(?!.*?linkedin).*?)}{\\underline{(.*?)}}/
    );
    if (websiteMatch) {
      data.personalInfo.website = websiteMatch[1];
    }

    // Extract location from personal info section or infer from education/work
    const locationFromEdu = latexCode.match(
      /\\textit{\\small ([^}]*?)}\s*\\\\$/m
    );
    if (locationFromEdu) {
      data.personalInfo.location = locationFromEdu[1];
    }

    // Extract education section
    const educationSection = latexCode.match(
      /\\section{Education}([\\s\\S]*?)(?:\\section|\\end{document})/
    );
    if (educationSection) {
      const educationItems = educationSection[1].match(
        /\\resumeSubheading\s*{(.*?)}{(.*?)}\s*{(.*?)}{(.*?)}/g
      );

      if (educationItems) {
        educationItems.forEach((item) => {
          const matches = item.match(
            /\\resumeSubheading\s*{(.*?)}{(.*?)}\s*{(.*?)}{(.*?)}/
          );
          if (matches) {
            const [_, institution, dates, degree, location] = matches;
            const [degreeType, fieldWithGpa] = degree.split(" in ");
            const gpaMatch = fieldWithGpa?.match(/(.*?);?\s*GPA:\s*([\d\.]+)/);

            let field = fieldWithGpa;
            let gpa = "";

            if (gpaMatch) {
              field = gpaMatch[1];
              gpa = gpaMatch[2];
            }

            const [startDate, endDate] = dates.split(" -- ");

            // If location isn't set yet, use the one from education
            if (!data.personalInfo.location && location) {
              data.personalInfo.location = location;
            }

            data.education.push({
              institution,
              degree: degreeType,
              field,
              gpa,
              startDate,
              endDate,
              location,
            });
          }
        });
      }
    }

    // Extract work experience section
    const workSection = latexCode.match(
      /\\section{Experience}([\\s\\S]*?)(?:\\section|\\end{document})/
    );
    if (workSection) {
      const workBlocks = workSection[1].split("\\resumeSubheading");

      for (let i = 1; i < workBlocks.length; i++) {
        const block = workBlocks[i];
        const headerMatch = block.match(/{(.*?)}{(.*?)}\s*{(.*?)}{(.*?)}/);

        if (headerMatch) {
          const [_, position, dates, company, location] = headerMatch;
          const [startDate, endDate] = dates.split(" -- ");

          // If location isn't set yet, use the one from work
          if (!data.personalInfo.location && location) {
            data.personalInfo.location = location;
          }

          const itemsStart = block.indexOf("\\resumeItemListStart");
          const itemsEnd = block.indexOf("\\resumeItemListEnd");

          let description = "";

          if (itemsStart > -1 && itemsEnd > -1 && itemsStart < itemsEnd) {
            const itemsSection = block.substring(itemsStart, itemsEnd);
            const items = itemsSection.match(/\\resumeItem{(.*?)}/g);

            if (items) {
              description = items
                .map((item) => {
                  const content = item.match(/\\resumeItem{(.*?)}/)?.[1] || "";
                  return "• " + content;
                })
                .join("\n");
            }
          }

          data.workExperience.push({
            position,
            company,
            location,
            startDate,
            endDate: endDate === "Present" ? "" : endDate,
            current: endDate === "Present",
            description,
            // Include a default id that will be overwritten later if needed
            id: i,
          });
        }
      }
    }

    // Extract projects section
    const projectsSection = latexCode.match(
      /\\section{Projects}([\\s\\S]*?)(?:\\section|\\end{document})/
    );
    if (projectsSection) {
      const projectBlocks = projectsSection[1].split("\\resumeProjectHeading");

      for (let i = 1; i < projectBlocks.length; i++) {
        const block = projectBlocks[i];
        const headerMatch = block.match(
          /{\\textbf{(.*?)}(?:.*?\\href{(.*?)}{\\underline{.*?}})?(?:.*?\\href{(.*?)}{\\underline{.*?}})?}{(.*?)}/
        );

        if (headerMatch) {
          const [_, name, url, github, dates] = headerMatch;
          const [startDate, endDate] = dates.split(" -- ");

          // Look for technologies
          const techMatch = block.match(
            /\\resumeItem{\\textbf{Technologies:} (.*?)}/
          );
          const technologies = techMatch ? techMatch[1].split(", ") : [];

          const itemsStart = block.indexOf("\\resumeItemListStart");
          const itemsEnd = block.indexOf("\\resumeItemListEnd");

          let description = "";

          if (itemsStart > -1 && itemsEnd > -1 && itemsStart < itemsEnd) {
            const itemsSection = block.substring(itemsStart, itemsEnd);
            const items = itemsSection.match(
              /\\resumeItem{(?!\\textbf{Technologies})(.*?)}/g
            );

            if (items) {
              description = items
                .map((item) => {
                  const content = item.match(/\\resumeItem{(.*?)}/)?.[1] || "";
                  return "• " + content;
                })
                .join("\n");
            }
          }

          data.projects.push({
            name,
            url,
            github,
            startDate,
            endDate: endDate === "Present" ? "" : endDate,
            current: endDate === "Present",
            technologies,
            description,
          });
        }
      }
    }

    // Extract summary
    const summarySection = latexCode.match(
      /\\section{Summary}([\\s\\S]*?)(?:\\section|\\end{document})/
    );
    if (summarySection) {
      const summaryMatch = summarySection[1].match(/\\resumeItem{(.*?)}/);
      if (summaryMatch) {
        data.professionalSummary = summaryMatch[1];
      }
    }

    // Extract skills
    const skillsSection = latexCode.match(
      /\\section{Technical Skills}([\\s\\S]*?)(?:\\section|\\end{document})/
    );
    if (skillsSection) {
      // Look for languages (programming languages)
      const technicalMatch = skillsSection[1].match(
        /\\textbf{Languages}{: (.*?)(?: \\\\|$)}/
      );
      if (technicalMatch) {
        data.skills.technical = technicalMatch[1]
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Look for technologies
      const softMatch = skillsSection[1].match(
        /\\textbf{Technologies}{: (.*?)(?: \\\\|$)}/
      );
      if (softMatch) {
        data.skills.soft = softMatch[1]
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Look for natural languages
      const languagesMatch = skillsSection[1].match(
        /\\textbf{Languages}{: (.*?)(?:\s*\\\\|$)}(?!.*\\textbf{Languages})/
      );
      if (languagesMatch && !technicalMatch) {
        data.skills.languages = languagesMatch[1]
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (
        languagesMatch &&
        (languagesMatch?.index ?? 0) > (technicalMatch?.index || 0)
      ) {
        // This is the second "Languages" section, assume it's natural languages
        data.skills.languages = languagesMatch[1]
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    return data;
  } catch (error) {
    console.error("Error parsing LaTeX:", error);
    return data;
  }
}
