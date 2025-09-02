import { Timeline, TimelineSection } from '../stores/timelineStore';

// Types for export options
export interface ExportOptions {
  format: 'png' | 'pdf';
  filename?: string;
  quality?: number;
  width?: number;
  height?: number;
}

// Gantt chart data structure for export
export interface GanttExportData {
  timeline: Timeline;
  chartData: Array<{
    section: TimelineSection;
    startWeek: number;
    endWeek: number;
    width: number;
  }>;
  totalWeeks: number;
}

// Generate Gantt chart data for export
export const generateGanttData = (timeline: Timeline): GanttExportData => {
  let currentWeek = 0;
  const chartData = timeline.sections.map((section) => {
    const startWeek = currentWeek;
    const endWeek = currentWeek + section.duration;
    currentWeek = endWeek;
    
    return {
      section,
      startWeek,
      endWeek,
      width: section.duration * 100, // 100px per week
    };
  });

  const totalWeeks = timeline.sections.reduce((total, section) => total + section.duration, 0);

  return {
    timeline,
    chartData,
    totalWeeks,
  };
};

// Get status color for export
export const getStatusColor = (status: TimelineSection['status']): string => {
  switch (status) {
    case 'completed':
      return '#10B981'; // Green
    case 'in-progress':
      return '#3B82F6'; // Blue
    case 'not-started':
      return '#D1D5DB'; // Gray
    default:
      return '#D1D5DB';
  }
};

// Get status border color for export
export const getStatusBorderColor = (status: TimelineSection['status']): string => {
  switch (status) {
    case 'completed':
      return '#059669'; // Darker green
    case 'in-progress':
      return '#2563EB'; // Darker blue
    case 'not-started':
      return '#9CA3AF'; // Darker gray
    default:
      return '#9CA3AF';
  }
};

// Export Gantt chart as PNG using html2canvas
export const exportAsPNG = async (
  element: HTMLElement,
  options: ExportOptions = { format: 'png' }
): Promise<void> => {
  try {
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      scale: options.quality || 2,
      width: options.width,
      height: options.height,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = options.filename || `gantt-chart-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 0.9);
  } catch (error) {
    console.error('Error exporting as PNG:', error);
    throw new Error('Failed to export as PNG');
  }
};

// Export Gantt chart as PDF using jsPDF
export const exportAsPDF = async (
  ganttData: GanttExportData,
  options: ExportOptions = { format: 'pdf' }
): Promise<void> => {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    // Set title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${ganttData.timeline.documentType} Timeline`, margin, margin + 10);

    // Set subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${ganttData.timeline.academicLevel} • ${ganttData.timeline.discipline}`,
      margin,
      margin + 20
    );

    // Set date range
    const startDate = ganttData.timeline.startDate instanceof Date 
      ? ganttData.timeline.startDate.toLocaleDateString()
      : 'Invalid Date';
    const endDate = ganttData.timeline.completionDate instanceof Date
      ? ganttData.timeline.completionDate.toLocaleDateString()
      : 'Invalid Date';
    
    doc.text(`Timeline: ${startDate} - ${endDate}`, margin, margin + 30);
    doc.text(`Total Duration: ${ganttData.totalWeeks} weeks`, margin, margin + 40);

    // Draw timeline header
    const timelineY = margin + 60;
    const sectionWidth = contentWidth * 0.3;
    const chartWidth = contentWidth * 0.7;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, timelineY, contentWidth, 15, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Section', margin + 5, timelineY + 10);
    doc.text('Timeline', margin + sectionWidth + 5, timelineY + 10);

    // Draw week markers
    const weekMarkerWidth = chartWidth / ganttData.totalWeeks;
    for (let i = 0; i <= ganttData.totalWeeks; i++) {
      const x = margin + sectionWidth + (i * weekMarkerWidth);
      doc.setDrawColor(200, 200, 200);
      doc.line(x, timelineY, x, timelineY + 15);
      
      if (i < ganttData.totalWeeks) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`W${i + 1}`, x + 2, timelineY + 12);
      }
    }

    // Draw sections
    let currentY = timelineY + 20;
    const rowHeight = 12;
    
    ganttData.chartData.forEach((item, index) => {
      if (currentY + rowHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 20;
      }

      // Section name
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(item.section.title, margin + 5, currentY + 8);

      // Duration
      doc.text(`${item.section.duration}w`, margin + sectionWidth - 20, currentY + 8);

      // Timeline bar
      const barX = margin + sectionWidth + (item.startWeek * weekMarkerWidth);
      const barWidth = item.section.duration * weekMarkerWidth;
      
      doc.setFillColor(getStatusColor(item.section.status));
      doc.setDrawColor(getStatusBorderColor(item.section.status));
      doc.rect(barX, currentY + 2, barWidth, 8, 'FD');

      // Status indicator
      const statusX = margin + sectionWidth + 5;
      doc.setFillColor(getStatusColor(item.section.status));
      doc.circle(statusX, currentY + 6, 2, 'F');

      currentY += rowHeight + 5;
    });

    // Add legend
    const legendY = currentY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Status Legend', margin, legendY);

    const legendItems = [
      { status: 'completed', label: 'Completed', color: '#10B981' },
      { status: 'in-progress', label: 'In Progress', color: '#3B82F6' },
      { status: 'not-started', label: 'Not Started', color: '#D1D5DB' },
    ];

    legendItems.forEach((item, index) => {
      const x = margin + (index * 60);
      const y = legendY + 15;
      
      doc.setFillColor(item.color);
      doc.circle(x, y, 3, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, x + 8, y + 2);
    });

    // Save the PDF
    const filename = options.filename || `gantt-chart-${Date.now()}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    throw new Error('Failed to export as PDF');
  }
};

// Main export function
export const exportGanttChart = async (
  element: HTMLElement | null,
  ganttData: GanttExportData,
  options: ExportOptions
): Promise<void> => {
  try {
    if (options.format === 'png') {
      if (!element) {
        throw new Error('Element is required for PNG export');
      }
      await exportAsPNG(element, options);
    } else if (options.format === 'pdf') {
      await exportAsPDF(ganttData, options);
    } else {
      throw new Error(`Unsupported export format: ${options.format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

