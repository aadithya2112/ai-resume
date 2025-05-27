"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { FaCheck, FaFileAlt, FaMagic, FaBolt } from "react-icons/fa";

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
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-5 mb-6 shadow-lg max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-white text-center">
            Cover Letter Generator
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Upload your resume and job description to create a tailored cover
            letter
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-screen-xl mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md flex items-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-screen-xl mx-auto">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Upload Your Resume
                  </h2>
                </div>

                <div
                  className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 
                            bg-slate-100 dark:bg-slate-700/30 hover:bg-slate-200 dark:hover:bg-slate-700/50 
                            transition-colors cursor-pointer text-center"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <svg
                    className="w-10 h-10 mx-auto text-slate-500 dark:text-slate-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>

                  <div className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {fileName
                      ? "Resume uploaded!"
                      : "Click to upload your resume"}
                  </div>
                  <p className="text-sm text-slate-500/70 dark:text-slate-400/70">
                    {fileName || "PDF files only"}
                  </p>

                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Preview Section */}
                {resumeText && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                      <FaFileAlt className="h-4 w-4 mr-1 text-blue-500" />
                      Resume Content Preview
                    </h3>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50 rounded-md overflow-auto max-h-32 text-xs text-slate-700 dark:text-slate-300">
                      {resumeText.substring(0, 300)}
                      {resumeText.length > 300 ? "..." : ""}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Enter Job Description
                  </h2>
                </div>
                <textarea
                  id="jobDescription"
                  rows={5}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full rounded-md border-slate-300 dark:border-slate-600
                    shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-30
                    dark:bg-slate-800/80 dark:text-slate-200 p-3"
                />
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isLoading || !resumeText || !jobDescription}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 
                  hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-bold rounded-lg 
                  shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:from-blue-500 disabled:hover:to-cyan-500 focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:ring-opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
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
                    Generating Cover Letter...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaMagic className="h-5 w-5 mr-2" />
                    Generate Cover Letter
                  </div>
                )}
              </button>
            </form>

            {/* Tips Section */}
            <div className="bg-slate-100 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
                  <FaCheck className="h-3 w-3 text-white" />
                </div>
                <h3 className="text-slate-800 dark:text-slate-200 font-medium">
                  Tips for a Great Cover Letter
                </h3>
              </div>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-inside ml-2">
                <li className="flex items-start">
                  <FaCheck className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Tailor your letter to the specific job and company
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Be concise and keep your letter to one page</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Proofread for grammar and spelling errors</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Highlight your most relevant experiences</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="h-full">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md h-full border border-slate-200 dark:border-slate-700/50 flex flex-col">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FaBolt className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Your Cover Letter
                  </h2>
                </div>
                {coverLetter && (
                  <button
                    onClick={handleCopyToClipboard}
                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500
                      hover:from-blue-600 hover:to-cyan-600 text-sm font-medium rounded-md text-white 
                      transition-colors duration-150 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {copied ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-auto p-6">
                {coverLetter ? (
                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                      <FaBolt className="w-8 h-8 text-blue-500/70" />
                    </div>
                    <h3 className="text-xl font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      No Cover Letter Generated Yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Upload your resume and enter a job description, then click
                      the generate button.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
