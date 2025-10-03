"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity">
              {/* Lattice Logo Icon */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
              </div>
              <span 
                className="text-lg sm:text-xl md:text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Dissert Scaffold
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link
                href="/community"
                className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
              >
                Community
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/pricing"
                className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
              >
                Pricing
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/resources"
                className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
              >
                Resources
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoading ? (
              // Loading state
              <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            ) : session ? (
              // Authenticated user
              <>
                <Link
                  href="/user/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              // Unauthenticated user
              <>
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium"
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
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                href="/evaluation"
                className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Evaluation
              </Link>
              <Link
                href="/community"
                className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Community
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Resources
              </Link>
              
              {/* Mobile auth buttons */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                  </div>
                ) : session ? (
                  <>
                    <Link
                      href="/user/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900"
                    >
                      <User className="w-4 h-4" />
                      <span>Account</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/evaluate"
                      className="block px-3 py-2 text-sm sm:text-base font-medium bg-purple-800 text-white rounded-lg text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
