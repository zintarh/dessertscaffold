import { Timeline, TimelineSection } from '@/types';

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
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    // Add header background
    doc.setFillColor(59, 130, 246); // Blue gradient start
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Add title with white text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Research Timeline Gantt Chart', margin, 20);

    // Add subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`${ganttData.timeline.documentType}`, margin, 30);

    // Add research topic if available
    if (ganttData.timeline.researchTopic) {
      doc.setFontSize(12);
      doc.text(`${ganttData.timeline.researchTopic}`, margin, 38);
    }

    // Reset text color to black
    doc.setTextColor(0, 0, 0);

    // Project information cards
    const cardY = 55;
    const cardHeight = 25;
    const cardWidth = (contentWidth - 20) / 3;

    // Academic Details Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(margin, cardY, cardWidth, cardHeight, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('📚 Academic Details', margin + 3, cardY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Level: ${ganttData.timeline.academicLevel}`, margin + 3, cardY + 14);
    doc.text(`Field: ${ganttData.timeline.discipline}`, margin + 3, cardY + 19);

    // Timeline Details Card
    const card2X = margin + cardWidth + 10;
    doc.setFillColor(248, 250, 252);
    doc.rect(card2X, cardY, cardWidth, cardHeight, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('📅 Timeline Details', card2X + 3, cardY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const startDate = ganttData.timeline.startDate instanceof Date 
      ? ganttData.timeline.startDate.toLocaleDateString()
      : 'Not set';
    const endDate = ganttData.timeline.completionDate instanceof Date
      ? ganttData.timeline.completionDate.toLocaleDateString()
      : 'Not set';
    
    doc.text(`Start: ${startDate}`, card2X + 3, cardY + 14);
    doc.text(`End: ${endDate}`, card2X + 3, cardY + 19);

    // Duration Card
    const card3X = margin + (cardWidth * 2) + 20;
    doc.setFillColor(248, 250, 252);
    doc.rect(card3X, cardY, cardWidth, cardHeight, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('⏱️ Duration', card3X + 3, cardY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Total: ${ganttData.totalWeeks} weeks`, card3X + 3, cardY + 14);
    doc.text(`Sections: ${ganttData.timeline.sections.length}`, card3X + 3, cardY + 19);

    // Progress overview
    const progressY = cardY + cardHeight + 15;
    const completed = ganttData.timeline.sections.filter(s => s.status === 'completed').length;
    const inProgress = ganttData.timeline.sections.filter(s => s.status === 'in-progress').length;
    const notStarted = ganttData.timeline.sections.filter(s => s.status === 'not-started').length;
    const progressPercentage = Math.round((completed / ganttData.timeline.sections.length) * 100);

    // Progress header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, progressY, contentWidth, 20, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Project Progress', margin + 5, progressY + 8);
    doc.text(`${progressPercentage}%`, contentWidth + margin - 20, progressY + 8);

    // Progress bar
    const progressBarY = progressY + 25;
    const progressBarHeight = 8;
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, progressBarY, contentWidth, progressBarHeight, 'F');
    
    const progressWidth = (contentWidth * progressPercentage) / 100;
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, progressBarY, progressWidth, progressBarHeight, 'F');

    // Gantt chart section
    const ganttY = progressBarY + 25;
    const sectionWidth = contentWidth * 0.25;
    const chartWidth = contentWidth * 0.65;
    const statusWidth = contentWidth * 0.1;
    
    // Gantt header
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, ganttY, contentWidth, 15, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Research Sections', margin + 5, ganttY + 10);
    doc.text('Timeline (Weeks)', margin + sectionWidth + 10, ganttY + 10);
    doc.text('Status', margin + sectionWidth + chartWidth + 10, ganttY + 10);

    // Week markers
    const weekMarkerWidth = chartWidth / ganttData.totalWeeks;
    const weekMarkerY = ganttY + 15;
    
    for (let i = 0; i <= ganttData.totalWeeks; i += Math.max(1, Math.floor(ganttData.totalWeeks / 20))) {
      const x = margin + sectionWidth + (i * weekMarkerWidth);
      doc.setDrawColor(200, 200, 200);
      doc.line(x, weekMarkerY, x, weekMarkerY + 5);
      
      if (i < ganttData.totalWeeks) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(`W${i + 1}`, x + 1, weekMarkerY + 12);
      }
    }

    // Draw sections
    let currentY = weekMarkerY + 20;
    const rowHeight = 15;
    
    ganttData.chartData.forEach((item, index) => {
      if (currentY + rowHeight > pageHeight - margin - 30) {
        doc.addPage();
        currentY = margin + 20;
      }

      // Alternating row background
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, currentY - 2, contentWidth, rowHeight, 'F');
      }

      // Section name with text wrapping
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const sectionText = item.section.title.length > 35 
        ? item.section.title.substring(0, 32) + '...' 
        : item.section.title;
      doc.text(sectionText, margin + 3, currentY + 8);

      // Duration badge
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.section.duration}w`, margin + sectionWidth - 15, currentY + 8);

      // Timeline bar with improved styling
      const barX = margin + sectionWidth + (item.startWeek * weekMarkerWidth);
      const barWidth = Math.max(item.section.duration * weekMarkerWidth, 3); // Minimum width
      const barY = currentY + 2;
      const barHeight = 10;
      
      // Get status colors
      const statusColor = getStatusColor(item.section.status);
      const borderColor = getStatusBorderColor(item.section.status);
      const statusRgb = hexToRgb(statusColor);
      const borderRgb = hexToRgb(borderColor);
      
      // Draw bar with gradient effect
      doc.setFillColor(statusRgb.r, statusRgb.g, statusRgb.b);
      doc.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
      doc.setLineWidth(0.5);
      doc.rect(barX, barY, barWidth, barHeight, 'FD');

      // Add duration text on bar if space allows
      if (barWidth > 15) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        const textX = barX + (barWidth / 2);
        doc.text(`${item.section.duration}w`, textX, barY + 7, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      }

      // Status badge
      const statusX = margin + sectionWidth + chartWidth + 5;
      const statusText = item.section.status === 'completed' ? 'Done' :
                        item.section.status === 'in-progress' ? 'Active' : 'Pending';
      
      doc.setFillColor(statusRgb.r, statusRgb.g, statusRgb.b);
      doc.rect(statusX, currentY + 2, statusWidth - 5, 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(statusText, statusX + (statusWidth - 5) / 2, currentY + 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);

      currentY += rowHeight + 2;
    });

    // Enhanced legend
    const legendY = currentY + 15;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, legendY, contentWidth, 25, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Status Legend', margin + 5, legendY + 10);

    const legendItems = [
      { status: 'completed', label: '✅ Completed', color: '#10B981' },
      { status: 'in-progress', label: '🔄 In Progress', color: '#3B82F6' },
      { status: 'not-started', label: '⏳ Not Started', color: '#D1D5DB' },
    ];

    legendItems.forEach((item, index) => {
      const x = margin + 80 + (index * 70);
      const y = legendY + 15;
      
      const rgb = hexToRgb(item.color);
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(x, y - 3, 12, 6, 'F');
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, x + 15, y + 1);
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY);
    doc.text('Dissertation Scaffold - Research Timeline Management', pageWidth - margin, footerY, { align: 'right' });

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

