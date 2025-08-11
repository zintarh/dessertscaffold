"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";
import {
  GraduationCap,
  Brain,
  Target,
  CheckCircle,
  Award,
  Zap,
  Sun,
  Moon,
  ChevronDown,
  FileText,
  Download,
  ChevronUp,
} from "lucide-react";

export default function EvaluationPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);

  const evaluationData = {
    topic:
      "The Impact of Artificial Intelligence on Modern Research Methodologies",
    overallScore: 87,
    metrics: [
      {
        name: "Novelty",
        score: 85,
        color: "from-emerald-500 to-emerald-600",
        description: "Originality and uniqueness of research approach",
        details:
          "Your research topic shows good novelty potential. AI's impact on research methodologies is a growing field with room for innovative approaches.",
        recommendations: [
          "Explore interdisciplinary connections to enhance novelty",
          "Consider emerging AI trends in your methodology",
          "Identify unique angles within the AI-research intersection",
        ],
      },
      {
        name: "Trends",
        score: 92,
        color: "from-blue-500 to-blue-600",
        description: "Alignment with current academic and industry trends",
        details:
          "Excellent alignment with current trends. AI in research is highly relevant and gaining significant attention across disciplines.",
        recommendations: [
          "Leverage current AI research momentum",
          "Connect with trending AI research communities",
          "Align with funding priorities in AI research",
        ],
      },
      {
        name: "Methodology",
        score: 88,
        color: "from-purple-500 to-purple-600",
        description: "Sophistication and feasibility of research methods",
        details:
          "Strong methodological foundation with clear research design. Your approach demonstrates academic rigor and practical feasibility.",
        recommendations: [
          "Consider mixed-methods approach to strengthen rigor",
          "Incorporate AI tools in your methodology",
          "Plan for iterative methodology refinement",
        ],
      },
      {
        name: "Research Gaps",
        score: 83,
        color: "from-orange-500 to-orange-600",
        description: "Identification of unexplored areas in the field",
        details:
          "Good identification of research gaps. The intersection of AI and research methodologies presents several unexplored opportunities.",
        recommendations: [
          "Narrow focus to specific AI-research intersections",
          "Identify methodological gaps in current literature",
          "Explore emerging research questions in the field",
        ],
      },
      {
        name: "Grant Potential",
        score: 89,
        color: "from-yellow-500 to-yellow-600",
        description: "Likelihood of securing funding for the research",
        details:
          "High grant potential due to AI's current relevance and funding priorities. Multiple funding bodies are actively supporting AI research.",
        recommendations: [
          "Target AI-focused funding bodies",
          "Highlight interdisciplinary collaboration potential",
          "Emphasize practical applications and impact",
        ],
      },
      {
        name: "Impact Score",
        score: 91,
        color: "from-pink-500 to-pink-600",
        description: "Potential academic and societal impact",
        details:
          "Exceptional impact potential. Your research could significantly influence how research is conducted across multiple disciplines.",
        recommendations: [
          "Focus on practical implementation strategies",
          "Plan for knowledge transfer to other fields",
          "Consider policy implications of your findings",
        ],
      },
    ],
    recommendations: [
      "Narrow your focus to a specific aspect of AI's impact to increase researchability",
      "Consider mixed-methods approach to strengthen methodological rigor",
      "Explore interdisciplinary connections to enhance novelty and impact",
      "Identify specific funding bodies that align with your research focus",
      "Consider ethical implications of AI research in your methodology",
    ],
  };

  const toggleMetric = (metricName: string) => {
    setExpandedMetrics((prev) =>
      prev.includes(metricName)
        ? prev.filter((name) => name !== metricName)
        : [...prev, metricName]
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50"
      } relative overflow-hidden`}
    >
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Dissertation Scaffold
              </span>
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                Expert Research Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            <Link
              href="/"
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-300 border border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                  : "text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>

          <h1
            className={`text-5xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Evaluation Results
          </h1>

          <p
            className={`text-xl mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your research topic has been analyzed across 6 key academic metrics
          </p>

          {/* Overall Score */}
          <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
            <div
              className={`relative p-8 rounded-3xl shadow-2xl ${
                isDarkMode
                  ? "bg-gray-800/90 border border-gray-700"
                  : "bg-white/90 border border-gray-200"
              } backdrop-blur-sm`}
            >
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {evaluationData.overallScore}%
                </div>
                <div
                  className={`text-lg font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Overall Score
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Excellent potential for research success
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="w-5 h-5" />
              <span>Continue to Writing</span>
            </motion.button>

            <motion.button
              className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              <span>Download Evaluation</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Research Topic */}
        <motion.div
          className={`mb-8 p-6 rounded-2xl shadow-xl ${
            isDarkMode
              ? "bg-gray-800/90 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          } backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Research Topic
          </h2>
          <p
            className={`text-lg leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {evaluationData.topic}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {evaluationData.metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              className={`rounded-2xl shadow-xl overflow-hidden ${
                isDarkMode
                  ? "bg-gray-800/90 border border-gray-700"
                  : "bg-white/90 border border-gray-200"
              } backdrop-blur-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Metric Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleMetric(metric.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}
                    >
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {metric.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {metric.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}
                      >
                        {metric.score}%
                      </div>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedMetrics.includes(metric.name) ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedMetrics.includes(metric.name) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedMetrics.includes(metric.name) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-600/20"
                  >
                    <div className="p-6 pt-0">
                      <p
                        className={`text-sm leading-relaxed mb-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {metric.details}
                      </p>

                      <div className="space-y-3">
                        <h4
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Recommendations:
                        </h4>
                        {metric.recommendations.map((rec, recIndex) => (
                          <motion.div
                            key={recIndex}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: recIndex * 0.1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {rec}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Recommendations Section */}
        <motion.div
          className={`mb-8 p-8 rounded-2xl shadow-xl ${
            isDarkMode
              ? "bg-gray-800/90 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          } backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recommendations for Improvement
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {evaluationData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {rec}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-blue-600 shadow-xl hover:shadow-2xl flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain className="w-5 h-5" />
            <span>Start Research Journey</span>
          </motion.button>

          <motion.button
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
              isDarkMode
                ? "text-gray-300 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                : "text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5" />
            <span>Get Detailed Report</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
