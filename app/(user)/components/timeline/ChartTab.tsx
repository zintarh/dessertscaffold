"use client";

import { Timeline } from "../../../../types";
import GanttChart from "../../../components/dashboard/GanttChart";

interface ChartTabProps {
  timeline: Timeline;
}

export default function ChartTab({ timeline }: ChartTabProps) {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Timeline Gantt Chart
          </h3>
          <p className="text-sm text-gray-600">
            Visual representation of your timeline sections and progress
          </p>
        </div>
        
        <GanttChart timeline={timeline} />
      </div>
    </div>
  );
}
