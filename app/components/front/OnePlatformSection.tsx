"use client";
import React from "react";
import { 
  BarChart3, 
  Clock, 
  DollarSign, 
  UserPlus, 
  Workflow, 
  Users, 
  TrendingUp, 
  Target, 
  Award, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  UserCheck, 
  Video,
  Plus
} from "lucide-react";

interface MetricCardProps {
  feature: {
    title: string;
    bgColor: string;
    iconColor: string;
    textColor: string;
    borderColor: string;
    items: Array<{ name: string; active: boolean }>;
    description: string;
    icon: React.ReactElement;
  };
}

function MetricCard({ feature }: MetricCardProps) {
  // Disable animation - show all items statically
  const staticItems = feature.items.map((item, index) => ({
    ...item,
    originalIndex: index,
    position: index,
    isActive: true // All items are active since there's no animation
  }));

  return (
    <div
      className={`${feature.bgColor} ${feature.borderColor} w-full h-full border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 relative hover:shadow-lg transition-shadow duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${feature.textColor}`}>
          {feature.title}
        </h3>
        <div className={`${feature.iconColor} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white flex-shrink-0`}>
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>

      {/* Features List - Static Display */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {staticItems.slice(0, 4).map((item, itemIndex) => (
          <div 
            key={`${item.name}-${item.originalIndex}-${itemIndex}`}
            className="w-full flex items-center space-x-3"
          >
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center transition-all duration-500 ${
              item.isActive 
                ? `${feature.iconColor} text-white` 
                : `${feature.bgColor} ${feature.textColor} opacity-30`
            }`}>
              {item.isActive ? (
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-current rounded opacity-50" />
              )}
            </div>
            <span className={`text-sm sm:text-base font-medium ${
              item.isActive ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className={`text-sm sm:text-base ${feature.textColor} leading-relaxed`}>
        {feature.description}
      </p>
    </div>
  );
}

export default function OnePlatformSection() {
  const features = [
    {
      title: "Novelty",
      bgColor: "bg-green-50",
      iconColor: "bg-[#6CB95E]",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      items: [
        { name: "Innovation Score", active: true },
        { name: "Uniqueness Analysis", active: true },
        { name: "Patent Landscape", active: true },
        { name: "Literature Gap", active: true },
        { name: "Competitive Analysis", active: true },
        { name: "Breakthrough Potential", active: false },
      ],
      description: "Assess the originality and innovation potential of your research topic.",
      icon: <Brain className="w-4 h-4" />
    },
    {
      title: "Grant Potential",
      bgColor: "bg-pink-50",
      iconColor: "bg-[#E063C7]",
      textColor: "text-[#E063C7]",
      borderColor: "border-pink-200",
      items: [
        { name: "Funding Alignment", active: true },
        { name: "NSF Priorities", active: true },
        { name: "NIH Relevance", active: true },
        { name: "Industry Interest", active: true },
        { name: "Budget Estimation", active: true },
        { name: "Success Probability", active: false },
      ],
      description: "Evaluate funding opportunities and grant success potential for your research.",
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      title: "Research Gaps",
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-800",
      textColor: "text-purple-800",
      borderColor: "border-purple-200",
      items: [
        { name: "Literature Review", active: true },
        { name: "Knowledge Gaps", active: true },
        { name: "Methodology Needs", active: true },
        { name: "Data Requirements", active: true },
        { name: "Validation Studies", active: true },
        { name: "Future Directions", active: false },
      ],
      description: "Identify critical research gaps and opportunities for meaningful contribution.",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      title: "Trends",
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-600",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      items: [
        { name: "Market Trends", active: true },
        { name: "Publication Growth", active: true },
        { name: "Citation Patterns", active: true },
        { name: "Industry Adoption", active: true },
        { name: "Technology Maturity", active: true },
        { name: "Future Outlook", active: false },
      ],
      description: "Analyze current trends and future trajectory of your research field.",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: "Methodology",
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-600",
      textColor: "text-orange-800",
      borderColor: "border-orange-200",
      items: [
        { name: "Complexity Score", active: true },
        { name: "Technical Feasibility", active: true },
        { name: "Resource Requirements", active: true },
        { name: "Timeline Estimation", active: true },
        { name: "Risk Assessment", active: true },
        { name: "Success Metrics", active: false },
      ],
      description: "Evaluate the methodological complexity and feasibility of your research approach.",
      icon: <Workflow className="w-4 h-4" />
    },
    {
      title: "Impact",
      bgColor: "bg-teal-50",
      iconColor: "bg-teal-600",
      textColor: "text-teal-800",
      borderColor: "border-teal-200",
      items: [
        { name: "Scientific Impact", active: true },
        { name: "Social Relevance", active: true },
        { name: "Economic Value", active: true },
        { name: "Policy Implications", active: true },
        { name: "Commercial Potential", active: true },
        { name: "Long-term Benefits", active: false },
      ],
      description: "Assess the potential impact and significance of your research outcomes.",
      icon: <Target className="w-4 h-4" />
    }
  ];


  return (
    <div className="bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
            Six Key Metrics.
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"> Complete Analysis.</h2>
          <p className="text-gray-900 text-lg sm:text-xl md:text-2xl">
            Evaluate your research topic across all critical dimensions 
          </p>
          <p className="text-gray-900 text-lg sm:text-xl md:text-2xl">to maximize your chances of success and funding.</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 py-5">
          {features.map((feature) => (
            <MetricCard
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
