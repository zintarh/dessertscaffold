"use client";

import { Calendar, Target, Clock, FileText, TrendingUp } from "lucide-react";
import { Timeline, TimelineSection } from "../../../../types";

interface StatsTabProps {
  timeline: Timeline;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  formatDate: (dateValue: Date | string | null | undefined) => string;
  formatTimelineDuration: (sections: TimelineSection[]) => string;
}

export default function StatsTab({
  timeline,
  progress,
  formatDate,
  formatTimelineDuration,
}: StatsTabProps) {
  return (
    <div className="mb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Timeline Statistics
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm font-medium">
            View detailed analytics
          </span>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Key Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {progress.percentage}%
          </div>
          <div className="text-sm text-gray-600">
            Overall completion progress
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {progress.completed}
          </div>
          <div className="text-sm text-gray-600">Sections completed</div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progress Overview
        </h3>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Current Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {progress.percentage}%
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Timeline Details Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Timeline Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  icon: Calendar,
                  label: "Start Date",
                  value: formatDate(timeline.startDate),
                  status: "Active",
                },
                {
                  icon: Target,
                  label: "End Date",
                  value: formatDate(timeline.completionDate),
                  status: "Scheduled",
                },
                {
                  icon: Clock,
                  label: "Duration",
                  value: formatTimelineDuration(timeline.sections),
                  status: "Ongoing",
                },
                {
                  icon: FileText,
                  label: "Total Sections",
                  value: `${progress.total}`,
                  status: "Complete",
                },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <item.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{item.value}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
