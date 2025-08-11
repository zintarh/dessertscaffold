'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import {
  Check, X, Crown, Users,
  GraduationCap, ArrowRight, Target, Rocket, Brain,
  BookOpen, TrendingUp
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  excludedFeatures?: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'premium';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'student',
    name: 'Student',
    price: '$9.99',
    period: 'per month',
    description: 'Perfect for undergraduate and graduate students starting their research journey',
    features: [
      'Research topic evaluation',
      'Timeline planning & tracking',
      'Progress visualization',
      'Writing space with auto-save',
      'Basic templates library',
      'Export to Word/PDF',
      'Community access',
      'Email support'
    ],
    excludedFeatures: [
      '1-on-1 mentorship',
      'Advanced analytics',
      'Priority support'
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'secondary',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'researcher',
    name: 'Researcher',
    price: '$19.99',
    period: 'per month',
    description: 'Ideal for PhD candidates and active researchers with advanced needs',
    popular: true,
    badge: 'Most Popular',
    features: [
      'All Student features',
      'Advanced research evaluation',
      'Priority support & feedback',
      'Premium templates library',
      'Grant writing resources',
      'Data analysis tools',
      '2 mentor sessions/month',
      'Collaboration workspace',
      'Advanced progress analytics'
    ],
    excludedFeatures: [
      'Institutional analytics',
      'Custom integrations'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'primary',
    icon: Rocket,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 'Custom',
    period: 'pricing',
    description: 'Comprehensive solution for universities and research institutions',
    features: [
      'All Researcher features',
      'Unlimited user accounts',
      'Institutional branding',
      'Admin dashboard',
      'User management system',
      'Advanced analytics suite',
      'Custom integrations',
      'Dedicated support team',
      'Training sessions',
      'API access'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'premium',
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500'
  }
];

export default function PricingPage() {
  const { isDarkMode } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const getButtonStyles = (variant: string, _popular?: boolean) => {
    const baseStyles = "w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg";
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25`;
      case 'secondary':
        return `${baseStyles} ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`;
      case 'premium':
        return `${baseStyles} bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-amber-500/25`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 font-['Urbanist'] ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    } relative overflow-hidden`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-black">DissertScaffold</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/community" className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'
            }`}>
              Community
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Choose Your Research Journey</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            Pricing Plans
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Select the plan that accelerates your research journey and unlocks your academic potential
          </p>

          {/* Annual/Monthly Toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mt-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className={`font-medium ${!isAnnual ? 'text-blue-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: isAnnual ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${isAnnual ? 'text-emerald-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Annual
              </span>
              <motion.span 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                animate={{ scale: isAnnual ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                Save 20%
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isHovered = hoveredPlan === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                className={`relative rounded-3xl p-8 backdrop-blur-xl border transition-all duration-500 ${
                  plan.popular 
                    ? `border-blue-500/50 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-emerald-900/40' : 'bg-gradient-to-br from-blue-50/80 to-emerald-50/80'} shadow-2xl shadow-blue-500/20`
                    : `${isDarkMode ? 'border-gray-700/50 bg-gray-800/40' : 'border-gray-200/50 bg-white/40'} hover:border-blue-500/30`
                } ${isHovered ? 'scale-105 shadow-2xl' : ''}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                whileHover={{ y: -10 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    {plan.badge}
                  </motion.div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        {plan.price === 'Custom' ? plan.price : (isAnnual && plan.price !== 'Custom' ? 
                          `$${Math.round(parseFloat(plan.price.replace('$', '')) * 12 * 0.8)}` : plan.price)}
                      </span>
                      {plan.price !== 'Custom' && (
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {isAnnual ? '/year' : plan.period}
                        </span>
                      )}
                    </div>
                    {plan.price === 'Custom' && (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center space-x-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + featureIndex * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.div>
                  ))}
                  
                  {plan.excludedFeatures?.map((feature, featureIndex) => (
                    <motion.div
                      key={`excluded-${featureIndex}`}
                      className="flex items-center space-x-3 opacity-50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 0.5 }}
                      transition={{ delay: 0.8 + featureIndex * 0.1 }}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className={getButtonStyles(plan.buttonVariant, plan.popular)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          className="mt-20 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 className="text-3xl font-black mb-4">Why Choose DissertScaffold?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Target,
                title: "Research-Focused",
                description: "Built specifically for academic researchers and students"
              },
              {
                icon: Users,
                title: "Expert Mentorship",
                description: "Connect with experienced researchers and mentors"
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Visualize your research journey and milestones"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
