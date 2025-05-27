"use client";

import { useState } from "react";

interface DownloadPDFButtonProps {
  latexCode?: string; // Make it optional
  className?: string;
  disabled?: boolean;
}

export default function DownloadPDFButton({
  latexCode,
  className = "",
  disabled = false,
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!latexCode || !latexCode.trim()) {
      setError("LaTeX code is empty");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Sending LaTeX code to API...");

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latexCode }),
      });

      if (!response.ok) {
        // Try to get error message as text first
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(
          errorText || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Check content type to ensure we're getting a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        console.error("Unexpected content type:", contentType);
        const textContent = await response.text();
        console.error("Response content:", textContent.substring(0, 500));
        throw new Error(
          "Server didn't return a PDF document. See console for details."
        );
      }

      // Create blob from response
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Received empty PDF file");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("PDF downloaded successfully!");
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={disabled || isGenerating || !latexCode || !latexCode.trim()}
        className={`
          px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition-all duration-200
          font-medium shadow-md hover:shadow-lg
          ${className}
        `}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Generating PDF...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </>
        )}
      </button>

      {error && (
        <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
