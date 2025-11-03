"use client";

import React, { useState, useRef, useMemo } from "react";
import { Calendar, Download } from "lucide-react";
import { Timeline, TimelineSection } from "@/types";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  exportGanttChart,
  ExportOptions,
  generateGanttData,
} from "@/lib/utils/ganttExport";
import Button from "@/app/(user)/components/ui/Button";

const parseDate = (
  dateValue: Date | string | null | undefined
): Date | null => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === "string") {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const formatDate = (dateValue: Date | string | null | undefined): string => {
  const date = parseDate(dateValue);
  if (!date) return "Not set";
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface GanttChartProps {
  timeline: Timeline;
  onExport?: (format: "png" | "pdf") => void;
}

export default function GanttChart({ timeline, onExport }: GanttChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "pdf">("png");

  const chartData = useMemo(() => {
    let currentWeek = 0;
    return timeline.sections.map((section) => {
      const startWeek = currentWeek;
      const endWeek = currentWeek + section.duration;
      currentWeek = endWeek;

      return {
        ...section,
        startWeek,
        endWeek,
        width: section.duration * 100,
      };
    });
  }, [timeline.sections]);

  const totalWeeks = useMemo(() => {
    return timeline.sections.reduce(
      (total, section) => total + section.duration,
      0
    );
  }, [timeline.sections]);

  const calculateSectionProgress = (section: TimelineSection): number => {
    if (section.isCompleted) return 100;

    if (section.status === "not-started") return 0;

    if (section.status === "in-progress") {
      if (section.content && section.content.length > 0) {
        const contentLength = section.content.length;
        const estimatedContentLength = 1000;
        const progress = Math.min(
          (contentLength / estimatedContentLength) * 100,
          90
        );
        return Math.round(progress);
      }
      return 5;
    }

    return 0;
  };

  const getStatusColor = (
    status: "not-started" | "in-progress" | "completed",
    progress?: number
  ) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "in-progress":
        if (progress !== undefined) {
          if (progress >= 80) return "bg-orange-500";
          if (progress >= 60) return "bg-orange-400";
          if (progress >= 40) return "bg-amber-400";
          if (progress >= 20) return "bg-yellow-400";
          return "bg-yellow-300";
        }
        return "bg-blue-500";
      case "not-started":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  const getStatusBorderColor = (
    status: TimelineSection["status"],
    progress?: number
  ) => {
    switch (status) {
      case "completed":
        return "border-green-700";
      case "in-progress":
        if (progress !== undefined) {
          if (progress >= 80) return "border-orange-600";
          if (progress >= 60) return "border-orange-500";
          if (progress >= 40) return "border-amber-500";
          if (progress >= 20) return "border-yellow-500";
          return "border-yellow-400";
        }
        return "border-blue-600";
      case "not-started":
        return "border-gray-300";
      default:
        return "border-gray-300";
    }
  };

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      const ganttData = generateGanttData(timeline);
      const options: ExportOptions = {
        format: exportFormat,
        filename: `${timeline.documentType
          .toLowerCase()
          .replace(" ", "-")}-gantt-${Date.now()}.${exportFormat}`,
        quality: 2,
      };

      await exportGanttChart(chartRef.current, ganttData, options);

      if (onExport) {
        onExport(exportFormat);
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6"
      ref={chartRef}
    >
      <div className="flex items-center justify-between mb-6">
       
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="primary"
            size="md"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting
                ? "Exporting..."
                : `Export ${exportFormat.toUpperCase()}`}
            </span>
          </Button>
        </div>
      </div>


      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-base font-medium text-gray-700">
            Timeline Overview
          </span>
        </div>
        <div className="text-base text-gray-600">
          {formatDate(timeline.startDate)} -{" "}
          {formatDate(timeline.completionDate)}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 font-medium text-gray-900 text-base">
              Section
            </div>
            <div className="col-span-8">
              <div className="flex justify-between text-sm text-gray-500">
                {Array.from({ length: totalWeeks }, (_, i) => (
                  <span key={i} className="w-12 text-center font-medium">
                    W{i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {chartData.map((section: any, index: number) => {
            const progress = calculateSectionProgress(section);
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-4 h-4 rounded-full ${getStatusColor(
                          section.status,
                          progress
                        )}`}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 text-base">
                          {section.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {section.duration} weeks
                          {section.status === "in-progress" && (
                            <span className="ml-2 text-orange-600 font-medium">
                              • {progress}% complete
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-8 ">
                    <div className="relative h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: totalWeeks }, (_, i) => (
                          <div
                            key={i}
                            className="border-r border-gray-200 last:border-r-0"
                            style={{ width: `${100 / totalWeeks}%` }}
                          />
                        ))}
                      </div>

                      <motion.div
                        className={`absolute top-3 bottom-3 rounded-lg border-2 ${getStatusBorderColor(
                          section.status,
                          progress
                        )} bg-gray-100`}
                        style={{
                          left: `${(section.startWeek / totalWeeks) * 100}%`,
                          width: `${(section.duration / totalWeeks) * 100}%`,
                          transformOrigin: "left",
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                      >
                        <motion.div
                          className={`h-full rounded-lg ${getStatusColor(
                            section.status,
                            progress
                          )}`}
                          style={{
                            width: `${progress}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{
                            delay: index * 0.1 + 0.8,
                            duration: 0.8,
                          }}
                        />

                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                          <span
                            className={`inline-flex flex-none w-auto whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded ${
                              section.isCompleted
                                ? "bg-green-700 text-white"
                                : section.status === "in-progress"
                                ? "bg-white text-gray-800 border border-gray-300"
                                : "bg-gray-200 text-gray-600"
                            }`}
                            style={{ width: 'max-content' }}
                          >
                            {section.isCompleted ? "100%" : `${progress}%`}
                          </span>
                        </div>

                        <div className="absolute right-1 top-full mt-1">
                          <span className="text-xs text-gray-500 font-medium">
                            W{section.startWeek + 1}-{section.endWeek}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
