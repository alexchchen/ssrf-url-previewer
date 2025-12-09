"use client";
import { useState } from "react";

import { ArrowRight, Link2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">URL Preview</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter any URL to see a preview with its title, description, and
            image.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL (e.g., github.com, youtube.com, reddit.com)"
            className="text-black w-full pl-12 pr-32 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer transition-colors flex items-center gap-2"
          >
            Preview
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
