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
  GraduationCap,
  Calendar,
  Users,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { isStudentAtom, userAtom } from "@/lib/stores/authStore";

interface StudentSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigationItems = [
  {
    name: "Home",
    href: "/user/dashboard",
    icon: Home,
    description: "Overview",
  },
  {
    name: "Communities",
    href: "/user/communities",
    icon: Users,
    description: "Find mentors",
  },

  {
    name: "My Messages",
    href: "/user/my-messages",
    icon: MessageCircle,
    description: "Sent & received messages",
  },
 
  {
    name: "Invite Codes",
    href: "/user/mentor/invite-codes",
    icon: Plus,
    description: "Generate invite codes",
  },
  {
    name: "Timelines",
    href: "/user/timelines",
    icon: Calendar,
    description: "Research timelines",
  },
  {
    name: "Settings",
    href: "/user/settings",
    icon: Settings,
    description: "Account & preferences",
  },
];

export default function StudentSidebar({
  isOpen,
  setIsOpen,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const isStudent = useAtomValue(isStudentAtom);
  const user = useAtomValue(userAtom);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-6 border-b border-gray-200">
            <Link href="/">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  Dissertation Scaffold
                </span>
              </div>
            </Link>
          </div>
          ={" "}
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
                    className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-500"
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
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
                  href="/user/new"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
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
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${
                            isActive ? "text-blue-600" : "text-gray-500"
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
