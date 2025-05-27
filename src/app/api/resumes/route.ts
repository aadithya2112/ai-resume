import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { calculateATSScore } from "@/lib/ats-scoring";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log("API: Received request to create resume:", body);

    // Check if the user exists in our database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Extract resume data from the request
    const {
      personalInfo,
      professionalSummary,
      workExperience,
      projects,
      education,
      skills,
      selectedTemplate,
    } = body;

    // Calculate ATS score
    const atsScoreData = calculateATSScore(body);

    // Create new resume - make sure all fields have values or defaults
    const resume = await prisma.resume.create({
      data: {
        userId: userId,
        title: `${personalInfo.firstName || "Untitled"} ${
          personalInfo.lastName || "Resume"
        }`,
        jobRole: personalInfo.jobRole || "Professional",
        personalInfo: {
          create: {
            fullName:
              `${personalInfo.firstName || ""} ${
                personalInfo.lastName || ""
              }`.trim() || "Untitled",
            email: personalInfo.email || "",
            phone: personalInfo.phone || "",
            location: personalInfo.location || "",
            linkedin: personalInfo.linkedin || "",
            website: personalInfo.website || "",
            github: personalInfo.github || "",
            summary: professionalSummary || "",
          },
        },
        educationItems: {
          create: education.map((edu: any, index: number) => {
            // Create a default date if startDate is empty or invalid
            const startDate =
              edu.startDate && edu.startDate.trim() !== ""
                ? new Date(edu.startDate)
                : new Date();

            // Make sure the date is valid
            const validStartDate = !isNaN(startDate.getTime())
              ? startDate
              : new Date();

            // Handle endDate - could be null if empty
            let endDate = null;
            if (edu.endDate && edu.endDate.trim() !== "") {
              const parsedEndDate = new Date(edu.endDate);
              if (!isNaN(parsedEndDate.getTime())) {
                endDate = parsedEndDate;
              }
            }

            return {
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.field,
              startDate: validStartDate,
              endDate: endDate,
              gpa: edu.gpa,
              location: edu.location,
              order: index,
            };
          }),
        },
        experienceItems: {
          create: workExperience.map((exp: any, index: number) => {
            // Create a default date if startDate is empty or invalid
            const startDate =
              exp.startDate && exp.startDate.trim() !== ""
                ? new Date(exp.startDate)
                : new Date();

            // Make sure the date is valid
            const validStartDate = !isNaN(startDate.getTime())
              ? startDate
              : new Date();

            // Handle endDate - could be null if empty or if current role
            let endDate = null;
            if (exp.endDate && !exp.current && exp.endDate.trim() !== "") {
              const parsedEndDate = new Date(exp.endDate);
              if (!isNaN(parsedEndDate.getTime())) {
                endDate = parsedEndDate;
              }
            }

            return {
              company: exp.company || "",
              position: exp.position || "",
              location: exp.location || "",
              startDate: validStartDate,
              endDate: endDate,
              isCurrentRole: Boolean(exp.current),
              description: exp.description || "",
              order: index,
            };
          }),
        },
        projectItems: {
          create: projects.map((proj: any, index: number) => {
            // Handle startDate - could be null if empty
            let startDate = null;
            if (proj.startDate && proj.startDate.trim() !== "") {
              const parsedStartDate = new Date(proj.startDate);
              if (!isNaN(parsedStartDate.getTime())) {
                startDate = parsedStartDate;
              }
            }

            // Handle endDate - could be null if empty or if ongoing
            let endDate = null;
            if (proj.endDate && !proj.current && proj.endDate.trim() !== "") {
              const parsedEndDate = new Date(proj.endDate);
              if (!isNaN(parsedEndDate.getTime())) {
                endDate = parsedEndDate;
              }
            }

            return {
              title: proj.name || "",
              description: proj.description || "",
              technologies: Array.isArray(proj.technologies)
                ? proj.technologies
                : [],
              startDate: startDate,
              endDate: endDate,
              isOngoing: Boolean(proj.current),
              link: proj.url || proj.github || "",
              order: index,
            };
          }),
        },
        skills: {
          create: [
            ...skills.technical.map((skill: string, index: number) => ({
              name: skill,
              category: "Technical",
              order: index,
            })),
            ...skills.soft.map((skill: string, index: number) => ({
              name: skill,
              category: "Soft Skills",
              order: index + skills.technical.length,
            })),
            ...skills.languages.map((skill: string, index: number) => ({
              name: skill,
              category: "Languages",
              order: index + skills.technical.length + skills.soft.length,
            })),
          ],
        },
        // Store the selected template and ATS data
        latexCode: selectedTemplate, // For now, just storing the template name
        atsScore: atsScoreData.score,
        atsNotes: JSON.stringify({
          feedback: atsScoreData.feedback,
          strengths: atsScoreData.strengths,
          improvements: atsScoreData.improvements,
        }),
      },
    });

    console.log("API: Resume created successfully:", resume);

    // Return the created resume
    return NextResponse.json(
      {
        success: true,
        message: "Resume created successfully",
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API: Error creating resume:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to create resume: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get all resumes for the user
    const resumes = await prisma.resume.findMany({
      where: {
        userId: userId,
      },
      include: {
        personalInfo: true,
        educationItems: true,
        experienceItems: true,
        projectItems: true,
        skills: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("API: Error fetching resumes:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch resumes: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
