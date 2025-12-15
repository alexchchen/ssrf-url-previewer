"use client";

import {
  LogIn,
  UserPlus,
  User,
  LogOut,
  ChevronDown,
  Home,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Function to check authentication status so that header is correctly rendered
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setIsLoggedIn(data.isAuthenticated);
    } catch (error) {
      console.log("Error checking auth status:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Check auth when component mounts page loads
    checkAuth();

    // contionusly check auth every 2 seconds to ensure state is up to date
    const interval = setInterval(checkAuth, 2000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // show header based on authentication status
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">URL Preview</span>
          </Link>
          {/* if the user is logged in it will show this header */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* if the user is logged in depending on page they are on header will update accordingly (account and home page) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {pathname === "/account" ? (
                      <Link
                        href="/"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          <span>Home</span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>My Account</span>
                        </div>
                      </Link>
                    )}
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* if the user is not logged in it will show this header */}
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
