"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import {
  Home,
  Plus,
  LogOut,
  Settings,
  Calendar,
  Users,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { isStudentAtom, userAtom } from "@/lib/stores/authStore";

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
    description: "Overview",
  },
  {
    name: "Communities",
    href: "/communities",
    icon: Users,
    description: "Find mentors",
  },

  {
    name: "Messages",
    href: "/my-messages",
    icon: MessageCircle,
    description: "Sent & received messages",
  },

  {
    name: "Invite Codes",
    href: "/mentor/invite-codes",
    icon: Plus,
    description: "Generate invite codes",
  },
  {
    name: "Timelines",
    href: "/timelines",
    icon: Calendar,
    description: "Research timelines",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account & preferences",
  },
];

export default function DashboardSidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isStudent = useAtomValue(isStudentAtom);
  const user = useAtomValue(userAtom);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
          isCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                {!isCollapsed && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                )}

                {!isCollapsed && (
                  <span className="text-xl font-bold text-black">
                    Dissertation Scaffold
                  </span>
                )}
              </Link>
              <button
                onClick={toggleCollapse}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <nav className="flex-1 px-3">
            {navigationItems
              .filter((item) => {
                if (item.name === "Communities") {
                  return isStudent;
                }
                if (item.name === "Messages") {
                  return user?.userType === "MENTOR";
                }
                if (item.name === "My Messages") {
                  return true; // Show for all users
                }
                if (item.name === "Writing Spaces") {
                  return user?.userType === "MENTOR";
                }
                if (item.name === "Invite Codes") {
                  return user?.userType === "MENTOR";
                }
                return true;
              })
              .map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${isCollapsed ? "justify-center" : "space-x-3"}`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive ? "text-purple-600" : "text-gray-500"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
          </nav>
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium ${
                isCollapsed ? "justify-center" : "justify-center space-x-2"
              }`}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
          >
            <div className="h-full flex flex-col bg-white border-r border-gray-200">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Dissertation Scaffold
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <Link
                  href="/new"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg hover:from-purple-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Write</span>
                </Link>
              </div>

              <nav className="flex-1 px-3">
                {navigationItems
                  .filter((item) => {
                    // Show Communities link for students, Messages for mentors
                    if (item.name === "Communities") {
                      return isStudent;
                    }
                    if (item.name === "Messages") {
                      return user?.userType === "MENTOR";
                    }
                    if (item.name === "My Messages") {
                      return true; // Show for all users
                    }
                    if (item.name === "Writing Spaces") {
                      return user?.userType === "MENTOR";
                    }
                    if (item.name === "Invite Codes") {
                      return user?.userType === "MENTOR";
                    }
                    return true;
                  })
                  .map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${
                            isActive ? "text-purple-600" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
              </nav>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
