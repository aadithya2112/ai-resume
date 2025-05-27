import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateATSScore } from "@/lib/ats-scoring";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const resumeId = id;

    // Fetch the specific resume with all related data
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        personalInfo: true,
        educationItems: {
          orderBy: { order: "asc" },
        },
        experienceItems: {
          orderBy: { order: "asc" },
        },
        skills: {
          orderBy: { order: "asc" },
        },
        projectItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Verify that the resume belongs to the authenticated user
    if (resume.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const resumeId = id;
    const body = await request.json();

    // Verify that the resume belongs to the authenticated user
    const existingResume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { userId: true },
    });

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existingResume.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract resume data from the request
    const {
      personalInfo,
      professionalSummary,
      workExperience,
      projects,
      projectItems, // Add support for projectItems field
      education,
      skills,
      selectedTemplate,
    } = body;

    // Calculate ATS score
    const atsScoreData = calculateATSScore(body);

    // Get project data from projectItems or projects field
    const projectData = projectItems || projects || [];

    // Process skills data from the request
    const technicalSkills = skills?.technical || [];
    const softSkills = skills?.soft || [];
    const languageSkills = skills?.languages || [];

    // Process education data
    const educationData = education || [];

    // Process work experience data
    const workExperienceData = workExperience || [];

    // Update the resume basic info and personal info
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        title: `${personalInfo.firstName || "Untitled"} ${
          personalInfo.lastName || "Resume"
        }`,
        jobRole: personalInfo.jobRole || "Professional",
        latexCode: body.latexCode || selectedTemplate, // Use latexCode if provided, otherwise use selectedTemplate
        atsScore: atsScoreData.score,
        atsNotes: JSON.stringify({
          feedback: atsScoreData.feedback,
          strengths: atsScoreData.strengths,
          improvements: atsScoreData.improvements,
        }),
        personalInfo: {
          update: {
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
        // Update project items if provided
        projectItems: {
          deleteMany: {}, // Remove existing items
          create: Array.isArray(projectData)
            ? projectData.map((project, index) => ({
                title: project.title || project.name || "Untitled Project",
                description: project.description || "",
                technologies: Array.isArray(project.technologies)
                  ? project.technologies
                  : [],
                link: project.link || project.url || "",
                startDate: project.startDate
                  ? new Date(project.startDate)
                  : null,
                endDate: project.endDate ? new Date(project.endDate) : null,
                isOngoing: project.isOngoing || project.current || false,
                order: index,
              }))
            : [],
        },
        // Update skills if provided
        skills: {
          deleteMany: {}, // Remove existing skills
          create: [
            ...technicalSkills.map((skill: string, index: number) => ({
              name: skill,
              category: "Technical Skills",
              order: index,
            })),
            ...softSkills.map((skill: string, index: number) => ({
              name: skill,
              category: "Soft Skills",
              order: index + technicalSkills.length,
            })),
            ...languageSkills.map((skill: string, index: number) => ({
              name: skill,
              category: "Languages",
              order: index + technicalSkills.length + softSkills.length,
            })),
          ],
        },
        // Update education items if provided
        educationItems: {
          deleteMany: {}, // Remove existing education items
          create: Array.isArray(educationData)
            ? educationData.map((edu: any, index: number) => ({
                institution: edu.institution || "",
                degree: edu.degree || "",
                fieldOfStudy: edu.field || "",
                location: edu.location || "",
                gpa: edu.gpa || "",
                startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
                endDate: edu.endDate ? new Date(edu.endDate) : null,
                description: edu.description || "",
                order: index,
              }))
            : [],
        },
        // Update work experience items if provided
        experienceItems: {
          deleteMany: {}, // Remove existing experience items
          create: Array.isArray(workExperienceData)
            ? workExperienceData.map((exp: any, index: number) => ({
                company: exp.company || "",
                position: exp.position || "",
                location: exp.location || "",
                startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                isCurrentRole: exp.isCurrentRole || exp.current || false,
                description: exp.description || "",
                enhancedDesc: exp.enhancedDesc || null,
                order: index,
              }))
            : [],
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resume updated successfully",
        resume: updatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const resumeId = id;

    // First, verify that the resume belongs to the authenticated user
    const existingResume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { userId: true },
    });

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existingResume.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the resume (this will cascade delete related records due to schema constraints)
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
