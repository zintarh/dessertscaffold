"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Brain,
  Target,
  CheckCircle,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import {  useSetAtom } from "jotai";
import { evaluationSyncAtom } from "../../lib/stores/timelineStore";
import TimelineCreationModal from "../components/TimelineCreationModal";
import EvaluationSkeleton from "../components/EvaluationSkeleton";
import { EvaluationResponse } from "@/lib/types";




export const dynamic = "force-dynamic";

export default function EvaluationPage() {
  const { isDarkMode, isHydrated } = useTheme();
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);
  const [researchTopic, setResearchTopic] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] =
    useState<EvaluationResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const syncEvaluationData = useSetAtom(evaluationSyncAtom);



  const displayData = evaluationResults ? {
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
        recommendations: evaluationResults.evaluation.novelty.recommendations || [],
      },
      {
        name: "Trends",
        score: evaluationResults.evaluation.trends.score * 10,
        color: "from-blue-500 to-blue-600",
        description: "Alignment with current academic and industry trends",
        details: evaluationResults.evaluation.trends.justification,
        recommendations: evaluationResults.evaluation.trends.recommendations || [],
      },
      {
        name: "Methodology",
        score: evaluationResults.evaluation.methodological_complexity.score * 10,
        color: "from-purple-500 to-purple-600",
        description: "Sophistication and feasibility of research methods",
        details: evaluationResults.evaluation.methodological_complexity.justification,
        recommendations: evaluationResults.evaluation.methodological_complexity.recommendations || [],
      },
      {
        name: "Research Gaps",
        score: evaluationResults.evaluation.research_gaps.score * 10,
        color: "from-orange-500 to-orange-600",
        description: "Identification of unexplored areas in the field",
        details: evaluationResults.evaluation.research_gaps.justification,
        recommendations: evaluationResults.evaluation.research_gaps.recommendations || [],
      },
      {
        name: "Grant Potential",
        score: evaluationResults.evaluation.grant_potential.score * 10,
        color: "from-yellow-500 to-yellow-600",
        description: "Likelihood of securing funding for the research",
        details: evaluationResults.evaluation.grant_potential.justification,
        recommendations: evaluationResults.evaluation.grant_potential.recommendations || [],
      },
      {
        name: "Literature Availability",
        score: evaluationResults.evaluation.literature_availability.score * 10,
        color: "from-pink-500 to-pink-600",
        description: "Availability of existing research and resources",
        details: evaluationResults.evaluation.literature_availability.justification,
        recommendations: evaluationResults.evaluation.literature_availability.recommendations || [],
      },
    ],
    recommendations: evaluationResults.evaluation.overall_recommendations || [],
  } : null;

  const toggleMetric = (metricName: string) => {
    setExpandedMetrics((prev) => {
      if (prev.includes(metricName)) {
        return prev.filter((name) => name !== metricName);
      }
      return [metricName];
    });
  };

  const handleEvaluate = async (topic: string) => {
    const researchTopic = topic;
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
      toast.error("No evaluation data available for download. Please run an evaluation first.");
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
      toast.error(
        `Failed to download PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDownloading(false);
    }
  };


  useEffect(() => {
    const topicFromUrl = searchParams.get("topic");
    if (topicFromUrl) {
      handleEvaluate(topicFromUrl);
    }
  }, []);

  if (!isHydrated) {
    return <EvaluationSkeleton isDarkMode={isDarkMode} />;
  }

  // Show skeleton while evaluating
  if (isEvaluating && !showResults) {
    return <EvaluationSkeleton isDarkMode={isDarkMode} />;
  }

  // Show error state if evaluation failed
  if (error && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Evaluation Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-600 transition-all duration-300"
          >
            Try Again
          </button>
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

         {/* Results Section - Only show when we have evaluation data */}
         {showResults && displayData && (
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
