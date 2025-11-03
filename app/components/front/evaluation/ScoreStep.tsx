"use client";
import { useState, useCallback } from "react";
import {
  Check,
  TrendingUp,
  Award,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface ScoreStepProps {
  evaluationData: {
    overall: number;
    metrics: Array<{
      name: string;
      score: number;
      description: string;
    }>;
  };
}

export default function ScoreStep({ evaluationData }: ScoreStepProps) {
  const [expandedMetrics, setExpandedMetrics] = useState<Set<number>>(
    new Set()
  );
  const toggleMetric = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setExpandedMetrics((prev) => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(index)) {
          console.log(`Closing metric ${index}`);
          newExpanded.delete(index);
        } else {
          newExpanded.clear();
          newExpanded.add(index);
        }
        console.log(`New expanded set:`, Array.from(newExpanded));
        return newExpanded;
      });
    },
    [expandedMetrics]
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent"; // use brand accent for top scores
    if (score >= 60) return "text-secondary"; // medium contrast
    return "text-tertiary"; // low contrast subtle
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return Award;
    if (score >= 60) return TrendingUp;
    return Target;
  };

  const getScoreGradient = (_score: number) => {
    // unify with accent for consistency
    return "from-[var(--accent)] to-[var(--accent)]";
  };

  const getScoreBgColor = (_score: number) => {
    return "bg-surface border-default";
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 120
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Overall Score */}
      <div className="text-center mb-8">
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {evaluationData.overall * 10}%
        </div>
        <div className="text-lg" style={{ color: "var(--text-secondary)" }}>
          Overall Score
        </div>
        <div className="w-32 h-2 bg-surface-muted rounded-full mx-auto mt-4">
          <div
            className={`h-2 bg-gradient-to-r ${getScoreGradient(
              evaluationData.overall
            )} rounded-full transition-all duration-1000`}
            style={{ width: `${evaluationData.overall * 10}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {evaluationData.metrics.map((metric, index) => {
          const isExpanded = expandedMetrics.has(index);
          const IconComponent = getScoreIcon(metric.score);

          return (
            <div
              key={`metric-${index}-${metric.name}`}
              className={`border rounded-lg hover:shadow-md transition-all duration-200 ${getScoreBgColor(
                metric.score
              )}`}
            >
              <button
                onClick={(e) => toggleMetric(index, e)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-surface-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${getScoreColor(
                      metric.score
                    )} bg-opacity-10`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${getScoreColor(metric.score)}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {metric.name}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {truncateDescription(metric.description)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      metric.score
                    )}`}
                  >
                    {metric.score * 10}%
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-tertiary" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-tertiary" />
                  )}
                </div>
              </button>

              <div className="px-4 pb-2">
                <div className="w-full bg-surface-muted rounded-full h-2">
                  <div
                    className={`h-2 bg-gradient-to-r ${getScoreGradient(
                      metric.score
                    )} rounded-full transition-all duration-1000`}
                    style={{ width: `${metric.score * 10}%` }}
                  ></div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-default">
                  <div className="pt-4">
                    <h5
                      className="font-medium mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Detailed Analysis
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <h6
                          className="font-medium text-sm mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Evaluation Summary
                        </h6>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {metric.description}
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg bg-surface-muted border border-default`}>
                        <div className="flex items-center space-x-2">
                          <Check
                            className={`w-4 h-4 ${getScoreColor(metric.score)}`}
                          />
                          <span
                            className={`text-sm font-medium ${getScoreColor(
                              metric.score
                            )}`}
                          >
                            {metric.score >= 8
                              ? "Excellent"
                              : metric.score >= 6
                              ? "Good"
                              : "Needs Improvement"}
                          </span>
                        </div>
                        <p className="text-xs text-secondary mt-1">
                          {metric.score >= 8
                            ? "This metric shows strong performance and aligns well with research objectives."
                            : metric.score >= 6
                            ? "This metric shows good potential with room for enhancement."
                            : "This metric requires attention and strategic improvement."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
