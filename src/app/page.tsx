"use client";

import { Header } from "@/components/Header";
import { URLInput } from "@/components/URLInput";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (url: string) => {
    setIsLoading(true);
    console.log("Submitted URL:", url);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">URL Preview</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter any URL to see a preview with its title, description, and
            image.
          </p>
        </div>
        <URLInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
