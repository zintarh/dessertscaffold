'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Users,
  Target,
  Shield,
  Brain,
  Award,
  Building,
  Sun,
  Moon
} from '../components/Icons';

import { useTheme } from '../contexts/ThemeContext';

export default function SignupPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    institutionName: '',
    userType: '',
    researchArea: '',
    academicLevel: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      handleNext();
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!formData.userType) {
      alert('Please select your user type!');
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.userType;
      case 2:
        return formData.userType === 'institution' ? formData.institutionName.trim() : (formData.firstName.trim() && formData.lastName.trim());
      case 3:
        return formData.email.trim() && formData.institutionName.trim();
      case 4:
        return formData.password && formData.confirmPassword && formData.agreeToTerms;
      default:
        return false;
    }
  };

  const userTypes = [
    {
      id: 'msc',
      title: 'MSc Student',
      description: 'Master\'s degree research',
      icon: GraduationCap,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'phd',
      title: 'PhD Candidate',
      description: 'Doctoral research journey',
      icon: Brain,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'researcher',
      title: 'Academic Researcher',
      description: 'Scholarly research work',
      icon: Award,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'mentor',
      title: 'Academic Mentor',
      description: 'Supervisor or advisor',
      icon: Users,
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'institution',
      title: 'Institution',
      description: 'University or organization',
      icon: Building,
      color: 'from-gray-600 to-gray-700'
    }
  ];

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
              href="/"
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
              Home
            </motion.a>
            <motion.a
              href="/community"
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
              transition={{ delay: 0.3, duration: 0.5 }}
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
              transition={{ delay: 0.4, duration: 0.5 }}
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
                  ? "bg-white/10 hover:bg-white/20 text-gray-700"
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
              Sign In
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - School Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* School Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div 
                  className="w-full h-[600px] bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('/images/signup-bg.jpg')`
                  }}
                >
                  {/* Academic Icons Pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-8 opacity-20">
                      {[GraduationCap, Brain, Award, Target, Building, Users].map((Icon, i) => (
                        <motion.div
                          key={i}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            isDarkMode ? 'bg-white/10' : 'bg-white/30'
                          }`}
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, 0]
                          }}
                          transition={{ 
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        >
                          <Icon className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <motion.div 
                      className="text-white space-y-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">
                          Join <span className="text-blue-300">10,000+</span> Researchers
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed max-w-md mx-auto">
                          Transform your academic journey with expert insights and a supportive research community.
                        </p>
                      </div>
                      

                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                className={`absolute -top-6 -right-6 p-4 rounded-2xl shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                }`}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Active Researchers
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Multi-Step Form */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/90 border-gray-200'
            }`}>
              
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GraduationCap className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className={`text-4xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Join the Future
                </h1>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {
                    currentStep === 1 ? 'Choose your category' :
                    currentStep === 2 ? 'Tell us about yourself' :
                    currentStep === 3 ? 'Contact & affiliation' :
                    'Secure your account'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: User Type Selection Only */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* User Type Selection */}
                    <div className="space-y-3">
                      <label className={`text-lg font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        I am a...
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {userTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <motion.button
                              key={type.id}
                              type="button"
                              onClick={() => handleInputChange('userType', type.id)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                formData.userType === type.id
                                  ? isDarkMode
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-blue-500 bg-blue-50'
                                  : isDarkMode
                                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center`}>
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className={`font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {type.title}
                                  </div>
                                  <div className={`text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {formData.userType === 'institution' ? (
                      /* Institution Name Field */
                      <div className="space-y-2">
                        <label htmlFor="institutionName" className={`text-sm font-semibold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Institution Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="institutionName"
                            placeholder="Enter institution name"
                            value={formData.institutionName}
                            onChange={(e) => handleInputChange('institutionName', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      /* First and Last Name Fields */
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="firstName" className={`text-sm font-semibold ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              First Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="firstName"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                  isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                }`}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName" className={`text-sm font-semibold ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              Last Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                  isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                }`}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Contact & Institution */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
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
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Institution Field */}
                    <div className="space-y-2">
                      <label htmlFor="institution" className={`text-sm font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Institution
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="institution"
                          placeholder="Your university or organization"
                          value={formData.institutionName}
                          onChange={(e) => handleInputChange('institutionName', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Research Area Field */}
                    <div className="space-y-2">
                      <label htmlFor="researchArea" className={`text-sm font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Research Area <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="researchArea"
                          placeholder="e.g., Machine Learning, Psychology, Biology"
                          value={formData.researchArea}
                          onChange={(e) => handleInputChange('researchArea', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Security & Terms */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
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
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className={`text-sm font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        required
                      />
                      <label htmlFor="agreeToTerms" className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        I agree to the{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-600 underline font-medium">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-600 underline font-medium">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between space-x-4">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={handlePrevious}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'text-gray-300 border border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                          : 'text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Previous
                    </motion.button>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={!isStepValid() || isSubmitting}
                    className={`flex-1 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg ${
                      currentStep === 1 ? 'ml-0' : ''
                    }`}
                    whileHover={{ scale: isStepValid() ? 1.02 : 1 }}
                    whileTap={{ scale: isStepValid() ? 0.98 : 1 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {currentStep === 4 ? 'Create Account' : 'Continue'}
                        </span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-8">
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-500 hover:text-blue-600 font-bold underline transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
