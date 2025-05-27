import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import puppeteer from "puppeteer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  let browser;

  try {
    const { latexCode } = await request.json();

    if (!latexCode) {
      return NextResponse.json(
        { error: "LaTeX code is required" },
        { status: 400 }
      );
    }

    console.log("Converting LaTeX to HTML using OpenAI...");

    // Use OpenAI to convert LaTeX to HTML with more precise formatting instructions
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a LaTeX to HTML converter specializing in professional resume formatting. Convert the given LaTeX code to clean, professional HTML that precisely represents a resume with proper layout and spacing.

    Rules:
    1. Create a PRECISE representation of the LaTeX resume in HTML with exact spacing and structure
    2. Use a clean, minimal design with appropriate whitespace that matches LaTeX output
    3. Use small font sizes (10-12pt equivalent) with appropriate line heights for resumes
    4. Create compact sections with minimal spacing between elements, as seen in LaTeX resumes
    5. Use proper semantic HTML structure with appropriate heading levels
    6. Format dates and locations on the right side of entries, as commonly seen in resumes
    7. Use subtle styling for section dividers with minimal borders (light gray, thin lines)
    8. Keep margins minimal (0.5in or less) to maximize content space
    9. Format bullet points and lists with proper indentation and minimal spacing
    10. Use a professional font stack: 'Roboto', 'Arial', sans-serif for headings, 'Georgia', 'Times New Roman', serif for body
    11. DO NOT include any markdown formatting, HTML tags as text, code blocks, or triple backticks in your output
    12. Your output should be clean, pure HTML content that can be directly inserted into an HTML document
    13. Avoid using meta tags and other HTML header components - these will be provided separately
    14. Use simple, standard HTML that renders consistently across browsers
    15. Keep all styling simple and compatible with PDF generation
    16. If you need to explain anything, do not include it in the generated HTML

    Generate ONLY the HTML content for the resume body with appropriate minimal styling, no explanations.`,
        },
        {
          role: "user",
          content: `Convert this LaTeX code to HTML that precisely maintains the same formatting, layout, and professional appearance:\n\n${latexCode}`,
        },
      ],
      temperature: 0.1,
    });

    let htmlContent = completion.choices[0]?.message?.content || "";

    if (!htmlContent) {
      return NextResponse.json(
        { error: "Failed to convert LaTeX to HTML" },
        { status: 500 }
      );
    }

    console.log("Raw HTML content length:", htmlContent.length);

    // Check for problematic tags that might cause rendering issues
    const hasDoctype = htmlContent.includes("<!DOCTYPE");
    const hasHtmlTag = htmlContent.includes("<html");
    const hasHeadTag = htmlContent.includes("<head>");
    const hasMetaTag = htmlContent.includes("<meta");

    console.log("HTML content diagnostic:", {
      hasDoctype,
      hasHtmlTag,
      hasHeadTag,
      hasMetaTag,
    });

    // Clean up any visible HTML tags or code blocks that might appear in the content
    htmlContent = htmlContent
      // Remove any markdown code blocks
      .replace(/```html/g, "")
      .replace(/```/g, "")
      // Remove any HTML tag displays that might be showing up as text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      // Clean up any extra line breaks or spacing
      .replace(/\n\s*\n/g, "\n")
      // Remove any stray meta tags that could be causing issues
      .replace(/<meta[^>]*>/g, "")
      // Remove any DOCTYPE declarations
      .replace(/<!DOCTYPE[^>]*>/g, "")
      // Remove any full HTML structure if accidentally included
      .replace(/<html[^>]*>|<\/html>/g, "")
      .replace(/<head>.*?<\/head>/g, "")
      .replace(/<body[^>]*>|<\/body>/g, "");

    // Add a fallback if content seems empty or problematic
    if (htmlContent.trim().length < 50) {
      console.warn(
        "HTML content seems too short or empty. Using fallback content."
      );
      htmlContent = `<h1>Resume</h1><p>The resume content could not be properly generated. Please try again or contact support if this issue persists.</p>`;
    }

    // Log the first 200 chars of processed HTML
    console.log(
      "Processed HTML content (first 200 chars):",
      htmlContent.substring(0, 200)
    );

    console.log("Creating PDF from HTML...");

    // Create a simpler HTML document that's less likely to have rendering issues
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <style>
            /* Basic reset to ensure consistent rendering */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            /* Basic page setup */
            html, body {
              width: 100%;
              font-family: 'Times New Roman', serif;
              font-size: 11pt;
              line-height: 1.3;
              color: #000;
              background: white;
            }
            
            /* Main container */
            .resume-container {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              padding: 10mm;
            }
            
            /* Headings */
            h1 {
              font-size: 16pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 5mm;
            }
            
            h2 {
              font-size: 12pt;
              font-weight: bold;
              margin-top: 5mm;
              margin-bottom: 3mm;
              border-bottom: 0.5pt solid #777;
              padding-bottom: 1mm;
            }
            
            h3 {
              font-size: 11pt;
              font-weight: bold;
              margin-bottom: 1mm;
            }
            
            /* Text styling */
            p {
              margin-bottom: 2mm;
              text-align: justify;
            }
            
            /* Lists */
            ul, ol {
              padding-left: 5mm;
              margin-bottom: 3mm;
            }
            
            li {
              margin-bottom: 1mm;
            }
            
            /* Table for layout (if needed) */
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            /* Ensure text wrapping */
            * {
              white-space: normal;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    // Launch Puppeteer
    console.log("Launching browser...");
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set page content and ensure it's loaded properly
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    // Debug: Log the page content to see if it's loading correctly
    const pageContent = await page.content();
    console.log(
      "Page content loaded successfully. Length:",
      pageContent.length
    );

    // Wait a moment to ensure all resources are loaded
    await new Promise((resolve) => setTimeout(resolve, 500)); // Add safety measure to ensure content fits properly
    await page.evaluate(() => {
      // Find any elements that might be overflowing
      const overflowingElements = [...document.querySelectorAll("*")].filter(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > document.documentElement.clientWidth;
        }
      );

      // Log any overflowing elements
      if (overflowingElements.length > 0) {
        console.log(
          `Found ${overflowingElements.length} overflowing elements. Fixing...`
        );
        // Apply fix to any overflowing elements
        overflowingElements.forEach((el) => {
          // Cast to HTMLElement to access style property
          const htmlEl = el as HTMLElement;
          htmlEl.style.maxWidth = "100%";
          htmlEl.style.overflowWrap = "break-word";
          htmlEl.style.wordWrap = "break-word";
        });
      }
    });

    // Generate PDF with custom width to ensure content fits properly
    const pdfBuffer = await page.pdf({
      width: "8.5in", // US Letter width
      height: "11in", // US Letter height
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
      printBackground: true,
      preferCSSPageSize: false, // Use our exact dimensions
    });

    await browser.close();

    console.log("PDF generated successfully!");

    // Convert Uint8Array to Buffer for NextResponse
    const buffer = Buffer.from(pdfBuffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error("PDF generation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Return a plain text error message for easier debugging
    return new Response(
      `PDF Generation Error: ${errorMessage}. Check the server logs for more details.`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }
}
