"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, User } from "lucide-react";
import { useAtomValue } from "jotai";
import { userAtom, isAuthenticatedAtom } from "../../lib/stores/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const currentUser = useAtomValue(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const userRole = currentUser?.userType || "student";
  const isStudent = userRole === "student";

  const router = useRouter();

  return (
    <motion.nav
      className="relative z-50 px-6 py-6"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Dissertation Scaffold
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <motion.div
                className="flex items-center space-x-2 px-4 cursor-pointer py-2 bg-gray-100 rounded-xl text-gray-700"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                onClick={() => router.push("/user/dashboard")}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">My Account</span>
              </motion.div>
            </div>
          ) : (
            <motion.a
              href="/signin"
              className="bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

