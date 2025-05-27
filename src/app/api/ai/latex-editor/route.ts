import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log("LaTeX Editor API - Starting request processing");

    const { userId } = await auth();

    if (!userId) {
      console.log("LaTeX Editor API - No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("LaTeX Editor API - User authenticated:", userId);

    if (!process.env.OPENAI_API_KEY) {
      console.log("LaTeX Editor API - OpenAI API key not found in environment");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log("LaTeX Editor API - OpenAI API key found");

    const body = await request.json();
    const { latexCode, prompt } = body;

    console.log("LaTeX Editor API - Request body parsed:", {
      hasLatexCode: !!latexCode,
      promptLength: prompt?.length,
      prompt: prompt?.substring(0, 100) + "...", // Log first 100 chars
    });

    if (!latexCode || !prompt) {
      console.log("LaTeX Editor API - Missing required fields");
      return NextResponse.json(
        { error: "LaTeX code and prompt are required" },
        { status: 400 }
      );
    }

    // Create a comprehensive system prompt for LaTeX resume editing
    const systemPrompt = `You are an expert LaTeX resume editor and career advisor. Your task is to modify LaTeX resume code based on user requests.

CRITICAL REQUIREMENTS:
1. You must return a JSON response with exactly this structure:
{
  "summary": "brief description of what was changed/added",
  "latexCode": "the complete modified LaTeX code here"
}

2. The latexCode field must contain complete, valid LaTeX code that compiles
3. The summary field should be a concise, specific description of modifications made (e.g., "Added 3 new skills to the technical skills section", "Enhanced work experience bullet points with quantifiable metrics", "Improved professional summary with industry keywords")
4. Do not include any other text outside the JSON structure
5. Ensure the LaTeX code is properly formatted and escaped

LATEX EDITING GUIDELINES:
- If input is not LaTeX (e.g., "modern" template name), generate complete LaTeX resume
- Maintain document structure and professional formatting
- Preserve essential LaTeX commands and packages
- Use proper LaTeX syntax and escaping
- Focus on content improvements while keeping structure intact

COMMON TASKS:
- Expand summaries with specific achievements and skills
- Add quantifiable metrics and results (percentages, numbers, impact)
- Improve action verbs and professional language
- Optimize for ATS compatibility with relevant keywords
- Enhance technical skills and project descriptions
- Adjust formatting for better readability
- Add missing sections if requested

RESPONSE FORMAT: Return only valid JSON with "summary" and "latexCode" fields. Make the summary description specific and actionable.`;

    const userPrompt = `User Request: "${prompt}"

Current LaTeX Code:
${latexCode}

Please modify the LaTeX code according to the user's request and return the result in the specified JSON format.

${
  latexCode.length < 50
    ? "Note: The current code appears to be a template name. Please generate a complete professional LaTeX resume incorporating the user's request."
    : ""
}`;

    console.log(
      "LaTeX Editor API - Making OpenAI request with prompt length:",
      userPrompt.length
    );

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent and reliable outputs
        max_tokens: 4000,
      });

      console.log("LaTeX Editor API - OpenAI response received");
    } catch (openaiError: any) {
      console.error("LaTeX Editor API - OpenAI API error:", openaiError);

      if (openaiError?.error?.type === "insufficient_quota") {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded. Please check your billing." },
          { status: 429 }
        );
      }

      if (openaiError?.error?.type === "invalid_api_key") {
        return NextResponse.json(
          { error: "Invalid OpenAI API key" },
          { status: 401 }
        );
      }

      if (openaiError?.code === "insufficient_quota") {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded. Please check your billing." },
          { status: 429 }
        );
      }

      throw openaiError; // Re-throw to be caught by outer try-catch
    }

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      console.log("LaTeX Editor API - No content in OpenAI response");
      return NextResponse.json(
        { error: "Failed to generate modified LaTeX code" },
        { status: 500 }
      );
    }

    console.log(
      "LaTeX Editor API - Generated content preview:",
      responseContent.substring(0, 200)
    );

    // Parse the JSON response from OpenAI
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
      console.log("LaTeX Editor API - Successfully parsed JSON response");
    } catch (parseError) {
      console.log(
        "LaTeX Editor API - Failed to parse JSON response, attempting to extract structured data"
      );

      // Try to extract LaTeX code and summary from non-JSON response
      const latexMatch = responseContent.match(/```latex\n([\s\S]*?)\n```/);
      const summaryMatch = responseContent.match(
        /(?:Summary|Changes?):\s*(.+?)(?:\n|$)/i
      );

      if (latexMatch && latexMatch[1]) {
        parsedResponse = {
          latexCode: latexMatch[1].trim(),
          summary: summaryMatch
            ? summaryMatch[1].trim()
            : "Modified LaTeX code according to your request",
        };
        console.log(
          "LaTeX Editor API - Extracted LaTeX from markdown code block"
        );
      } else {
        // Final fallback: treat the entire response as LaTeX code
        parsedResponse = {
          latexCode: responseContent.trim(),
          summary: "Modified LaTeX code according to your request",
        };
        console.log("LaTeX Editor API - Using entire response as LaTeX code");
      }
    }

    const { latexCode: modifiedLatexCode, summary } = parsedResponse;

    if (!modifiedLatexCode) {
      console.log("LaTeX Editor API - No LaTeX code in parsed response");
      return NextResponse.json(
        { error: "Failed to generate modified LaTeX code" },
        { status: 500 }
      );
    }

    // Validate that we have LaTeX-like content
    const hasLatexElements =
      modifiedLatexCode.includes("\\") ||
      modifiedLatexCode.includes("{") ||
      modifiedLatexCode.includes("}") ||
      modifiedLatexCode.includes("\\documentclass") ||
      modifiedLatexCode.includes("\\begin") ||
      modifiedLatexCode.includes("\\section") ||
      modifiedLatexCode.includes("\\item");

    if (!hasLatexElements && latexCode.length > 10) {
      console.log(
        "LaTeX Editor API - Generated content doesn't appear to be LaTeX"
      );
      return NextResponse.json(
        { error: "Generated code does not appear to be valid LaTeX" },
        { status: 500 }
      );
    }

    console.log("LaTeX Editor API - Successfully processed request");

    return NextResponse.json({
      success: true,
      latexCode: modifiedLatexCode.trim(),
      summary: summary || "Modified LaTeX code according to your request",
      originalPrompt: prompt,
      tokensUsed: completion.usage?.total_tokens || 0,
    });
  } catch (error: any) {
    console.error("Error in LaTeX editor API:", error);

    // Handle specific OpenAI errors
    if (error?.error?.type === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded. Please check your billing." },
        { status: 429 }
      );
    }

    if (error?.error?.type === "invalid_api_key") {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process LaTeX editing request" },
      { status: 500 }
    );
  }
}
