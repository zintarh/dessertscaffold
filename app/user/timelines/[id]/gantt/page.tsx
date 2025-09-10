"use client";

import { useParams, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { timelinesAtom } from "../../../../../lib/stores/timelineStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Download } from "lucide-react";
import {
  exportGanttChart,
  generateGanttData,
  ExportOptions,
} from "../../../../../lib/utils/ganttExport";





export default function GanttChartPage() {
  const params = useParams();
  const router = useRouter();
  const timelineId = params.id as string;

  const timelines = useAtomValue(timelinesAtom);
  const timeline = timelines.find((t) => t.id === timelineId);
  const [isExporting, setIsExporting] = useState(false);

  if (!timeline) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Timeline Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The timeline you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/user/dashboard")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      const ganttData = generateGanttData(timeline);

      const options: ExportOptions = {
        format: "pdf",
        filename: `${timeline.documentType
          .toLowerCase()
          .replace(/\s+/g, "-")}-gantt-${Date.now()}.pdf`,
        quality: 2,
      };

      await exportGanttChart(null, ganttData, options);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push(`/user/timelines/${timelineId}`)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gantt Chart - {timeline.documentType}
                  </h1>
                  {timeline.researchTopic && (
                    <p className="text-lg font-medium text-blue-600 mb-1">
                      {timeline.researchTopic}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {timeline.academicLevel} • {timeline.discipline}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Research Timeline Gantt Chart
              </h2>
              <p className="text-gray-600">
                Visual representation of your research timeline and progress
              </p>
            </div>
          </div>

          {/* Gantt Chart Content */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-10">
            <div className="space-y-8">
              {/* Timeline Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Research Timeline
                </h3>
                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  {timeline.sections.reduce(
                    (total, section) => total + section.duration,
                    0
                  )}{" "}
                  weeks total
                </span>
              </div>

              {/* Timeline Rows */}
              <div className="space-y-10">
                {timeline.sections.map((section, index) => {
                  const previousSections = timeline.sections.slice(0, index);
                  const startWeek = previousSections.reduce(
                    (total, s) => total + s.duration,
                    0
                  );
                  const endWeek = startWeek + section.duration;

                  return (
                    <div
                      key={section.id}
                      className="flex items-start space-x-6"
                    >
                      {/* Section Title - Wider, allows text wrapping */}
                      <div className="w-48 text-sm font-medium text-gray-700 pr-4 flex-shrink-0">
                        <div className="leading-relaxed break-words">
                          {section.title}
                        </div>
                      </div>

                      {/* Gantt Bar Container - Better spacing */}
                      <div className="flex-1 relative px-4">
                        {/* Week labels above the bar */}
                        <div className="flex justify-between mb-3 text-xs text-gray-500">
                          <span>Week {startWeek + 1}</span>
                          <span>Week {endWeek}</span>
                        </div>

                        {/* Progress bar with better height and spacing */}
                        <div className="w-full bg-gray-200 rounded-full h-8 relative">
                          <div
                            className={`h-8 rounded-full transition-all duration-300 ${
                              section.status === "completed"
                                ? "bg-green-500"
                                : section.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                            style={{
                              width: `${
                                (section.duration /
                                  timeline.sections.reduce(
                                    (total, s) => total + s.duration,
                                    0
                                  )) *
                                100
                              }%`,
                              marginLeft: `${
                                (startWeek /
                                  timeline.sections.reduce(
                                    (total, s) => total + s.duration,
                                    0
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>

                        {/* Duration label below the bar */}
                        <div className="text-center mt-2 text-xs text-gray-600 font-medium">
                          {section.duration} weeks
                        </div>
                      </div>

                      {/* Status Badge - Better spacing */}
                      <div className="w-28 text-center flex-shrink-0">
                        <span
                          className={`px-3 py-2 rounded-full text-xs font-medium ${
                            section.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : section.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {section.status === "completed"
                            ? "Completed"
                            : section.status === "in-progress"
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Completed
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Not Started
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
