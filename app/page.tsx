"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Target, Users, BookOpen, TrendingUp, ArrowRight, Play, GraduationCap, Rocket, Brain, Clock, Award, Sun, Moon, CheckCircle, BarChart3, Lightbulb, Search, FileText, Beaker } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

export default function Home() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEvaluate = async () => {
    if (!researchTopic.trim()) return;
    setIsEvaluating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsEvaluating(false);
    // Redirect to evaluation page
    window.location.href = '/evaluation';
  };

  const features = [
    {
      icon: Brain,
      title: "Research Evaluation",
      description:
        "Get instant feedback on your research topic across 6 key academic metrics with our advanced evaluation system.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Visualize your research journey with comprehensive progress tracking and milestone management.",
    },
    {
      icon: Clock,
      title: "Timeline Planning",
      description:
        "Create structured timelines for your research proposals and dissertations with intelligent scheduling.",
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description:
        "Access templates, guides, and academic resources curated specifically for your research field.",
    },
    {
      icon: Users,
      title: "Academic Community",
      description:
        "Connect with fellow researchers, mentors, and experts in your field for collaboration and support.",
    },
    {
      icon: Award,
      title: "Grant Writing Support",
      description:
        "Get assistance with grant applications and funding opportunities tailored to your research area.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Researchers" },
    { number: "50,000+", label: "Topics Evaluated" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Expert Support" },
  ];

  return (
    <div
      className={`min-h-screen overflow-hidden relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-blue-600/20" : "bg-blue-600/10"
          }`}
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-2xl animate-bounce ${
            isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/5"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-xl animate-pulse ${
            isDarkMode ? "bg-amber-500/10" : "bg-amber-500/5"
          }`}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDarkMode ? "bg-white/20" : "bg-gray-400/30"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Dissertation Scaffold
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="/community"
              className={`font-medium transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              Community
            </motion.a>
            <motion.a
              href="/pricing"
              className={`font-medium transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              Pricing
            </motion.a>
            <motion.a
              href="/evaluation"
              className={`font-medium transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              Evaluation
            </motion.a>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
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
          </div>
        </div>
      </motion.nav>

      <motion.section
        className="relative z-10 px-6 py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              className={`inline-flex items-center space-x-2 backdrop-blur-sm rounded-full px-6 py-3 mb-8 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20"
                  : "bg-white/70 border border-gray-200 shadow-lg"
              }`}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(16, 185, 129, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Expert Research Assistant
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className={isDarkMode ? "text-white" : "text-gray-900"}>
              Research Journey
            </span>
          </motion.h1>

          <motion.p
            className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Navigate your academic journey with confidence. Get expert
            research evaluation, structured progress tracking, and connect with
            a community of scholars.
          </motion.p>

          {/* Enhanced Research Topic Evaluation Section */}
          <motion.div
            className="max-w-5xl mx-auto mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Evaluation Metrics Preview */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              {[
                { icon: Target, label: "Relevance", color: "text-blue-500" },
                { icon: Lightbulb, label: "Novelty", color: "text-amber-500" },
                { icon: BarChart3, label: "Feasibility", color: "text-emerald-500" },
                { icon: Search, label: "Scope", color: "text-purple-500" },
                { icon: FileText, label: "Clarity", color: "text-orange-500" },
                { icon: Beaker, label: "Impact", color: "text-red-500" }
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={index}
                    className={`text-center p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                      isDarkMode
                        ? "bg-white/5 border border-white/10 hover:bg-white/10"
                        : "bg-white/70 border border-gray-200 hover:bg-white shadow-lg"
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <IconComponent className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {metric.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Main Evaluation Input */}
            <div
              className={`backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden ${
                isDarkMode
                  ? "bg-white/10 border border-white/20"
                  : "bg-white/80 border border-gray-200 shadow-xl"
              }`}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full blur-2xl"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full blur-xl"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <motion.div
                    className="inline-flex items-center space-x-2 mb-4"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Brain className="w-8 h-8 text-blue-500" />
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Research Evaluator
                    </span>
                  </motion.div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Get instant analysis across 6 key academic metrics
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="e.g., 'Machine Learning Applications in Climate Change Prediction'"
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      className={`w-full rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/10 border border-white/20 text-white placeholder-gray-400"
                          : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                    {researchTopic && (
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </motion.div>
                    )}
                  </div>
                  <motion.button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !researchTopic.trim()}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-white min-w-[200px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isEvaluating ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Evaluate Now</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Sample Topics */}
                <div className="mt-6">
                  <p
                    className={`text-sm mb-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Try these sample topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AI Ethics in Healthcare",
                      "Sustainable Urban Planning",
                      "Quantum Computing Applications"
                    ].map((sample, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setResearchTopic(sample)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          isDarkMode
                            ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sample}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-white"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              className={`flex items-center space-x-2 transition-colors duration-300 group ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              whileHover={{ x: 5 }}
            >
              <div
                className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode
                    ? "bg-white/10 border border-white/20 group-hover:bg-white/20"
                    : "bg-white/70 border border-gray-200 group-hover:bg-white shadow-lg"
                }`}
              >
                <Play className="w-5 h-5 ml-1" />
              </div>
              <span className="font-medium">Watch Demo</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div
                  className={`font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Core Features
              </span>
            </motion.h2>
            <motion.p
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Everything you need to navigate your research journey with
              confidence and precision
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 group relative overflow-hidden ${
                    isDarkMode
                      ? "bg-white/5 border border-white/10 hover:bg-white/10"
                      : "bg-white/70 border border-gray-200 hover:bg-white shadow-lg hover:shadow-xl"
                  }`}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Decorative Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full blur-xl"></div>
                  </div>

                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3
                    className={`text-xl font-bold mb-4 transition-colors duration-300 relative z-10 ${
                      isDarkMode
                        ? "text-white group-hover:text-blue-600"
                        : "text-gray-900 group-hover:text-blue-600"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`leading-relaxed transition-colors duration-300 relative z-10 ${
                      isDarkMode
                        ? "text-gray-400 group-hover:text-gray-300"
                        : "text-gray-600 group-hover:text-gray-700"
                    }`}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`backdrop-blur-sm rounded-3xl p-12 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-600/20 to-emerald-500/20 border border-white/10"
                : "bg-gradient-to-r from-blue-600/10 to-emerald-500/10 border border-gray-200 shadow-xl bg-white/50"
            }`}
          >
            <motion.h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Ready to Transform Your Research?
            </motion.h2>
            <motion.p
              className={`text-xl mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join thousands of researchers who have already accelerated their
              academic success
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
                  isDarkMode
                    ? "border border-white/20 text-white hover:bg-white/10"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            <div
              className={`flex items-center justify-center space-x-8 mt-8 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer
        className={`py-16 px-6 relative z-10 transition-all duration-500 ${
          isDarkMode
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-900 border-t border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
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
              <p
                className={`leading-relaxed mb-6 max-w-md ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Empowering researchers worldwide with expert-curated tools and
                community support to navigate their academic journey with
                confidence and precision.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "GitHub", "Discord"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-800 hover:text-white"
                        : "bg-gray-100 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-sm font-semibold">{social[0]}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4
                className={`font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Platform
              </h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "API", "Documentation", "Status"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {item}
                        </span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                className={`font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Community",
                  "Contact",
                  "Privacy",
                  "Terms",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={`pt-8 ${
              isDarkMode
                ? "border-t border-gray-800"
                : "border-t border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p
                className={`text-sm mb-4 md:mb-0 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                © 2025 Dissertation Scaffold. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Made with ❤️ for researchers worldwide
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-500 text-sm font-medium">
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
