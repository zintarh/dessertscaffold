"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  HelpCircle,
  RefreshCw,
  Clock,
  Database,
  TrendingUp,
  FileText,
} from "lucide-react";
import {  useSetAtom } from "jotai";
import { evaluationSyncAtom } from "../../lib/stores/timelineStore";
import TimelineCreationModal from "../components/TimelineCreationModal";
import EvaluationSkeleton from "../components/EvaluationSkeleton";
import { EvaluationResponse } from "@/lib/types";




export const dynamic = "force-dynamic";

export default function EvaluationPage() {
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);
  const [researchTopic, setResearchTopic] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] =
    useState<EvaluationResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [showAllMetrics, setShowAllMetrics] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const syncEvaluationData = useSetAtom(evaluationSyncAtom);

  // Evaluation steps for progress indication
  const evaluationSteps = [
    { id: 1, name: "Analyzing research topic...", icon: Brain, duration: 2000 },
    { id: 2, name: "Querying academic databases...", icon: Database, duration: 3000 },
    { id: 3, name: "Processing literature data...", icon: FileText, duration: 2000 },
    { id: 4, name: "Evaluating metrics...", icon: TrendingUp, duration: 2500 },
    { id: 5, name: "Generating recommendations...", icon: Award, duration: 1500 },
  ];

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
    setEvaluationProgress(0);
    setCurrentStep("");

    // Simulate progress steps
    const simulateProgress = async () => {
      for (let i = 0; i < evaluationSteps.length; i++) {
        const step = evaluationSteps[i];
        setCurrentStep(step.name);
        setEvaluationProgress((i + 1) * 20);
        
        // Wait for the step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
    };

    try {
      // Start progress simulation
      const progressPromise = simulateProgress();
      
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
      
      // Wait for progress to complete
      await progressPromise;
      
      setEvaluationResults(result);
      setShowResults(true);
      setEvaluationProgress(100);
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

  if (!evaluationResults && !isEvaluating && !error) {
    return <EvaluationSkeleton isDarkMode={false} />;
  }

  // Show progress while evaluating
  if (isEvaluating && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Evaluating Research Topic
          </h2>
          
          <p className="text-gray-600 mb-6">
            {currentStep || "Starting evaluation..."}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${evaluationProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-sm text-gray-500">
            {evaluationProgress}% Complete
          </p>
          
          {/* Cancel Button */}
          <button
            onClick={() => {
              setIsEvaluating(false);
              setEvaluationProgress(0);
              setCurrentStep("");
            }}
            className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel Evaluation
          </button>
        </div>
      </div>
    );
  }

  // Show error state if evaluation failed
  if (error && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Evaluation Failed
          </h2>
          
          <p className="text-gray-600 mb-8">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
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
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
              {/* Primary Action - Create Timeline */}
              <motion.button
                onClick={() => {
                  // Sync evaluation data with timeline creation state
                  if (researchTopic) {
                    syncEvaluationData(researchTopic);
                  }
                  setShowTimelineModal(true);
                }}
                className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white px-10 py-5 rounded-2xl font-semibold text-xl shadow-lg hover:from-emerald-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Target className="w-6 h-6" />
                <span>Create Research Timeline</span>
              </motion.button>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <motion.button
                  onClick={() => downloadEvaluationPDF()}
                  disabled={isDownloading}
                  className={`px-6 py-4 rounded-xl font-medium shadow-md transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isDownloading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                  whileHover={!isDownloading ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isDownloading ? { scale: 0.98 } : {}}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </motion.button> */}

                <motion.button
                  onClick={() => {
                    setShowResults(false);
                    setEvaluationResults(null);
                    setExpandedMetrics([]);
                    setShowAllMetrics(false);
                    handleEvaluate(researchTopic);
                  }}
                  className="px-6 py-4 rounded-xl font-medium shadow-md transition-all duration-300 flex items-center justify-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Re-evaluate</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

         {/* Results Section - Only show when we have evaluation data */}
         {showResults && displayData && (
          <>
            {/* Overall Score Dashboard */}
            <motion.div
              className="mb-8 p-8 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50/90 to-emerald-50/90 border border-blue-200 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    Research Topic
                  </h2>
                  <p className="text-lg leading-relaxed mb-4 text-gray-600">
                    {displayData.topic}
                  </p>
                  <p className="text-sm text-gray-500">
                    Based on 6 key academic metrics
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${
                    displayData.overallScore >= 80 ? "text-emerald-600" :
                    displayData.overallScore >= 60 ? "text-blue-600" :
                    "text-orange-600"
                  }`}>
                    {displayData.overallScore}%
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    Overall Score
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full rounded-full h-4 bg-gray-200">
                  <motion.div
                    className={`h-4 rounded-full ${
                      displayData.overallScore >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                      displayData.overallScore >= 60 ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                      "bg-gradient-to-r from-orange-500 to-orange-600"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${displayData.overallScore}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Metrics Section with Progressive Disclosure */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detailed Metrics
                </h3>
                <button
                  onClick={() => setShowAllMetrics(!showAllMetrics)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {showAllMetrics ? "Show Top 3 Only" : "Show All Metrics"}
                </button>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {displayData.metrics
                  .slice(0, showAllMetrics ? 6 : 3)
                  .map((metric, index) => {
                    const metricId = `${metric.name}-${index}`;
                    return (
                  <motion.div
                    key={metricId}
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 backdrop-blur-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.01 }}
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
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {metric.name}
                              </h3>
                              <button
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title={`Learn more about ${metric.name} evaluation`}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-base text-gray-600">
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
                            className="p-2 rounded-xl bg-gray-100"
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

                      {/* Progress Bar */}
                      <div className="w-full rounded-lg h-2 overflow-hidden bg-gray-200">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${metric.color} rounded-lg`}
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
                            <p className="text-sm leading-relaxed mb-4 text-gray-600">
                              {metric.details}
                            </p>

                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900">
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
                                    <span className="text-sm text-gray-600">
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
            </div>

            {/* Recommendations Section - Only show if there are recommendations */}
            {displayData.recommendations && displayData.recommendations.length > 0 && (
              <motion.div
                className="relative mb-12 p-8 rounded-2xl bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 backdrop-blur-xl shadow-lg overflow-hidden"
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
                <h2 className="text-3xl font-bold text-gray-900">
                  Recommendations for Improvement
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {displayData.recommendations.map(
                  (rec: string, index: number) => (
                    <motion.div
                      key={index}
                      className="group relative p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-xl bg-emerald-100 group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                        <span className="text-base font-medium leading-relaxed text-emerald-800">
                          {rec}
                        </span>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
            )}
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
