"use client";

import { useParams, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { timelinesAtom } from "../../../../../lib/stores/timelineStore";
import { useState } from "react";
import { 
  ArrowLeft, 
  Download, 
  
} from "lucide-react";

// Utility function to safely parse dates from API
const parseDate = (dateValue: Date | string | null | undefined): Date | null => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

// Utility function to format dates safely
const formatDate = (dateValue: Date | string | null | undefined): string => {
  const date = parseDate(dateValue);
  if (!date) return 'Not set';
  return date.toLocaleDateString();
};

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

  const calculateProgress = () => {
    const totalSections = timeline.sections.length;
    const completedSections = timeline.sections.filter(
      (s) => s.status === "completed"
    ).length;
    const inProgressSections = timeline.sections.filter(
      (s) => s.status === "in-progress"
    ).length;

    return {
      completed: completedSections,
      inProgress: inProgressSections,
      notStarted: totalSections - completedSections - inProgressSections,
      percentage: Math.round((completedSections / totalSections) * 100),
    };
  };

  const progress = calculateProgress();

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Could not open print window");
      }

      // Create the HTML content for the PDF with a professional Gantt chart
      const totalWeeks = timeline.sections.reduce(
        (total, section) => total + section.duration,
        0
      );

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gantt Chart - ${timeline.documentType}</title>
          <style>
            * { box-sizing: border-box; }
            
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 30px;
              background: white;
              color: #1f2937;
              line-height: 1.6;
            }
            
            .page-header {
              text-align: center;
              margin-bottom: 40px;
              padding: 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            
            .page-header h1 {
              margin: 0 0 15px 0;
              font-size: 32px;
              font-weight: 700;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .page-header h2 {
              margin: 0;
              font-size: 22px;
              font-weight: 400;
              opacity: 0.95;
            }
            
            .project-info {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 40px;
            }
            
            .info-card {
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              border-left: 4px solid #3b82f6;
            }
            
            .info-card h3 {
              margin: 0 0 15px 0;
              color: #1f2937;
              font-size: 18px;
              font-weight: 600;
            }
            
            .info-card p {
              margin: 8px 0;
              color: #374151;
              font-size: 14px;
            }
            
            .progress-overview {
              background: white;
              padding: 25px;
              border-radius: 15px;
              border: 2px solid #e5e7eb;
              margin-bottom: 40px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            }
            
            .progress-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            
            .progress-title {
              font-size: 20px;
              font-weight: 600;
              color: #1f2937;
            }
            
            .progress-percentage {
              font-size: 24px;
              font-weight: 700;
              color: #059669;
              background: #d1fae5;
              padding: 8px 16px;
              border-radius: 20px;
            }
            
            .progress-bar-container {
              background: #f3f4f6;
              height: 30px;
              border-radius: 15px;
              overflow: hidden;
              margin: 15px 0;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #10b981, #059669);
              border-radius: 15px;
              transition: width 0.3s ease;
              position: relative;
            }
            
            .progress-fill::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
              animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            
            .progress-stats {
              display: flex;
              justify-content: space-around;
              text-align: center;
              margin-top: 20px;
            }
            
            .stat-item {
              flex: 1;
              padding: 15px;
            }
            
            .stat-number {
              font-size: 24px;
              font-weight: 700;
              color: #1f2937;
              display: block;
            }
            
            .stat-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-weight: 600;
            }
            
            .gantt-container {
              background: white;
              border-radius: 15px;
              border: 2px solid #e5e7eb;
              overflow: hidden;
              box-shadow: 0 8px 30px rgba(0,0,0,0.1);
              margin-bottom: 40px;
            }
            
            .gantt-header {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px 30px;
              border-bottom: 2px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .gantt-header h3 {
              margin: 0;
              font-size: 22px;
              font-weight: 600;
              color: #1f2937;
            }
            
            .gantt-header .total-duration {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 10px 20px;
              border-radius: 25px;
              font-size: 16px;
              font-weight: 600;
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            
            .gantt-timeline {
              padding: 30px;
            }
            
            .time-scale {
              display: flex;
              margin-bottom: 25px;
              border-bottom: 3px solid #e5e7eb;
              padding-bottom: 15px;
              background: #f8fafc;
              border-radius: 8px;
              padding: 15px 20px;
            }
            
            .time-scale-label {
              width: 250px;
              font-weight: 600;
              color: #1f2937;
              font-size: 16px;
              padding-right: 30px;
            }
            
            .time-scale-grid {
              flex: 1;
              display: flex;
              position: relative;
              gap: 2px;
            }
            
            .time-scale-week {
              flex: 1;
              text-align: center;
              font-size: 12px;
              color: #4b5563;
              font-weight: 600;
              padding: 8px 4px;
              background: white;
              border-radius: 4px;
              min-width: 45px;
              border: 1px solid #e5e7eb;
            }
            
            .gantt-row {
              display: flex;
              align-items: center;
              margin: 0;
              padding: 20px 0;
              border-bottom: 1px solid #f3f4f6;
              min-height: 60px;
              transition: background-color 0.2s ease;
            }
            
            .gantt-row:hover {
              background: #f9fafb;
            }
            
            .gantt-row:last-child {
              border-bottom: none;
            }
            
            .section-title {
              width: 250px;
              font-weight: 600;
              color: #1f2937;
              padding-right: 30px;
              line-height: 1.4;
              flex-shrink: 0;
              font-size: 15px;
            }
            
            .gantt-timeline-container {
              flex: 1;
              position: relative;
              height: 40px;
              background: #f9fafb;
              border-radius: 8px;
              margin: 0 30px;
              border: 2px solid #e5e7eb;
              display: flex;
              align-items: center;
              overflow: hidden;
            }
            
            .gantt-bar {
              position: absolute;
              height: 30px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 700;
              font-size: 12px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.15);
              z-index: 2;
              border: 2px solid rgba(255,255,255,0.3);
              text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            
            .gantt-bar.completed {
              background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .gantt-bar.in-progress {
              background: linear-gradient(135deg, #3b82f6, #2563eb);
            }
            
            .gantt-bar.not-started {
              background: linear-gradient(135deg, #9ca3af, #6b7280);
            }
            
            .status-badge {
              width: 140px;
              text-align: center;
              padding: 8px 15px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              flex-shrink: 0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .status-badge.completed {
              background: linear-gradient(135deg, #d1fae5, #a7f3d0);
              color: #065f46;
              border: 2px solid #10b981;
            }
            
            .status-badge.in-progress {
              background: linear-gradient(135deg, #dbeafe, #93c5fd);
              color: #1e40af;
              border: 2px solid #3b82f6;
            }
            
            .status-badge.not-started {
              background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
              color: #374151;
              border: 2px solid #9ca3af;
            }
            
            .legend {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 40px 0;
              padding: 30px;
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              border-radius: 15px;
              border: 2px solid #e5e7eb;
            }
            
            .legend-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 15px 20px;
              background: white;
              border-radius: 12px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
              transition: transform 0.2s ease;
            }
            
            .legend-item:hover {
              transform: translateY(-2px);
            }
            
            .legend-color {
              width: 25px;
              height: 25px;
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            .legend-text {
              font-weight: 600;
              color: #374151;
              font-size: 14px;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
              border-top: 2px solid #e5e7eb;
            }
            
            .print-button {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 25px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 600;
              box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
              transition: all 0.3s ease;
              margin: 20px 0;
            }
            
            .print-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
              }
              .no-print { display: none; }
              .gantt-container { break-inside: avoid; }
              .gantt-row { break-inside: avoid; }
              .page-header { 
                background: #f8fafc !important;
                color: #1f2937 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="page-header">
            <h1>📊 Research Timeline Gantt Chart</h1>
            <h2>${timeline.documentType}</h2>
            ${
              timeline.researchTopic
                ? `<h2 style="margin-top: 10px; opacity: 0.9;">${timeline.researchTopic}</h2>`
                : ""
            }
          </div>
          
          <div class="project-info">
            <div class="info-card">
              <h3>📚 Academic Details</h3>
              <p><strong>Level:</strong> ${timeline.academicLevel}</p>
              <p><strong>Field:</strong> ${timeline.discipline}</p>
            </div>
            
            <div class="info-card">
              <h3>📅 Timeline Details</h3>
              <p><strong>Start:</strong> ${formatDate(timeline.startDate)}</p>
              <p><strong>End:</strong> ${formatDate(timeline.completionDate)}</p>
            </div>
            
            <div class="info-card">
              <h3>⏱️ Duration</h3>
              <p><strong>Total Weeks:</strong> ${totalWeeks}</p>
              <p><strong>Sections:</strong> ${timeline.sections.length}</p>
            </div>
          </div>
          
          <div class="progress-overview">
            <div class="progress-header">
              <div class="progress-title">Overall Project Progress</div>
              <div class="progress-percentage">${progress.percentage}%</div>
            </div>
            
            <div class="progress-bar-container">
              <div class="progress-fill" style="width: ${
                progress.percentage
              }%"></div>
            </div>
            
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-number">${progress.completed}</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${progress.inProgress}</span>
                <span class="stat-label">In Progress</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${progress.notStarted}</span>
                <span class="stat-label">Not Started</span>
              </div>
            </div>
          </div>
          
          <div class="gantt-container">
            <div class="gantt-header">
              <h3>🗓️ Research Timeline Gantt Chart</h3>
              <div class="total-duration">${totalWeeks} weeks total</div>
            </div>
            
            <div class="gantt-timeline">
              <!-- Time Scale Header -->
              <div class="time-scale">
                <div class="time-scale-label">Research Sections</div>
                <div class="time-scale-grid">
                  ${Array.from(
                    { length: totalWeeks },
                    (_, i) => `
                    <div class="time-scale-week">W${i + 1}</div>
                  `
                  ).join("")}
                </div>
                <div style="width: 160px; text-align: center; font-weight: 600; color: #1f2937; font-size: 16px;">Status</div>
              </div>
              
              <!-- Gantt Chart Rows -->
              ${timeline.sections
                .map((section, index) => {
                  const previousSections = timeline.sections.slice(0, index);
                  const startWeek = previousSections.reduce(
                    (total, s) => total + s.duration,
                    0
                  );
                  const endWeek = startWeek + section.duration;
                  const statusClass =
                    section.status === "completed"
                      ? "completed"
                      : section.status === "in-progress"
                      ? "in-progress"
                      : "not-started";
                  const statusText =
                    section.status === "completed"
                      ? "Completed"
                      : section.status === "in-progress"
                      ? "In Progress"
                      : "Not Started";

                  // Calculate bar position and width based on week grid
                  const barLeft = (startWeek / totalWeeks) * 100;
                  const barWidth = (section.duration / totalWeeks) * 100;

                  return `
                  <div class="gantt-row">
                    <div class="section-title">${section.title}</div>
                    
                    <div class="gantt-timeline-container">
                      <div 
                        class="gantt-bar ${statusClass}"
                        style="left: ${barLeft}%; width: ${barWidth}%;"
                        title="${section.title}: Week ${
                    startWeek + 1
                  } - Week ${endWeek}"
                      >
                        ${section.duration}w
                      </div>
                    </div>
                    
                    <div class="status-badge ${statusClass}">${statusText}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
          
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #10b981, #059669);"></div>
              <span class="legend-text">✅ Completed Sections</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #3b82f6, #2563eb);"></div>
              <span class="legend-text">🔄 In Progress Sections</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #9ca3af, #6b7280);"></div>
              <span class="legend-text">⏳ Not Started Sections</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #f3f4f6; border: 2px solid #d1d5db;"></div>
              <span class="legend-text">📊 Timeline Grid</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <p>Dissertation Scaffold - Research Timeline Management</p>
          </div>
          
          <div class="no-print" style="text-align: center;">
            <button class="print-button" onclick="window.print()">
              🖨️ Print / Save as PDF
            </button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
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
