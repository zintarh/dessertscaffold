"use client";

import { motion } from "framer-motion";

interface EvaluationSkeletonProps {
  isDarkMode: boolean;
}

const EvaluationSkeleton = ({ isDarkMode }: EvaluationSkeletonProps) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className={`mb-8 p-6 rounded-2xl shadow-xl ${
          isDarkMode
            ? "bg-gray-800/90 border border-gray-700"
            : "bg-white/90 border border-gray-200"
        } backdrop-blur-sm`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="h-8 bg-gray-300  rounded-xl w-48 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-300  rounded-lg w-full animate-pulse"></div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className={`relative rounded-3xl overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br  border "
                : "bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50"
            } backdrop-blur-xl shadow-2xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300  rounded-2xl animate-pulse"></div>
                  <div>
                    <div className="h-8 bg-gray-300  rounded-xl w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300  rounded-lg w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 bg-gray-300  rounded-xl w-16 animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-300  rounded-xl animate-pulse"></div>
                </div>
              </div>
              <div className="w-full h-4 bg-gray-300  rounded-2xl animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations Skeleton */}
      <motion.div
        className={`relative mb-12 p-10 rounded-3xl ${
          isDarkMode
            ? "bg-gradient-to-br  border "
            : "bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50"
        } backdrop-blur-xl shadow-2xl overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-14 h-14 bg-gray-300  rounded-2xl animate-pulse"></div>
          <div className="h-8 bg-gray-300  rounded-xl w-64 animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30"
                  : "bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-300  rounded-xl animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300  rounded-lg w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300  rounded-lg w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default EvaluationSkeleton;
