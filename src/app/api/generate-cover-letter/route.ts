import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Use OpenAI to generate a cover letter
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career counselor specializing in writing compelling cover letters.",
        },
        {
          role: "user",
          content: `Generate a professional cover letter based on my resume and the job description.
          
          Resume:
          ${resumeText}
          
          Job Description:
          ${jobDescription}
          
          Write a personalized cover letter that highlights my relevant skills and experience for this specific job.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const coverLetter = completion.choices[0].message.content;

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
