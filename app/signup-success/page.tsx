'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowRight } from '../components/Icons';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from "../components/Navbar";

export default function SignupSuccessPage() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    }`}>
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div 
          className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/90 border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            {/* Success Icon */}
            <motion.div 
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1 
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Registration Successful! 🎉
            </motion.h1>

            {/* Message */}
            <motion.div 
              className="space-y-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Thank you for joining DissertScaffold! We've sent a verification email to your inbox.
              </p>
              
              <div className={`p-4 rounded-xl ${
                isDarkMode 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <Mail className={`w-5 h-5 mt-0.5 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>
                      Next Steps:
                    </p>
                    <ol className={`text-sm mt-2 space-y-1 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      <li>1. Check your email inbox (and spam folder)</li>
                      <li>2. Click the verification link in the email</li>
                      <li>3. Return here to sign in and start your research journey</li>
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/signin"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-emerald-600 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg transition-all duration-300"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              
              <Link
                href="/signup"
                className={`block w-full py-3 rounded-xl font-medium text-center transition-all duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300 border border-gray-600 hover:border-gray-500' 
                    : 'text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                Register Another Account
              </Link>
            </motion.div>

            {/* Help Text */}
            <motion.div 
              className={`mt-6 p-4 rounded-xl ${
                isDarkMode 
                  ? 'bg-yellow-900/20 border border-yellow-500/30' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className={`text-sm ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
              }`}>
                <strong>Didn't receive the email?</strong> Check your spam folder or wait a few minutes. 
                The verification link expires in 24 hours for security.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
