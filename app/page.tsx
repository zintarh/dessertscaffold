"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Play,
  GraduationCap,
  Brain,
  Clock,
  Award,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";

export default function Home() {
  const { isDarkMode, isHydrated } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEvaluate = () => {
    if (topic.trim()) {
      // Pass the topic as a URL parameter
      window.location.href = `/evaluation?topic=${encodeURIComponent(topic.trim())}`;
    } else {
      // If no topic, go to evaluation page normally
      window.location.href = "/evaluation";
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Research Evaluation",
      description:
        "Get instant feedback on your research topic across 6 key academic metrics with our advanced evaluation system.",
      shortDesc: "AI-powered analysis",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Visualize your research journey with comprehensive progress tracking and milestone management.",
      shortDesc: "Real-time insights",
      color: "text-emerald-500"
    },
    {
      icon: Clock,
      title: "Timeline Planning",
      description:
        "Create structured timelines for your research proposals and dissertations with intelligent scheduling.",
      shortDesc: "Smart scheduling",
      color: "text-purple-500"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description:
        "Access templates, guides, and academic resources curated specifically for your research field.",
      shortDesc: "Curated content",
      color: "text-amber-500"
    },
    {
      icon: Users,
      title: "Academic Community",
      description:
        "Connect with fellow researchers, mentors, and experts in your field for collaboration and support.",
      shortDesc: "Expert network",
      color: "text-orange-500"
    },
    {
      icon: Award,
      title: "Grant Writing Support",
      description:
        "Get assistance with grant applications and funding opportunities tailored to your research area.",
      shortDesc: "Funding guidance",
      color: "text-red-500"
    },
  ];

  const stats = [
    { number: "10+", label: "Active Researchers" },
    { number: "20+", label: "Topics Evaluated" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Expert Support" },
  ];

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
      className={`min-h-screen overflow-hidden relative transition-all duration-500 ${
        isDarkMode
          ? "bg-slate-900 text-white"
          : "bg-gray-50 text-gray-600"
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
      <Navbar />

      <motion.section
        className="relative z-10 px-6 py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Transform Your Research
            </span>
            <br />
            <span className={`text-4xl md:text-5xl font-semibold ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Chaos Into Structured Success
            </span>
          </motion.h1>

          {/* <motion.p
            className={`text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Get instant AI-powered evaluation across 6 key academic metrics. 
            Turn your research ideas into structured, fundable projects with expert guidance.
          </motion.p> */}
        
          <motion.div
            className="max-w-6xl mx-auto mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >

            {/* Enhanced Input Form Container */}
            <div className="relative mb-16">
              {/* Background Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl blur-3xl opacity-20 ${
                isDarkMode ? "bg-blue-500/30" : "bg-blue-500/20"
              }`} />
              
              {/* Form Container with Enhanced Styling */}
              <div className={`relative z-10 max-w-5xl mx-auto p-8 rounded-3xl border-2 backdrop-blur-sm ${
                isDarkMode
                  ? "bg-white/5 border-white/20 shadow-2xl"
                  : "bg-white/90 border-gray-200/50 shadow-2xl"
              }`}>
                {/* Form Label */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-600"
                  }`}>
                    Start Your Research Evaluation
                  </h3>
                  <p className={`text-lg ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Enter your research topic below to get instant feedback
                  </p>
                </motion.div>

                {/* Input and Button Container */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  {/* Enhanced Input Field */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Machine learning applications in healthcare diagnostics"
                      className={`w-full px-6 py-5 text-xl rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-30 ${
                        isDarkMode
                          ? "bg-white/10 border-white/40 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/30 shadow-lg"
                          : "bg-white border-gray-300 text-gray-600 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30 shadow-lg"
                      }`}
                      onFocus={(e) => {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = isDarkMode 
                          ? '0 0 0 4px rgba(59, 130, 246, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                          : '0 0 0 4px rgba(59, 130, 246, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '';
                      }}
                    />
                    
                  </div>

                  {/* Enhanced Button */}
                  <motion.button
                    onClick={handleEvaluate}
                    className={`px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-3 whitespace-nowrap shadow-xl hover:shadow-2xl ${
                      topic.trim()
                        ? "bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!topic.trim()}
                    whileHover={topic.trim() ? { scale: 1.05 } : {}}
                    whileTap={topic.trim() ? { scale: 0.95 } : {}}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                  >
                    <span>Evaluate Research</span>
                    <motion.div
                      animate={topic.trim() ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Target className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                </motion.div>

               
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {[
                { 
                  icon: Target, 
                  label: "Novelty",
                  color: "text-blue-500"
                },
                { 
                  icon: TrendingUp, 
                  label: "Trends",
                  color: "text-emerald-500"
                },
                { 
                  icon: BarChart3, 
                  label: "Methodology",
                  color: "text-purple-500"
                },
                { 
                  icon: Lightbulb, 
                  label: "Research Gaps",
                  color: "text-amber-500"
                },
                { 
                  icon: Award, 
                  label: "Grant Potential",
                  color: "text-orange-500"
                },
                { 
                  icon: BookOpen, 
                  label: "Literature",
                  color: "text-red-500"
                },
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={index}
                    className={`group relative text-center p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 border ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        : "bg-white/80 border-gray-200/50 hover:bg-white hover:border-gray-300/70 shadow-sm hover:shadow-lg"
                    }`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.9 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {/* Subtle background on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isDarkMode 
                        ? "bg-white/5" 
                        : "bg-gray-50/50"
                    }`} />
                    
                    {/* Enhanced icon container */}
                    <div className={`relative z-10 w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isDarkMode
                        ? "bg-white/10 group-hover:bg-white/20"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}>
                      <IconComponent
                        className={`w-7 h-7 transition-all duration-300 ${metric.color}`}
                      />
                    </div>
                    
                    {/* Enhanced typography */}
                    <h3 className={`text-base font-bold transition-colors duration-300 relative z-10 ${
                      isDarkMode ? "text-gray-100 group-hover:text-white" : "text-gray-600 group-hover:text-gray-600"
                    }`}>
                      {metric.label}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>


        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-10 px-6 relative z-10"
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
                <div className={`text-4xl md:text-5xl font-bold mb-2 `}>
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
              className={`text-4xl md:text-6xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
             What We Do
            </motion.h2>
            <motion.p
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
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
                  className={`group relative backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 border overflow-hidden ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      : "bg-white/80 border-gray-200/50 hover:bg-white hover:border-gray-300/70 shadow-sm hover:shadow-xl"
                  }`}
                  initial={{ y: 60, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 80,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.02,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  {/* Subtle background pattern */}
                  <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${
                    isDarkMode 
                      ? "bg-white/10" 
                      : "bg-gray-200/30"
                  } rounded-full blur-2xl`} />

                  {/* Enhanced icon container */}
                  <motion.div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-all duration-300 group-hover:scale-110 ${
                      isDarkMode
                        ? "bg-white/10 group-hover:bg-white/20"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: [0, -8, 8, 0],
                      transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                  >
                    <IconComponent className={`w-9 h-9 transition-colors duration-300 ${feature.color}`} />
                  </motion.div>

                  {/* Enhanced typography hierarchy */}
                  <h3 className={`text-2xl font-bold mb-3 transition-all duration-300 relative z-10 ${
                    isDarkMode
                      ? "text-white group-hover:text-white"
                      : "text-gray-700 group-hover:text-gray-700"
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm font-medium mb-3 transition-colors duration-300 relative z-10 ${
                    isDarkMode
                      ? "text-gray-300 group-hover:text-gray-200"
                      : "text-gray-700 group-hover:text-gray-800"
                  }`}>
                    {feature.shortDesc}
                  </p>
                  
                  <p className={`text-base leading-relaxed transition-all duration-300 relative z-10 ${
                    isDarkMode
                      ? "text-gray-400 group-hover:text-gray-300"
                      : "text-gray-700 group-hover:text-gray-700"
                  }`}>
                    {feature.description}
                  </p>

                  {/* Subtle hover indicator */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 rounded-b-3xl transition-all duration-500 ${
                    isDarkMode
                      ? "bg-white/20 opacity-0 group-hover:opacity-100"
                      : "bg-gray-300/50 opacity-0 group-hover:opacity-100"
                  }`} />
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
                ? "bg-white/5 border border-white/10"
                : "bg-white/80 border border-gray-200 shadow-xl"
            }`}
          >
            <motion.h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Ready to Transform Your Research?
            </motion.h2>
            <motion.p
              className={`text-xl mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
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
                className="bg-amber-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-white"
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
                isDarkMode ? "text-gray-400" : "text-gray-700"
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
            : "bg-white text-gray-700 border-t border-gray-200"
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
                  isDarkMode ? "text-gray-300" : "text-gray-700"
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
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Platform
              </h4>
              <ul className="space-y-3">
                {["Features", "Pricing"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 flex items-center group"
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
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Community",
                  "Contact",
                 
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 flex items-center group"
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
                  isDarkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                © 2025 Dissertation Scaffold. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Made with ❤️ for researchers worldwide
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
