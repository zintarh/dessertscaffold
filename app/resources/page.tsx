"use client";
import AnimatedSection from "../components/front/AnimatedSection";
import Footer from "../components/front/Footer";
import Navbar from "../components/front/Navbar";
import PageAnimation from "../components/PageAnimation";
import { 
  Search, 
  ChevronDown,
  FileText,
  ExternalLink,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<string[]>([]);
  const [selectedTrainingLevel, setSelectedTrainingLevel] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [showContentType, setShowContentType] = useState(false);
  const [showTrainingLevel, setShowTrainingLevel] = useState(false);
  const [showDuration, setShowDuration] = useState(false);

  const contentTypes = [
    { name: 'Guide', count: 4 },
    { name: 'Webinar', count: 8 },
    { name: 'Tutorial', count: 12 },
    { name: 'Template', count: 6 },
    { name: 'Checklist', count: 3 }
  ];

  const trainingLevels = [
    { name: 'Fundamentals', count: 15 },
    { name: 'Advanced', count: 8 },
    { name: 'Expert', count: 5 }
  ];

  const durations = [
    { name: 'Under 30 min', count: 12 },
    { name: '30-60 min', count: 8 },
    { name: '1-2 hours', count: 5 },
    { name: '2+ hours', count: 3 }
  ];

  const resources = [
    {
      id: 1,
      title: "Getting Started with Research Evaluation Guide",
      type: "Guide",
      level: "Fundamentals",
      duration: "30-60 min",
      description: "Complete guide to understanding research topic evaluation and grant potential analysis.",
      icon: "PDF"
    },
    {
      id: 2,
      title: "Grant Writing Best Practices Guide",
      type: "Guide", 
      level: "Advanced",
      duration: "1-2 hours",
      description: "Expert strategies for writing compelling grant proposals that get funded.",
      icon: "PDF"
    },
    {
      id: 3,
      title: "Research Methodology Masterclass",
      type: "Webinar",
      level: "Expert",
      duration: "2+ hours",
      description: "Deep dive into advanced research methodologies and experimental design.",
      icon: "VIDEO"
    },
    {
      id: 4,
      title: "Funding Opportunities Database Tutorial",
      type: "Tutorial",
      level: "Fundamentals", 
      duration: "Under 30 min",
      description: "Learn how to navigate and use our comprehensive funding database effectively.",
      icon: "TUTORIAL"
    },
    {
      id: 5,
      title: "Research Proposal Template Pack",
      type: "Template",
      level: "Advanced",
      duration: "30-60 min",
      description: "Professional templates for NSF, NIH, and other major funding agencies.",
      icon: "TEMPLATE"
    },
    {
      id: 6,
      title: "Peer Review Process Checklist",
      type: "Checklist",
      level: "Fundamentals",
      duration: "Under 30 min", 
      description: "Step-by-step checklist to ensure your research meets publication standards.",
      icon: "CHECKLIST"
    }
  ];

  const toggleContentType = (type: string) => {
    setSelectedContentType(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleTrainingLevel = (level: string) => {
    setSelectedTrainingLevel(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleDuration = (duration: string) => {
    setSelectedDuration(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const clearAllFilters = () => {
    setSelectedContentType([]);
    setSelectedTrainingLevel([]);
    setSelectedDuration([]);
    setSearchQuery('');
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesContentType = selectedContentType.length === 0 || 
      selectedContentType.includes(resource.type);
    
    const matchesTrainingLevel = selectedTrainingLevel.length === 0 || 
      selectedTrainingLevel.includes(resource.level);
    
    const matchesDuration = selectedDuration.length === 0 || 
      selectedDuration.includes(resource.duration);
    
    return matchesSearch && matchesContentType && matchesTrainingLevel && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-primary-bg">
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
              <div className="mb-8">
                <p className="text-sm font-medium text-accent tracking-wide mb-2">
                  EXPLORE TRAINING LESSONS AND RESOURCES
                </p>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-primary mb-4 lg:mb-0">
                    Discover training lessons and related resources to <br />  accelerate your learning.
                  </h1>
                  <div className="text-sm text-secondary">
                    All resources ({filteredResources.length})
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Filter Section */}
            <AnimatedSection animationType="fadeInUp" delay={300} duration={800}>
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-secondary">Refine by:</span>
                  
                  {selectedContentType.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedContentType.map((type) => (
                        <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-soft text-accent text-sm font-medium rounded-full">
                          {type}
                          <button
                            onClick={() => toggleContentType(type)}
                            className="ml-1 hover:opacity-80 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {(selectedContentType.length > 0 || selectedTrainingLevel.length > 0 || selectedDuration.length > 0) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-accent hover:opacity-80 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-4">
                  {/* Content Type Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowContentType(!showContentType)}
                      className="flex items-center gap-2 px-4 py-2 border border-default rounded-lg bg-surface text-sm font-medium text-secondary hover:bg-surface-muted"
                    >
                      Content type
                      <ChevronDown className={`w-4 h-4 transition-transform ${showContentType ? 'rotate-180' : ''}`} />
                    </button>
                    {showContentType && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-default rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          {contentTypes.map((type) => (
                            <label key={type.name} className="flex items-center justify-between p-2 hover:bg-surface-muted rounded cursor-pointer">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedContentType.includes(type.name)}
                                  onChange={() => toggleContentType(type.name)}
                                  className="w-4 h-4 text-[var(--accent)] border-default rounded focus:ring-[var(--accent)] bg-transparent"
                                />
                                <span className="text-sm text-secondary">{type.name}</span>
                              </div>
                              <span className="text-xs text-tertiary">{type.count}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Training Level Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTrainingLevel(!showTrainingLevel)}
                      className="flex items-center gap-2 px-4 py-2 border border-default rounded-lg bg-surface text-sm font-medium text-secondary hover:bg-surface-muted"
                    >
                      Training level
                      <ChevronDown className={`w-4 h-4 transition-transform ${showTrainingLevel ? 'rotate-180' : ''}`} />
                    </button>
                    {showTrainingLevel && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-default rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          {trainingLevels.map((level) => (
                            <label key={level.name} className="flex items-center justify-between p-2 hover:bg-surface-muted rounded cursor-pointer">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedTrainingLevel.includes(level.name)}
                                  onChange={() => toggleTrainingLevel(level.name)}
                                  className="w-4 h-4 text-[var(--accent)] border-default rounded focus:ring-[var(--accent)] bg-transparent"
                                />
                                <span className="text-sm text-secondary">{level.name}</span>
                              </div>
                              <span className="text-xs text-tertiary">{level.count}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDuration(!showDuration)}
                      className="flex items-center gap-2 px-4 py-2 border border-default rounded-lg bg-surface text-sm font-medium text-secondary hover:bg-surface-muted"
                    >
                      Duration
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDuration ? 'rotate-180' : ''}`} />
                    </button>
                    {showDuration && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-default rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          {durations.map((duration) => (
                            <label key={duration.name} className="flex items-center justify-between p-2 hover:bg-surface-muted rounded cursor-pointer">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedDuration.includes(duration.name)}
                                  onChange={() => toggleDuration(duration.name)}
                                  className="w-4 h-4 text-[var(--accent)] border-default rounded focus:ring-[var(--accent)] bg-transparent"
                                />
                                <span className="text-sm text-secondary">{duration.name}</span>
                              </div>
                              <span className="text-xs text-tertiary">{duration.count}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Resources Grid */}
            <AnimatedSection animationType="fadeInUp" delay={400} duration={800}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <AnimatedSection 
                    key={resource.id} 
                    animationType="fadeInUp" 
                    delay={500 + (index * 100)} 
                    duration={600}
                  >
                    <div className="bg-surface border border-default rounded-lg p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      {/* Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-accent-soft rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-tertiary group-hover:text-accent transition-colors" />
                      </div>

                      {/* Type Badge */}
                      <div className="mb-3">
                        <span className="text-xs font-medium text-accent uppercase tracking-wide">
                          {resource.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                        {resource.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-tertiary mb-3">
                        <span>{resource.level}</span>
                        <span>•</span>
                        <span>{resource.duration}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-secondary line-clamp-3">
                        {resource.description}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* No Results */}
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-tertiary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">No resources found</h3>
                  <p className="text-secondary mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-accent hover:opacity-80 font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
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