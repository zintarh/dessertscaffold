'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, XCircle, Mail, ArrowRight } from '../components/Icons';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from "../components/Navbar";

export default function VerifyEmailPage() {
  const { isDarkMode } = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    // Verify the email token
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    }`}>
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div 
          className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/90 border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            {/* Status Icon */}
            <motion.div 
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                status === 'loading' 
                  ? 'bg-blue-500' 
                  : status === 'success' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              )}
              {status === 'success' && <CheckCircle className="w-10 h-10 text-white" />}
              {status === 'error' && <XCircle className="w-10 h-10 text-white" />}
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
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified! 🎉'}
              {status === 'error' && 'Verification Failed'}
            </motion.h1>

            {/* Message */}
            <motion.p 
              className={`text-lg mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.p>

            {/* Action Buttons */}
            {status !== 'loading' && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {status === 'success' ? (
                  <Link
                    href="/signin"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-emerald-600 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg transition-all duration-300"
                  >
                    <span>Sign In Now</span>
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => window.location.reload()}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Try Again
                    </button>
                    <Link
                      href="/signup"
                      className={`block w-full py-3 rounded-xl font-medium text-center transition-all duration-300 ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-300/30' 
                          : 'text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300'
                      }`}
                    >
                      Back to Sign Up
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Help Text */}
            {status === 'error' && (
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
                <div className="flex items-start space-x-3">
                  <Mail className={`w-5 h-5 mt-0.5 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
                    }`}>
                      Need help?
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                    }`}>
                      Check your email for the verification link, or contact support if you continue having issues.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
