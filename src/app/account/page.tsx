"use client";

import { Header } from "@/components/Header";
import { useEffect, useState } from "react";

type SearchHistoryItem = {
  id: number;
  url: string;
  searched_at: string;
};

export default function AccountPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // get user's search history from history API route
  useEffect(() => {
    const fetchHistory = async () => {
      // try to fetch search history
      try {
        const res = await fetch("/api/history");
        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }
        // set history state based on response data
        const data = await res.json();
        setHistory(data.history);
      } catch (err) {
        setError("Failed to load search history");
      } finally {
        setIsLoading(false);
      }
    };
    // fetch history on component mount
    fetchHistory();
  }, []);
// render account page with search history
  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search History</h2>
            {isLoading ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">No search history yet. Start by searching for a URL!</p>
              </div>
              // if history is found we need to map it and display it in a list
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {history.map((item) => (
                    <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                        >
                          {item.url}
                        </a>
                        <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                          {/* set local time */}
                          {new Date(item.searched_at + ' UTC').toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
