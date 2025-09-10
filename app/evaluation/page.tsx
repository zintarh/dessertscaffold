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
  ChevronUp,
  Download,
} from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { isAuthenticatedAtom } from "../../lib/stores/authStore";
import { evaluationSyncAtom } from "../../lib/stores/timelineStore";
import TimelineCreationModal from "../components/TimelineCreationModal";
import { evaluationData } from "@/lib/constants";

// Define the EvaluationData type for the UI
interface EvaluationData {
  topic: string;
  overallScore: number;
  metrics: Array<{
    name: string;
    score: number;
    color: string;
    description: string;
    details: string;
    recommendations: string[];
  }>;
  recommendations: string[];
}

// Define the API response type
interface EvaluationResponse {
  metadata?: {
    topic: string;
  };
  evaluation: {
    novelty: {
      score: number;
      justification: string;
      recommendations?: string[];
    };
    trends: {
      score: number;
      justification: string;
      recommendations?: string[];
    };
    methodological_complexity: {
      score: number;
      justification: string;
      recommendations?: string[];
    };
    research_gaps: {
      score: number;
      justification: string;
      recommendations?: string[];
    };
    grant_potential: {
      score: number;
      justification: string;
      recommendations?: string[];
    };
    literature_availability: {
      score: number;
      justification: string;
      recommendations?: string[];
    };
    overall_recommendations?: string[];
    overall_summary: string;
  };
}

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function EvaluationPage() {
  const { isDarkMode, toggleTheme, isHydrated } = useTheme();
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);
  const [researchTopic, setResearchTopic] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] =
    useState<EvaluationResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const syncEvaluationData = useSetAtom(evaluationSyncAtom);

  const displayData = evaluationResults
    ? {
    topic: evaluationResults.metadata?.topic || researchTopic,
    overallScore: Math.round(
          ((evaluationResults.evaluation.novelty.score +
       evaluationResults.evaluation.trends.score +
       evaluationResults.evaluation.methodological_complexity.score +
       evaluationResults.evaluation.research_gaps.score +
       evaluationResults.evaluation.grant_potential.score +
            evaluationResults.evaluation.literature_availability.score) /
            6) *
            10
    ),
    metrics: [
      {
        name: "Novelty",
        score: evaluationResults.evaluation.novelty.score * 10,
        color: "from-emerald-500 to-emerald-600",
        description: "Originality and uniqueness of research approach",
        details: evaluationResults.evaluation.novelty.justification,
            recommendations:
              evaluationResults.evaluation.novelty.recommendations || [],
      },
      {
        name: "Trends",
        score: evaluationResults.evaluation.trends.score * 10,
        color: "from-blue-500 to-blue-600",
        description: "Alignment with current academic and industry trends",
        details: evaluationResults.evaluation.trends.justification,
            recommendations:
              evaluationResults.evaluation.trends.recommendations || [],
      },
      {
        name: "Methodology",
            score:
              evaluationResults.evaluation.methodological_complexity.score * 10,
        color: "from-purple-500 to-purple-600",
        description: "Sophistication and feasibility of research methods",
            details:
              evaluationResults.evaluation.methodological_complexity
                .justification,
            recommendations:
              evaluationResults.evaluation.methodological_complexity
                .recommendations || [],
      },
      {
        name: "Research Gaps",
        score: evaluationResults.evaluation.research_gaps.score * 10,
        color: "from-orange-500 to-orange-600",
        description: "Identification of unexplored areas in the field",
        details: evaluationResults.evaluation.research_gaps.justification,
            recommendations:
              evaluationResults.evaluation.research_gaps.recommendations || [],
      },
      {
        name: "Grant Potential",
        score: evaluationResults.evaluation.grant_potential.score * 10,
        color: "from-yellow-500 to-yellow-600",
        description: "Likelihood of securing funding for the research",
        details: evaluationResults.evaluation.grant_potential.justification,
            recommendations:
              evaluationResults.evaluation.grant_potential.recommendations ||
              [],
      },
      {
        name: "Literature Availability",
            score:
              evaluationResults.evaluation.literature_availability.score * 10,
        color: "from-pink-500 to-pink-600",
        description: "Availability of existing research and resources",
            details:
              evaluationResults.evaluation.literature_availability
                .justification,
            recommendations:
              evaluationResults.evaluation.literature_availability
                .recommendations || [],
          },
        ],
        recommendations:
          evaluationResults.evaluation.overall_recommendations ||
          evaluationData.recommendations,
      }
    : evaluationData;

  const toggleMetric = (metricName: string) => {
    setExpandedMetrics((prev) => {
      if (prev.includes(metricName)) {
        return prev.filter((name) => name !== metricName);
      }
      return [metricName];
    });
  };

  const handleEvaluate = async () => {
    if (!researchTopic.trim()) return;
    
    setIsEvaluating(true);
    setError(null);
    setEvaluationResults(null);
    setShowResults(false);
    
    try {
      const response = await fetch("/api/evaluate-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          research_topic: researchTopic.trim(),
          additional_keywords: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Evaluation failed");
      }

      const result = await response.json();
      setEvaluationResults(result);
      setShowResults(true);
    } catch (err: any) {
      console.error("Evaluation failed:", err);
      setError(
        err.message || "Failed to evaluate research topic. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadEvaluationPDF = async () => {
    if (!evaluationResults || !displayData || isDownloading) return;
    
    // Ensure we have real evaluation data, not fallback data
    if (
      !evaluationResults.evaluation ||
      !displayData.metrics ||
      displayData.metrics.length === 0
    ) {
      alert(
        "No evaluation data available for download. Please run an evaluation first."
      );
      return;
    }
    
    setIsDownloading(true);
    
    try {
      const response = await fetch("/api/download-evaluation-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          research_topic: researchTopic,
          evaluation_results: evaluationResults,
          display_data: displayData,
        }),
      });

      if (!response.ok) {
        // Check if response is JSON or HTML
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to generate PDF");
        } else {
          // Handle HTML error responses
          const errorText = await response.text();
          console.error("Non-JSON error response:", errorText);
          throw new Error("Server error occurred while generating PDF");
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `evaluation-${researchTopic.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert(
        `Failed to download PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDownloading(false);
    }
  };


  

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
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50"
      } relative overflow-hidden`}
    >
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    Dissertation Scaffold
                  </span>
                  <p className="text-gray-400 text-sm">
                    Expert Research Guidance
                  </p>
                </div>
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
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
            {showResults ? "Evaluation Results" : "Research Topic Evaluation"}
          </h1>

          <p
            className={`text-xl mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {showResults 
              ? `Comprehensive analysis of "${evaluationResults?.metadata?.topic}" across six key academic metrics`
              : "Enter your research topic to get a comprehensive evaluation across 6 key academic metrics"}
          </p>

          {!showResults && (
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your research topic here..."
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    className={`w-full rounded-3xl px-8 py-6 text-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-white/10 border-2 border-white/20 text-white placeholder-gray-400"
                        : "bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {researchTopic && (
                    <motion.div
                      className="absolute right-6 top-1/2 transform -translate-y-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                
                <motion.button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !researchTopic.trim()}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 px-12 py-6 rounded-3xl font-semibold text-2xl hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-4 text-white mx-auto min-w-[300px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEvaluating ? (
                    <>
                      <motion.div
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      <span>Evaluate Now</span>
                    </>
                    )}
                </motion.button>
                </div>

              {/* Sample Topics */}
              <div className="text-center mt-8">
                <p
                  className={`text-lg mb-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Try these sample topics:
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    "AI Ethics in Healthcare",
                    "Sustainable Urban Planning",
                    "Quantum Computing Applications",
                  ].map((sample, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setResearchTopic(sample)}
                      className={`px-6 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {sample}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`p-6 rounded-2xl border ${
                    isDarkMode
                      ? "bg-red-900/20 border-red-700/30 text-red-200"
                      : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    <p className="text-base font-medium">{error}</p>
            </div>
              </motion.div>
            )}
          </motion.div>
          )}

          {/* Action Buttons - Only show after evaluation */}
          {showResults && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.button
              onClick={() => {
                   // Sync evaluation data with timeline creation state
                   if (researchTopic) {
                     syncEvaluationData(researchTopic);
                   }
                   setShowTimelineModal(true);
                 }}
                 className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white px-10 py-5 rounded-2xl font-semibold text-xl shadow-lg hover:from-emerald-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-1"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
                <Target className="w-6 h-6" />
                <span>Create Timeline</span>
            </motion.button>

             

              <motion.button
                onClick={() => downloadEvaluationPDF()}
                disabled={isDownloading}
                className={`px-10 py-5 rounded-2xl font-semibold text-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isDownloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 hover:scale-105"
                }`}
                whileHover={!isDownloading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isDownloading ? { scale: 0.98 } : {}}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Download PDF</span>
                  </>
                )}
            </motion.button>
          </motion.div>
          )}
        </motion.div>

                {/* Results Section - Only show after evaluation */}
        {showResults && (
          <>
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
                {displayData.topic}
          </p>
        </motion.div>

         

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {displayData.metrics.map((metric, index) => {
                const metricId = `${metric.name}-${index}`;
                return (
                <motion.div
                  key={metricId}
                  className={`relative rounded-3xl overflow-hidden ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50"
                      : "bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50"
                  } backdrop-blur-xl shadow-2xl`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Background decoration */}
                    <div
                      className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${metric.color
                        .replace("from-", "from-")
                        .replace(
                          "to-",
                          "to-"
                        )} opacity-20 rounded-full blur-xl`}
                    ></div>
                  
              {/* Metric Header */}
              <div
                    className="p-8 cursor-pointer"
                    onClick={() => toggleMetric(metricId)}
              >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                    <div
                          className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                          <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3
                            className={`text-2xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {metric.name}
                      </h3>
                      <p
                            className={`text-base ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {metric.description}
                      </p>
                    </div>
                  </div>

                      <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div
                            className={`text-4xl font-black bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}
                      >
                        {metric.score}%
                      </div>
                    </div>
                    <motion.div
                          className={`p-2 rounded-xl ${
                            isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                          }`}
                      animate={{
                              rotate: expandedMetrics.includes(metricId)
                                ? 180
                                : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                          {expandedMetrics.includes(metricId) ? (
                            <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </motion.div>
                  </div>
                </div>

                    {/* Enhanced Progress Bar */}
                      <div
                        className={`w-full rounded-2xl h-4 overflow-hidden ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-200"
                        }`}
                      >
                  <motion.div
                        className={`h-full bg-gradient-to-r ${metric.color} rounded-2xl shadow-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                          transition={{
                            duration: 1.5,
                            delay: 0.5 + index * 0.1,
                            ease: "easeOut",
                          }}
                  />
                </div>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                    {expandedMetrics.includes(metricId) && (
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
                              {metric.recommendations.map(
                                (rec: string, recIndex: number) => (
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
                                        isDarkMode
                                          ? "text-gray-300"
                                          : "text-gray-600"
                              }`}
                            >
                              {rec}
                            </span>
                          </motion.div>
                                )
                              )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
              );
              })}
        </div>

            {/* Recommendations Section - Modern Enhanced */}
        <motion.div
              className={`relative mb-12 p-10 rounded-3xl ${
            isDarkMode
                  ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50"
                  : "bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50"
              } backdrop-blur-xl shadow-2xl overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
            </div>
            <h2
                  className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recommendations for Improvement
            </h2>
          </div>

              <div className="grid md:grid-cols-2 gap-6">
                {displayData.recommendations.map(
                  (rec: string, index: number) => (
              <motion.div
                key={index}
                    className={`group relative p-6 rounded-2xl ${
                      isDarkMode 
                        ? "bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 hover:border-emerald-500/50" 
                        : "bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 hover:border-emerald-300"
                    } transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-xl ${
                        isDarkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                          } group-hover:scale-110 transition-transform duration-200`}
                        >
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </div>
                <span
                        className={`text-base font-medium leading-relaxed ${
                          isDarkMode ? "text-emerald-200" : "text-emerald-800"
                  }`}
                >
                  {rec}
                </span>
                    </div>
              </motion.div>
                  )
                )}
          </div>
        </motion.div>
          </>
        )}

        {/* Timeline Creation Modal */}
        {showTimelineModal && (
          <TimelineCreationModal
            isOpen={showTimelineModal}
            onClose={() => setShowTimelineModal(false)}
            researchTopic={researchTopic}
            onTimelineCreated={(timelineId) => {
              setShowTimelineModal(false);
              // Redirect to dashboard to show the newly created timeline
              router.push("/user/dashboard");
            }}
            refreshTimelines={() => {
              // This will be handled by the dashboard's useEffect
              // The dashboard will automatically refresh when navigated to
            }}
          />
        )}
      </div>
    </div>
  );
}
