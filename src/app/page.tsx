/* eslint-disable @next/next/no-img-element */
"use client";

import { Header } from "@/components/Header";
import { URLInput } from "@/components/URLInput";
import { useState } from "react";

type URLPreview = {
  url: string;
  status: number;
  title: string | null;
  description: string | null;
  image: string | null;
  screenshot: string | null;
};

export default function Home() {
  const [preview, setPreview] = useState<URLPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch preview");
      }

      const data = await res.json();

      const previewData: URLPreview = {
        url: data.url || url,
        status: data.status,
        title: data.title ?? null,
        description: data.description ?? null,
        image: data.image ?? null,
        screenshot: data.screenshot ?? null,
      };

      setPreview(previewData);
    } catch (err) {
      console.error(err);
      setError("Failed to load preview. Please check the URL and try again.");
      setPreview(null);
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* TODO: Display the output nicely */}
        {preview && (
          <div className="mt-6">
            <p className="text-gray-600">URL: {preview.url}</p>
            <p className="text-gray-600">Status: {preview.status}</p>
            <p className="text-gray-600">Title: {preview.title}</p>
            <p className="text-gray-600">Description: {preview.description}</p>
            {preview.image && (
              <>
                <p className="text-gray-600">Image:</p>
                <img src={preview.image} alt="Image" width={500} height={300} />
              </>
            )}
            {preview.screenshot && (
              <>
                <p className="text-gray-600">Screenshot:</p>
                <img
                  src={preview.screenshot}
                  alt="Screenshot"
                  width={500}
                  height={300}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
