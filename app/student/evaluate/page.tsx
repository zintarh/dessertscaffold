'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Brain, 
  FileText, 
  Download, 
  Save, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Dummy Expert evaluation data
const dummyEvaluation = {
  topic: "Machine Learning Applications in Healthcare: A Comprehensive Review",
  strengths: [
    "High relevance to current healthcare challenges",
    "Strong potential for real-world impact",
    "Abundant available data sources",
    "Clear practical applications",
    "Growing research interest and funding"
  ],
  weaknesses: [
    "Broad scope may lack focus",
    "Requires interdisciplinary expertise",
    "Ethical considerations complex",
    "Regulatory compliance challenges",
    "Data privacy concerns"
  ],
  suggestions: [
    "Narrow focus to specific healthcare domain (e.g., radiology, drug discovery)",
    "Include ethical framework and regulatory considerations",
    "Define clear success metrics and evaluation criteria",
    "Consider collaboration with healthcare professionals",
    "Address data quality and bias issues"
  ],
  score: 8.2,
  confidence: "High",
  estimatedTime: "6-8 months",
  difficulty: "Advanced",
  resources: [
    "IEEE Journal of Biomedical and Health Informatics",
    "Nature Machine Intelligence",
    "Healthcare Data Science conferences",
    "Clinical trial datasets",
    "Expert mentors in healthcare ML"
  ]
};

export default function EvaluatePage() {
  const { isDarkMode, isHydrated } = useTheme();
  const [topic, setTopic] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<typeof dummyEvaluation | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleEvaluate = async () => {
    if (!topic.trim()) return;
    
    setIsEvaluating(true);
    // Simulate Expert evaluation
    setTimeout(() => {
      setEvaluation(dummyEvaluation);
      setShowResults(true);
      setIsEvaluating(false);
    }, 3000);
  };

  const handleSave = () => {
    // Save evaluation to user's account
    console.log('Saving evaluation:', evaluation);
  };

  const handleDownload = (format: 'pdf' | 'docx') => {
    // Download evaluation report
    console.log(`Downloading ${format} report`);
  };

  // Don't render theme-dependent content until hydration is complete
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
    <div className="min-h-screen py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Expert Topic Evaluation</h1>
        <p className={`text-xl ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Get intelligent feedback on your research topic before you start writing
        </p>
      </motion.div>

      {/* Topic Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className={`p-8 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <label htmlFor="topic" className="block text-lg font-semibold mb-4">
            Enter Your Research Topic
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Describe your research topic in detail. Include the main research question, scope, methodology, and expected outcomes..."
            className={`w-full h-32 p-4 text-lg border-2 rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
          />
          <div className="mt-4 flex items-center justify-between">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {topic.length} characters
            </span>
            <button
              onClick={handleEvaluate}
              disabled={!topic.trim() || isEvaluating}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center space-x-2 ${
                !topic.trim() || isEvaluating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:scale-105'
              }`}
            >
              {isEvaluating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Evaluate Topic</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Evaluation Results */}
      {showResults && evaluation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className={`p-8 rounded-2xl shadow-lg ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Evaluation Results</h2>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {evaluation.topic}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {evaluation.score}/10
                </div>
                <div className={`text-sm px-3 py-1 rounded-full ${
                  evaluation.score >= 8 ? 'bg-green-100 text-green-700' :
                  evaluation.score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {evaluation.score >= 8 ? 'Excellent' :
                   evaluation.score >= 6 ? 'Good' : 'Needs Work'}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Timeline</span>
                </div>
                <p className="text-sm">{evaluation.estimatedTime}</p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold">Difficulty</span>
                </div>
                <p className="text-sm">{evaluation.difficulty}</p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">Confidence</span>
                </div>
                <p className="text-sm">{evaluation.confidence}</p>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Strengths</span>
                </h3>
                <ul className="space-y-2">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Areas for Improvement</span>
                </h3>
                <ul className="space-y-2">
                  {evaluation.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {weakness}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <span>Recommendations</span>
                </h3>
                <ul className="space-y-2">
                  {evaluation.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resources */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Recommended Resources</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.resources.map((resource, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {resource}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>Save Report</span>
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>PDF</span>
                </button>
                
                <button
                  onClick={() => handleDownload('docx')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>DOCX</span>
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/student/documents"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <FileText className="w-6 h-6" />
                <span>Proceed to Writing</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className={`text-sm mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Start writing your research document with confidence
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back to Dashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Link
          href="/student/dashboard"
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
            isDarkMode 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowRight className="w-5 h-5 transform rotate-180" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
      </div>
    </div>
  );
}
