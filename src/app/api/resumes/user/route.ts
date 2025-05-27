import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch resumes for the authenticated user
    const resumes = await prisma.resume.findMany({
      where: {
        userId: userId,
      },
      include: {
        personalInfo: true,
        _count: {
          select: {
            educationItems: true,
            experienceItems: true,
            skills: true,
            projectItems: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform the data for the frontend
    const transformedResumes = resumes.map((resume) => ({
      id: resume.id,
      title: resume.title,
      jobRole: resume.jobRole,
      lastEdited: new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        Math.floor(
          (new Date(resume.updatedAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        ),
        "day"
      ),
      atsScore: resume.atsScore || 0,
      status: resume.atsScore && resume.atsScore > 80 ? "complete" : "draft",
      personalInfo: resume.personalInfo,
      sections: {
        education: resume._count.educationItems,
        experience: resume._count.experienceItems,
        skills: resume._count.skills,
        projects: resume._count.projectItems,
      },
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));

    return NextResponse.json({ resumes: transformedResumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
