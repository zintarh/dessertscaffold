'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Calendar, Download, FileText, Settings } from 'lucide-react';
import { Timeline, TimelineSection } from '@/types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GradientButton from '../ui/GradientButton';
import { exportGanttChart, ExportOptions, generateGanttData } from '@/lib/utils/ganttExport';

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

interface GanttChartProps {
  timeline: Timeline;
  onExport?: (format: 'png' | 'pdf') => void;
}

export default function GanttChart({ timeline, onExport }: GanttChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'pdf'>('png');
  const [showExportOptions, setShowExportOptions] = useState(false);

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
        width: section.duration * 100, // 100px per week
      };
    });
  }, [timeline.sections]);

  const totalWeeks = useMemo(() => {
    return timeline.sections.reduce((total, section) => total + section.duration, 0);
  }, [timeline.sections]);

  const getStatusColor = (status: "not-started" | "in-progress" | "completed") => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'not-started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusBorderColor = (status: TimelineSection['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-600';
      case 'in-progress':
        return 'border-blue-600';
      case 'not-started':
        return 'border-gray-400';
      default:
        return 'border-gray-400';
    }
  };

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      const ganttData = generateGanttData(timeline);
      const options: ExportOptions = {
        format: exportFormat,
        filename: `${timeline.documentType.toLowerCase().replace(' ', '-')}-gantt-${Date.now()}.${exportFormat}`,
        quality: 2,
      };

      await exportGanttChart(chartRef.current, ganttData, options);
      
      if (onExport) {
        onExport(exportFormat);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setShowExportOptions(false);
    }
  };

  const getExportIcon = (format: 'png' | 'pdf') => {
    return format === 'png' ? <FileText className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6" ref={chartRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gantt Chart</h3>
          <p className="text-sm text-gray-600">
            {timeline.documentType} Timeline • {totalWeeks} weeks total
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Export Options Toggle */}
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Export Options</span>
          </button>

          {/* Export Button */}
          <GradientButton
            onClick={handleExport}
            disabled={isExporting}
            variant="primary"
            size="md"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}</span>
          </GradientButton>
        </div>
      </div>

      {/* Export Options Panel */}
      {showExportOptions && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Export Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setExportFormat('png')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    exportFormat === 'png'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    exportFormat === 'pdf'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  PDF
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              >
                <option value="2">High (2x)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filename</label>
              <input
                type="text"
                value={`${timeline.documentType.toLowerCase().replace(' ', '-')}-gantt-${Date.now()}.${exportFormat}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-600">
            <p><strong>PNG:</strong> High-quality image export, perfect for presentations and sharing</p>
            <p><strong>PDF:</strong> Professional document format, ideal for printing and archiving</p>
          </div>
        </div>
      )}

      {/* Timeline Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-base font-medium text-gray-700">Timeline Overview</span>
        </div>
        <div className="text-base text-gray-600">
          {formatDate(timeline.startDate)} - {formatDate(timeline.completionDate)}
        </div>
      </div>

      {/* Chart Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Chart Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 font-medium text-gray-900 text-base">Section</div>
            <div className="col-span-8">
              <div className="flex justify-between text-sm text-gray-500">
                {Array.from({ length: totalWeeks }, (_, i) => (
                  <span key={i} className="w-12 text-center font-medium">W{i + 1}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Rows */}
        <div className="divide-y divide-gray-200">
          {chartData.map((section: any, index: number) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Section Info */}
                <div className="col-span-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(section.status)}`} />
                    <div>
                      <h4 className="font-medium text-gray-900 text-base">{section.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{section.duration} weeks</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="col-span-8">
                  <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                    {/* Week markers */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: totalWeeks }, (_, i) => (
                        <div
                          key={i}
                          className="border-r border-gray-200 last:border-r-0"
                          style={{ width: `${100 / totalWeeks}%` }}
                        />
                      ))}
                    </div>

                    {/* Section bar */}
                    <motion.div
                      className={`absolute top-2 bottom-2 rounded-md border-2 ${getStatusBorderColor(section.status)} ${getStatusColor(section.status)}`}
                      style={{
                        left: `${(section.startWeek / totalWeeks) * 100}%`,
                        width: `${(section.duration / totalWeeks) * 100}%`,
                        transformOrigin: 'left',
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                      <div className="flex items-center justify-center h-full px-3">
                        <span className="text-sm font-medium text-white text-center leading-tight">
                          {section.title}
                        </span>
                      </div>
                    </motion.div>

                    {/* Week labels on the bar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-600 font-medium bg-white px-2 py-1 rounded">
                        W{section.startWeek + 1} - W{section.endWeek}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Status Legend</h4>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-700">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-700">Not Started</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <p className="text-base font-medium text-blue-900 mb-2">Total Duration</p>
            <p className="text-3xl font-bold text-blue-900">{totalWeeks} weeks</p>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center">
            <p className="text-base font-medium text-green-900 mb-2">Sections</p>
            <p className="text-3xl font-bold text-green-900">{timeline.sections.length}</p>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="text-center">
            <p className="text-base font-medium text-purple-900 mb-2">Document Type</p>
            <p className="text-xl font-semibold text-purple-900">{timeline.documentType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
