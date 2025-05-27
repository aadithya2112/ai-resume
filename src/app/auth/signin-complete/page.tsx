"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SignInComplete() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until Clerk loads the user data
    if (!isLoaded || !userId || !user) return;

    const saveUserToDatabase = async () => {
      try {
        console.log("Saving user to database after sign in:", {
          id: userId,
          email: user.primaryEmailAddress?.emailAddress,
        });

        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-flow": "signin", // Indicate this is coming from sign-in flow
          },
          body: JSON.stringify({
            id: userId,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });

        const data = await response.json();
        console.log("API response:", { status: response.status, data });

        if (!response.ok) {
          throw new Error(data.error || "Failed to save user to database");
        }

        // Successfully saved user to database, redirect to dashboard
        router.push("/dashboard");
      } catch (error: any) {
        console.error("Error saving user to database:", error);
        setError(error.message || "Failed to complete sign-in process");
        setIsProcessing(false);
      }
    };

    saveUserToDatabase();
  }, [isLoaded, userId, user, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg max-w-md w-full text-center">
          {/* <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p> */}
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Signing you in
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Just a moment while we complete the process...
        </p>
      </div>
    </div>
  );
}
