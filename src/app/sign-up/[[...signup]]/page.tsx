"use client";
import { SignUp, useSignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { FaBolt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define type for background element
interface BackgroundElement {
  width: number;
  height: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
}

export default function SignUpPage(): React.ReactNode {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // State to store our random values - initially empty
  const [backgroundElements, setBackgroundElements] = useState<
    BackgroundElement[]
  >([]);

  // Generate random values only on the client side after component mounts
  useEffect(() => {
    const elements: BackgroundElement[] = Array(6)
      .fill(0)
      .map(() => ({
        width: Math.random() * 400 + 100,
        height: Math.random() * 400 + 100,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: Math.random() * 10 + 15,
      }));
    setBackgroundElements(elements);
  }, []);

  // Function to save user to database
  const saveUserToDatabase = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save user to database");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-purple-950/20 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute h-full w-full overflow-hidden">
        {backgroundElements.map((element, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float"
            style={{
              width: `${element.width}px`,
              height: `${element.height}px`,
              background: `radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(14,165,233,0.1) 70%)`,
              left: `${element.left}%`,
              top: `${element.top}%`,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${element.animationDuration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[500px] px-4 mx-auto py-8">
        {/* Logo with enhanced animation - centered */}
        <div className="flex items-center justify-center space-x-3 mb-8 fade-in-down">
          <div className="relative">
            <FaBolt className="h-10 w-10 text-blue-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
            ResumeAI
          </span>
        </div>

        {/* Sign-up form - properly aligned */}
        <div className="w-full fade-in-up">
          {/* Card with enhanced glassmorphism effect */}
          <div className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-500/20 relative overflow-hidden p-6 md:p-8">
            {/* Decorative element */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 filter blur-xl"></div>

            {/* Enhanced Clerk SignUp with correct alignment */}
            <div className="flex justify-center w-full">
              {isSubmitting && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-200">
                      Setting up your account...
                    </p>
                  </div>
                </div>
              )}
              {signUpError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded-lg">
                  {signUpError}
                </div>
              )}
              <SignUp
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/auth/signup-complete"
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-medium py-3",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-2xl font-bold text-white",
                    headerSubtitle: "text-gray-300",
                    formFieldLabel: "text-gray-200 font-medium",
                    formFieldInput:
                      "bg-gray-800/70 border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-white rounded-lg transition-all duration-200",
                    footerActionLink:
                      "text-blue-500 hover:text-blue-400 underline-offset-2 font-medium",
                    // Improved social button visibility
                    socialButtonsBlockButton:
                      "border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-500 shadow-md transition-all duration-200",
                    socialButtonsBlockButtonText: "text-white font-medium",
                    socialButtonsBlockButtonIconContainer:
                      "bg-white rounded-full p-1",
                    dividerLine: "bg-gray-700",
                    dividerText: "text-gray-400 bg-gray-900/60 px-3",
                    formFieldAction:
                      "text-blue-500 hover:text-blue-400 font-medium",
                    formHeaderTitle:
                      "text-2xl font-bold text-gray-900 dark:text-white",
                    formHeaderSubtitle: "text-gray-600 dark:text-gray-300",
                    alert:
                      "bg-blue-500/10 border border-blue-500/20 text-blue-200",
                    alternativeMethodsBlockButton:
                      "text-blue-500 hover:text-blue-400",
                    rootBox: "w-full", // Ensure Clerk component takes full width
                  },
                  variables: {
                    colorBackground: "transparent",
                    colorInputBackground: "rgba(31, 41, 55, 0.7)",
                    colorInputText: "white",
                    colorText: "white",
                    fontFamily: "Inter, system-ui, sans-serif",
                    borderRadius: "0.75rem",
                  },
                  layout: {
                    socialButtonsVariant: "iconButton",
                    socialButtonsPlacement: "bottom",
                    termsPageUrl: "https://clerk.dev/terms",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Policy links - centered with proper spacing */}
        <div
          className="mt-6 text-center text-xs text-gray-500 fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="px-2">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-500 hover:text-blue-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-500 hover:text-blue-400">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to home link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
          >
            <span className="mr-1">←</span> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
