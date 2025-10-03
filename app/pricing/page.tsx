"use client";

import AnimatedSection from "../components/front/AnimatedSection";
import Footer from "../components/front/Footer";
import Navbar from "../components/front/Navbar";
import PageAnimation from "../components/PageAnimation";
import { Check, X } from 'lucide-react';

export default function PricingPage() {
  const features = [
    {
      name: "Research Topic Evaluation",
      description: "Comprehensive analysis across six key metrics"
    },
    {
      name: "Grant Potential Analysis", 
      description: "Identify funding opportunities and success probability"
    },
    {
      name: "Methodology Assessment",
      description: "Evaluate research approach and technical feasibility"
    },
    {
      name: "Trend Analysis",
      description: "Current market trends and future trajectory insights"
    },
    {
      name: "Impact Assessment",
      description: "Scientific, social, and economic impact evaluation"
    },
    {
      name: "Expert Mentor Matching",
      description: "Connect with qualified academic mentors"
    },
    {
      name: "Unlimited Evaluations",
      description: "No limits on research topic assessments"
    },
    {
      name: "Priority Support",
      description: "24/7 priority customer support"
    },
    {
      name: "Advanced Analytics",
      description: "Detailed reports and success metrics"
    },
    {
      name: "Custom Integrations",
      description: "API access and custom workflow integrations"
    },
    {
      name: "White-label Solutions",
      description: "Branded platform for institutions"
    },
    {
      name: "Dedicated Account Manager",
      description: "Personal success manager for enterprise clients"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individual researchers getting started",
      color: "text-gray-900",
      checkColor: "text-gray-900",
      features: [
        true,  // Research Topic Evaluation
        true,  // Grant Potential Analysis
        true,  // Methodology Assessment
        true,  // Trend Analysis
        true,  // Impact Assessment
        false, // Expert Mentor Matching
        false, // Unlimited Evaluations
        false, // Priority Support
        false, // Advanced Analytics
        false, // Custom Integrations
        false, // White-label Solutions
        false  // Dedicated Account Manager
      ]
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "For serious researchers and small teams",
      color: "text-purple-600",
      checkColor: "text-purple-600",
      features: [
        true,  // Research Topic Evaluation
        true,  // Grant Potential Analysis
        true,  // Methodology Assessment
        true,  // Trend Analysis
        true,  // Impact Assessment
        true,  // Expert Mentor Matching
        true,  // Unlimited Evaluations
        true,  // Priority Support
        true,  // Advanced Analytics
        false, // Custom Integrations
        false, // White-label Solutions
        false  // Dedicated Account Manager
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For institutions and large research organizations",
      color: "text-purple-800",
      checkColor: "text-purple-800",
      features: [
        true,  // Research Topic Evaluation
        true,  // Grant Potential Analysis
        true,  // Methodology Assessment
        true,  // Trend Analysis
        true,  // Impact Assessment
        true,  // Expert Mentor Matching
        true,  // Unlimited Evaluations
        true,  // Priority Support
        true,  // Advanced Analytics
        true,  // Custom Integrations
        true,  // White-label Solutions
        true   // Dedicated Account Manager
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageAnimation>
        {/* Navbar */}
        <AnimatedSection animationType="fadeIn" delay={100} duration={600}>
          <Navbar />
        </AnimatedSection>

        {/* Main Content */}
        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            
            {/* Header Section */}
            <AnimatedSection animationType="fadeInUp" delay={200} duration={800}>
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Compare plans
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Use Dissert Scaffold for free with your entire team. Upgrade to unlock advanced features, 
                  expert mentorship, unlimited evaluations, and more.
                </p>
              </div>
            </AnimatedSection>

            {/* Pricing Table */}
            <AnimatedSection animationType="fadeInUp" delay={300} duration={800}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 bg-gray-50">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                  </div>
                  {plans.map((plan, index) => (
                    <div key={plan.name} className="text-center">
                      <h3 className={`text-lg font-semibold ${plan.color}`}>
                        {plan.name}
                      </h3>
                      <div className="mt-2">
                        <span className={`text-3xl font-bold ${plan.color}`}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {plan.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Feature Rows */}
                <div className="divide-y divide-gray-200">
                  {features.map((feature, featureIndex) => (
                    <div key={feature.name} className="grid grid-cols-4 gap-4 p-6 hover:bg-gray-50 transition-colors">
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {feature.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                      {plans.map((plan, planIndex) => (
                        <div key={`${plan.name}-${featureIndex}`} className="text-center flex items-center justify-center">
                          {plan.features[featureIndex] ? (
                            <Check className={`w-5 h-5 ${plan.checkColor}`} />
                          ) : (
                            <X className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-t border-gray-200">
                  <div></div>
                  {plans.map((plan, index) => (
                    <div key={plan.name} className="text-center">
                      <button 
                        className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                          plan.name === 'Free' 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                            : 'text-white hover:opacity-90'
                        }`}
                        style={plan.name !== 'Free' ? { 
                          backgroundColor: plan.name === 'Professional' ? 'var(--primary-button)' : '#5a2d91',
                        } : {}}
                      >
                        {plan.name === 'Enterprise' ?  'Contact Sales' : plan.name === 'Professional' ? 'Professional' : 'Get Started'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Additional Info */}
            <AnimatedSection animationType="fadeInUp" delay={400} duration={800}>
              <div className="mt-12 text-center">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    All plans include
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Check className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">No setup fees</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Check className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Cancel anytime</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Check className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">30-day money back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection animationType="fadeInUp" delay={500} duration={800}>
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Can I change plans anytime?
                    </h4>
                    <p className="text-gray-600">
                      Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      What payment methods do you accept?
                    </h4>
                    <p className="text-gray-600">
                      We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Is there a free trial?
                    </h4>
                    <p className="text-gray-600">
                      Yes, our Free plan gives you access to core features. Professional plans include a 14-day free trial.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Do you offer educational discounts?
                    </h4>
                    <p className="text-gray-600">
                      Yes, we offer special pricing for educational institutions. Contact us for more information.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Footer */}
        <AnimatedSection animationType="fadeIn" delay={600} duration={800}>
          <Footer />
        </AnimatedSection>
      </PageAnimation>
    </div>
  );
}
