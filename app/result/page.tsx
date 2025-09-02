"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ResultPage() {
  const { isDarkMode, toggleTheme, isHydrated } = useTheme();
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);
  const router = useRouter();

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
        color: "from-red-500 to-red-600",
        description: "Potential academic and practical impact",
        details:
          "Exceptional impact potential. Your research addresses critical questions in both AI and research methodology fields.",
        recommendations: [
          "Focus on practical applications and real-world impact",
          "Plan for knowledge dissemination and community engagement",
          "Consider long-term academic and industry implications",
        ],
      },
    ],
  };

  const toggleMetric = (metricName: string) => {
    setExpandedMetrics((prev) =>
      prev.includes(metricName)
        ? prev.filter((name) => name !== metricName)
        : [...prev, metricName]
    );
  };

  const handleDownload = (format: string) => {
    // Simulate download
    console.log(`Downloading evaluation in ${format} format`);
  };

  const documentId = Math.floor(Math.random() * 1000) + 1;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`relative z-10 px-6 py-8 ${
          isDarkMode
            ? "bg-white/5 backdrop-blur-sm border-b border-white/10"
            : "bg-white/80 backdrop-blur-sm border-b border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Dissertation Scaffold
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Result Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div
              className={`w-16 h-16 bg-gradient-to-r ${evaluationData.overallScore >= 80 ? "from-emerald-500 to-emerald-600" : evaluationData.overallScore >= 60 ? "from-yellow-500 to-yellow-600" : "from-red-500 to-red-600"} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Expert Topic Evaluation</h1>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Comprehensive analysis of your research topic
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div
            className={`inline-flex items-center space-x-4 p-6 rounded-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-white/10 border border-white/20"
                : "bg-white/80 border border-gray-200 shadow-lg"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-5xl font-bold bg-gradient-to-r ${
                  evaluationData.overallScore >= 80
                    ? "from-emerald-500 to-emerald-600"
                    : evaluationData.overallScore >= 60
                    ? "from-yellow-500 to-yellow-600"
                    : "from-red-500 to-red-600"
                } bg-clip-text text-transparent`}
              >
                {evaluationData.overallScore}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Overall Score
              </div>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-left">
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {evaluationData.topic}
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } max-w-md`}
              >
                Your research topic has been evaluated across 6 key academic
                metrics to provide comprehensive insights and recommendations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {evaluationData.metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              className={`rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20 hover:bg-white/15"
                  : "bg-white/80 border border-gray-200 hover:bg-white shadow-lg"
              }`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
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
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}
                    >
                      {metric.score}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      /100
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleMetric(metric.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? "bg-white/5 hover:bg-white/10 text-gray-300"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {expandedMetrics.includes(metric.name)
                      ? "Hide Details"
                      : "View Details"}
                  </span>
                  {expandedMetrics.includes(metric.name) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedMetrics.includes(metric.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Analysis
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {metric.details}
                          </p>
                        </div>
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {metric.recommendations.map((rec, recIndex) => (
                              <li
                                key={recIndex}
                                className={`flex items-start space-x-2 text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="text-center space-y-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push(`/user/documents/${documentId}`)}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-white"
            >
              <FileText className="w-5 h-5" />
              <span>Continue to Writing</span>
            </button>

            <button
              onClick={() => handleDownload('docx')}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>

          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Ready to start writing? Continue to our writing environment to begin
            your research journey.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
