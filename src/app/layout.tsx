import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./print.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI",
  description: "Create, edit, and optimize your resume with AI-powered tools.",
  generator: "ResumeAI",
  applicationName: "ResumeAI",
  keywords: [
    "resume builder",
    "AI resume generator",
    "resume editor",
    "resume optimization",
    "ATS-friendly resume",
    "resume templates",
    "job application",
    "career tools",
    "resume tips",
    "resume design",
    "resume writing",
    "resume feedback",
    "resume scoring",
    "resume automation",
    "resume management",
    "resume analytics",
    "resume tracking",
    "resume customization",
    "resume creation",
    "resume improvement",
  ],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
