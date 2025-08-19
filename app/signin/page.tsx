'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Sun, Moon, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Target, CheckCircle, PenTool } from '../components/Icons';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from "../components/Navbar";

export default function SigninPage() {

  const { isDarkMode, toggleTheme, isHydrated } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'network' | 'validation' | null>(null);
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
      setErrorType(null);
    }
  };

  const getErrorMessage = (errorType: string | null, error: string | null) => {
    if (!error) return null;
    
    switch (errorType) {
      case 'auth':
        return {
          title: 'Authentication Failed',
          message: error,
          suggestion: 'Please check your email and password, or create a new account if you don\'t have one.',
          action: 'Try Again'
        };
      case 'network':
        return {
          title: 'Connection Error',
          message: error,
          suggestion: 'Please check your internet connection and try again.',
          action: 'Retry'
        };
      case 'validation':
        return {
          title: 'Invalid Input',
          message: error,
          suggestion: 'Please check your email format and ensure password is at least 8 characters.',
          action: 'Fix Input'
        };
      default:
        return {
          title: 'Error',
          message: error,
          suggestion: 'Please try again or contact support if the problem persists.',
          action: 'Try Again'
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim()) {
      setError('Email is required');
      setErrorType('validation');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Password is required');
      setErrorType('validation');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setErrorType('validation');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setErrorType('validation');
      return;
    }

    setError(null);
    setErrorType(null);
    setIsSubmitting(true);
    
    try {
      const res = await signIn('credentials', {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      });
      
      if (!res) {
        setError('Unexpected error occurred. Please try again.');
        setErrorType('network');
      } else if (res.error) {
        // Handle specific NextAuth errors
        switch (res.error) {
          case 'CredentialsSignin':
            setError('Invalid email or password. Please check your credentials and try again.');
            setErrorType('auth');
            break;
          case 'Callback':
            setError('Authentication callback failed. Please try again.');
            setErrorType('auth');
            break;
          case 'OAuthSignin':
            setError('OAuth signin failed. Please try again.');
            setErrorType('auth');
            break;
          case 'OAuthCallback':
            setError('OAuth callback failed. Please try again.');
            setErrorType('auth');
            break;
          case 'OAuthCreateAccount':
            setError('Failed to create OAuth account. Please try again.');
            setErrorType('auth');
            break;
          case 'EmailCreateAccount':
            setError('Failed to create email account. Please try again.');
            setErrorType('auth');
            break;
          case 'Callback':
            setError('Authentication callback failed. Please try again.');
            setErrorType('auth');
            break;
          case 'OAuthAccountNotLinked':
            setError('This email is already associated with a different account.');
            setErrorType('auth');
            break;
          case 'EmailSignin':
            setError('Email signin failed. Please check your email and try again.');
            setErrorType('auth');
            break;
          case 'CredentialsSignin':
            setError('Invalid email or password. Please check your credentials and try again.');
            setErrorType('auth');
            break;
          case 'SessionRequired':
            setError('Please sign in to access this page.');
            setErrorType('auth');
            break;
          case 'Default':
            setError('Authentication failed. Please try again.');
            setErrorType('auth');
            break;
          default:
            setError('Invalid email or password. Please check your credentials and try again.');
            setErrorType('auth');
        }
      } else {
        // Success - redirect to writing environment
        router.replace('/writing-environment');
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('Network error. Please check your connection and try again.');
      setErrorType('network');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className={`min-h-screen overflow-hidden relative transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDarkMode ? 'bg-blue-600/20' : 'bg-blue-600/10'
        }`} style={{ left: '20%', top: '20%' }} />
        <div className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl animate-bounce ${
          isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        }`} />
        <div className={`absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full blur-xl animate-pulse ${
          isDarkMode ? 'bg-amber-500/10' : 'bg-amber-500/5'
        }`} />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Full Background Image */}
          <motion.div 
            className="relative h-[700px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/images/signin-bg.jpg')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold">Welcome Back!</h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Continue your research journey with access to advanced research tools, 
                  expert guidance, and a community of scholars.
                </p>
                
                {/* Feature Highlights */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm">Expert research evaluation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm">Expert community access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-sm">Personalized research roadmap</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Signin Form */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <div className="text-center mb-8">
                <motion.h1 
                  className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Sign In
                </motion.h1>
                <motion.p 
                  className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Welcome back to your research journey
                </motion.p>
              </div>

              {/* Helpful Info Message */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border border-blue-800/30 text-blue-200' 
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">New to the platform?</p>
                    <p className="text-xs mt-1 opacity-90">
                      If you don't have an account yet, please{' '}
                      <Link href="/signup" className="underline hover:no-underline font-medium">
                        create one here
                      </Link>
                      {' '}first, then come back to sign in.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Authentication Status Info */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`p-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-amber-900/20 border border-amber-800/30 text-amber-200' 
                    : 'bg-amber-50 border border-amber-200 text-amber-700'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">First time setup?</p>
                    <p className="text-xs mt-1 opacity-90">
                      If this is your first time using the platform, you'll need to{' '}
                      <Link href="/signup" className="underline hover:no-underline font-medium">
                        create an account
                      </Link>
                      {' '}before you can sign in. The database is currently empty.
                    </p>
                  </div>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      errorType === 'auth' 
                        ? 'bg-red-50 border-red-500 text-red-800' 
                        : errorType === 'network'
                        ? 'bg-orange-50 border-orange-500 text-orange-800'
                        : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                    } ${isDarkMode ? 'bg-opacity-20' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        errorType === 'auth' 
                          ? 'bg-red-100 text-red-600' 
                          : errorType === 'network'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {errorType === 'auth' ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : errorType === 'network' ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${
                          errorType === 'auth' 
                            ? 'text-red-800' 
                            : errorType === 'network'
                            ? 'text-orange-800'
                            : 'text-yellow-800'
                        }`}>
                          {getErrorMessage(errorType, error)?.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          errorType === 'auth' 
                            ? 'text-red-700' 
                            : errorType === 'network'
                            ? 'text-orange-700'
                            : 'text-yellow-700'
                        }`}>
                          {error}
                        </p>
                        <p className={`text-xs mt-2 ${
                          errorType === 'auth' 
                            ? 'text-red-600' 
                            : errorType === 'network'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}>
                          {getErrorMessage(errorType, error)?.suggestion}
                        </p>
                        {errorType === 'auth' && (
                          <div className="mt-3 flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setError(null);
                                setErrorType(null);
                              }}
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              Try Again
                            </button>
                            <Link
                              href="/signup"
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              Create Account
                            </Link>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setErrorType(null);
                        }}
                        className={`flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ${
                          isDarkMode ? 'hover:text-gray-300' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-sm font-semibold ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      } ${
                        formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                          ? 'border-green-500 focus:ring-green-500'
                          : ''
                      }`}
                      required
                    />
                    {formData.email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <p className="text-xs text-red-500">Please enter a valid email address</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className={`text-sm font-semibold ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      } ${
                        formData.password && formData.password.length < 8
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.password && formData.password.length >= 8
                          ? 'border-green-500 focus:ring-green-500'
                          : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {formData.password && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {formData.password.length >= 8 ? (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {formData.password && formData.password.length < 8 && (
                    <p className="text-xs text-red-500">Password must be at least 8 characters long</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Remember me
                    </span>
                  </label>
                  <Link 
                    href="/forgot-password"
                    className={`text-sm text-blue-600 hover:text-blue-700 transition-colors ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : ''
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 py-3 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

              

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${
                      isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                    }`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="w-5 h-5">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <span>Google</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="w-5 h-5">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#A6CE39" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
                        <path fill="#A6CE39" d="M12 4c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 2c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/>
                        <path fill="#A6CE39" d="M12 6c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"/>
                      </svg>
                    </div>
                    <span>ORCID</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Don&apos;t have an account?{' '}
                  </span>
                  <Link 
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
