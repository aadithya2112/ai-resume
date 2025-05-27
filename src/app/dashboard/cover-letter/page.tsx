"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

declare global {
  interface Window {
    "pdfjs-dist/build/pdf": any;
    pdfjsLib: any;
  }
}

export default function CoverLetterPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Function to handle PDF upload and extract text
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    setError("");
    setIsLoading(true);

    try {
      // Using PDF.js for text extraction from PDF
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);

        // Access PDF.js with proper typing
        const pdfjsLib = window["pdfjs-dist/build/pdf"];
        if (!pdfjsLib) {
          setError("PDF.js library not loaded");
          setIsLoading(false);
          return;
        }

        try {
          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;

          // Extract text from all pages
          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            extractedText += pageText + "\n";
          }

          setResumeText(extractedText);
          setIsLoading(false);
        } catch (err) {
          console.error("Error parsing PDF:", err);
          setError("Failed to parse PDF. Please try again.");
          setIsLoading(false);
        }
      };

      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Failed to read file. Please try again.");
      setIsLoading(false);
    }
  };

  // Function to generate cover letter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText) {
      setError("Please upload your resume first");
      return;
    }

    if (!jobDescription) {
      setError("Please enter the job description");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setError("Failed to generate cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        } p-6`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">
            Generate Cover Letter
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Resume Upload Section */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-slate-700 dark:text-slate-300">
                  Upload Resume (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PDF files only
                    </p>
                  </div>
                </div>
                {fileName && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{fileName}</span>
                  </p>
                )}
                {resumeText && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Resume Content Preview:
                    </p>
                    <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-md overflow-auto max-h-40">
                      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                        {resumeText.substring(0, 300)}
                        {resumeText.length > 300 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description Section */}
              <div className="space-y-3">
                <label
                  htmlFor="jobDescription"
                  className="block text-base font-medium text-slate-700 dark:text-slate-300"
                >
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  rows={6}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 
                    dark:text-slate-100 p-4 transition duration-150 ease-in-out"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !resumeText || !jobDescription}
                  className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-6 border border-transparent 
                    shadow-sm text-base font-medium rounded-md text-white bg-blue-600 
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed
                    transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate Cover Letter"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {coverLetter && (
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Your Cover Letter
                </h2>
                <button
                  onClick={handleCopyToClipboard}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 
                    dark:border-slate-700 text-sm font-medium rounded-md 
                    text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800
                    hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 010 2h-2v-2z" />
                      </svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                {coverLetter}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
