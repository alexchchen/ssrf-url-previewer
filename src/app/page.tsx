/* eslint-disable @next/next/no-img-element */
"use client";

import { Header } from "@/components/Header";
import { URLInput } from "@/components/URLInput";
import { useState } from "react";
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

type URLPreview = {
  hostname: string;
  effectiveURL: string;
  status: number;
  contentType: string;
  ipv4: string | null;
  ipv6: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  dnsRecords: Record<string, string[] | string[][] | null>;
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

    // Call the preview API
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
        hostname: data.hostname,
        effectiveURL: data.effectiveURL,
        status: data.status,
        contentType: data.contentType,
        ipv4: data.ipv4 || null,
        ipv6: data.ipv6 || null,
        city: data.city || null,
        region: data.region || null,
        country: data.country || null,
        dnsRecords: data.dnsRecords || {
          A: null,
          AAAA: null,
          CNAME: null,
        },
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

  const formatDnsRecords = (records: string[] | string[][] | null): string => {
    if (!records) return "N/A";
    if (records.length > 0) {
      return records.flat().join(", ");
    }
    return String(records);
  };

  const countryFlag = (country?: string | null): string => {
    if (!country) return "";
    // If country is an ISO alpha-2 code (e.g. "US"), use it directly.
    // Otherwise try to extract a 2-letter code from common formats like "United States (US)".
    const code =
      country.trim().length === 2
        ? country.trim()
        : country.match(/\(([A-Za-z]{2})\)/)?.[1] ?? country.match(/\b([A-Za-z]{2})\b/)?.[1] ?? "";
    if (!code) return "";
    const points = Array.from(code.toUpperCase()).map((ch) => 0x1F1E6 + ch.charCodeAt(0) - 65);
    return String.fromCodePoint(...points);
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
              <div className="row">
                <h1 className="top break-all text-gray-600">
                  <span id="primaryHostname"> {preview.hostname} </span>
                </h1>
                <br className="" />
              </div>
              <div className="row">
                <div className="text-gray-600">
                  <b>Effective URL:</b>
                  <span>{" " + preview.effectiveURL}</span>
                </div>
              </div>
            <div className="flex flex-col md:flex-row gap-6 mt-6">
               <div className="w-full md:w-1/2">
                 <h4 className="text-xl font-bold mb-4 text-gray-600">Summary</h4> 
                 <p className="text-gray-600"><span className="font-semibold">Description:</span> {preview.description}</p>
                 <p className="text-gray-600"><span className="font-semibold">Status:</span> {preview.status}</p>
                 <p className="text-gray-600"><span className="font-semibold">Content Type:</span> {preview.contentType}</p>
                 <p className="text-gray-600"><span className="font-semibold">IPv4:</span> {preview.ipv4 || "N/A"} {countryFlag(preview.country)}</p>
                 <p className="text-gray-600"><span className="font-semibold">IPv6:</span> {preview.ipv6 || "N/A"} {countryFlag(preview.country)}</p>
                 <h4 className="text-gray-800 font-semibold mb-2">DNS Records:</h4>
                 <ul className="list-disc list-inside">
                  {Object.entries(preview.dnsRecords).map(([type, records]) => (
                    <li key={type} className="text-gray-600">
                      {type}: {formatDnsRecords(records)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/2">
                <h4 className="text-xl font-bold mb-4 text-gray-600">Screenshot</h4>
                {preview.screenshot && (
                  <img 
                    src={preview.screenshot} 
                    alt="Screenshot"
                    className="w-full h-auto rounded-lg shadow"
                  />
                )}
                <h4 className="text-xl font-bold mb-4 text-gray-600">Page Title</h4>
                <p className="text-gray-600">{preview.title}</p>
              </div>
            </div>
            
            <div className="mt-4">

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
