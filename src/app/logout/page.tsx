"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setIsLoggingOut(false);
        // Redirect to home page after logout
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {isLoggingOut ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-700">Logging out...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-700">Logged out successfully</h1>
            <p className="text-gray-600">Redirecting to home page...</p>
          </>
        )}
      </div>
    </div>
  );
}
