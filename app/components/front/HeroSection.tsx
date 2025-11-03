"use client";
import { ArrowRight, FileText, TrendingUp, UserCheck } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import EvaluationModal from "./EvaluationModal";
import { useTypewriter } from "@/hooks/useTypewriter";
import toast, { Toaster } from "react-hot-toast";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/authStore";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [user,] = useAtom(userAtom)
  
  const heroRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const placeholderTexts = [
    "Expert-guided applications in healthcare",
    "Sustainable energy storage solutions",
    "Expert-driven climate change mitigation",
    "Quantum computing for drug discovery",
    "Blockchain in supply chain management",
  ];

  const typewriterText = useTypewriter({
    texts: placeholderTexts,
    speed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
    loop: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputFocus = () => {
    setIsTyping(true);
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      // Small delay to prevent flickering
      timeoutRef.current = setTimeout(() => setIsTyping(false), 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      timeoutRef.current = setTimeout(() => setIsTyping(false), 100);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsTyping(true);
    }
  };

  const handleEvaluate = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a research topic");
      return;
    }

    setIsEvaluating(true);
    try {
      
      const response = await fetch("/api/evaluate-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          research_topic: inputValue.trim(),
          additional_keywords: [],
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEvaluationData(data.evaluation);
        setShowEvaluationModal(true);
        toast.success("Evaluation completed successfully!");
      } else {
        toast.error(data.error || "Failed to evaluate research topic");
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error("An error occurred during evaluation");
    } finally {
      setIsEvaluating(false);
    }
  };


useEffect(() => {
    console.log(user, "user in hero section");

}, [user]);
  return (
    <div className="flex py-8 sm:py-12 md:py-16 lg:py-20 mt-16 sm:mt-18 md:mt-20">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div
          ref={heroRef}
          className="bg-primary-bg flex flex-col items-center rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-sm border border-default p-4 sm:p-6 md:p-8 lg:p-12"
        >
          <div
            className={`mb-6 flex justify-center transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <span className="bg-accent-soft text-accent text-sm font-medium px-3 py-1 rounded-full">
              RESEARCH SUCCESS PLATFORM
            </span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold text-primary mb-4 sm:mb-6 leading-tight transition-all duration-800 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            From Research to
            <span className="text-purple-600"> $50M+ in Grants</span>
          </h1>

          <p
            className={`text-base sm:text-lg text-secondary text-center mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2 transition-all duration-800 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            Stop wasting time on unfundable research. Our platform analyzes your
            topic across six dimensions to identify funding opportunities and
            maximize your grant success.
          </p>

          <div
            className={`space-y-4 sm:space-y-6 mb-8 sm:mb-12 w-full transition-all duration-800 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="flex w-full border items-center px-4 sm:px-6 md:px-9 border-default h-[60px] sm:h-[70px] md:h-[80px] rounded-full space-x-2 sm:space-x-3 shadow-lg shadow-[color:var(--accent-soft)] ring-1 ring-[var(--accent-soft)] hover:shadow-xl hover:shadow-[color:var(--accent-soft)] hover:ring-2 hover:ring-[var(--accent)] transition-all duration-300 focus-within:shadow-xl focus-within:shadow-[color:var(--accent-soft)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <div className="w-full h-full flex items-center relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full h-full outline-none text-sm sm:text-base border-none transition-all duration-300 bg-transparent text-primary placeholder:text-tertiary"
                  placeholder={isTyping ? "Enter your research topic..." : ""}
                />
                <div
                  className={`absolute inset-0 flex items-center pointer-events-none px-2 transition-opacity duration-300 ${
                    !isTyping ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-sm sm:text-base text-primary">
                    {typewriterText}
                    <span
                      className="inline-block w-0.5 h-4 sm:h-5 ml-1 typewriter-cursor"
                      style={{ backgroundColor: "var(--text-primary)" }}
                    />
                  </span>
                </div>
              </div>

              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !inputValue.trim()}
                className="w-10 h-8 sm:w-12 sm:h-9 md:w-14 md:h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--primary-button)] hover:bg-[var(--primary-button-hover)] text-white"
              >
                {isEvaluating ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>

            <div
              className={`flex w-full transition-all duration-800 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="bg-surface border border-default rounded-2xl sm:rounded-3xl md:rounded-4xl px-3 sm:px-4 py-2 w-full">
                {/* <p className="text-primary text-sm sm:text-base md:text-lg pt-3 sm:pt-4 md:pt-5">
                  <strong>Grant Potential: High</strong> - This topic aligns
                  with current NSF funding priorities and has strong commercial
                  viability. Expected funding range: $200K-$500K over 2-3 years.
                </p> */}

                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 py-3 sm:py-4">
                  <button className="bg-accent-soft text-accent px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center space-x-1 sm:space-x-2 transition-colors">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Grant Opportunities</span>
                  </button>
                  <button className="bg-accent-soft text-accent px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center space-x-1 sm:space-x-2 transition-colors">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Research Trends</span>
                  </button>
                  <button className="bg-accent-soft text-accent px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center space-x-1 sm:space-x-2 transition-colors">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Methodology Score</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom left icon */}
      <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-surface-muted rounded-full flex items-center justify-center border border-default">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[var(--text-muted)] rounded-full"></div>
        </div>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
        researchTopic={inputValue || "your research topic"}
        evaluationData={evaluationData}
      />
    </div>
  );
}
