"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, LogOut, Moon, Sun } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className={`border-b ${isDarkMode ? "bg-surface border-default" : "bg-primary-bg border-default"}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity">
              {/* Lattice Logo Icon */}
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-purple-700" : "bg-gradient-to-br from-purple-500 to-blue-500"}`}>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
              </div>
              <span 
                className="text-lg sm:text-xl md:text-2xl font-bold text-primary"
              >
                Dissertation Scaffold
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link
                href="/community"
                className={`flex items-center px-3 py-2 text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Community
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/pricing"
                className={`flex items-center px-3 py-2 text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Pricing
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/resources"
                className={`flex items-center px-3 py-2 text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Resources
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? "text-secondary hover:bg-surface-muted" : "text-secondary hover:bg-surface-muted"}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoading ? (
              // Loading state
              <div className="w-8 h-8 border-2 border-default border-t-purple-600 rounded-full animate-spin"></div>
            ) : session ? (
              // Authenticated user
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-2 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </Link>
              </>
            ) : (
              // Unauthenticated user
              <>
                <Link
                  href="/signin"
                  className={`px-2 sm:px-3 py-2 text-sm sm:text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
                >
                  Sign In
                </Link>
                <Link
                  href="/evaluate"
                  className="bg-purple-800 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface border-t border-default`}>
              <Link
                href="/evaluation"
                className={`block px-3 py-2 text-sm sm:text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Evaluation
              </Link>
              <Link
                href="/community"
                className={`block px-3 py-2 text-sm sm:text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Community
              </Link>
              <Link
                href="/pricing"
                className={`block px-3 py-2 text-sm sm:text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className={`block px-3 py-2 text-sm sm:text-base font-medium ${isDarkMode ? "text-secondary hover:text-primary" : "text-secondary hover:text-primary"}`}
              >
                Resources
              </Link>
              <div className="border-t border-default pt-2 mt-2" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
