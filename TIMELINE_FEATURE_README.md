# Research Timeline Creation Feature

## Overview

The Research Timeline Creation feature allows students to plan and track their research projects with a structured, step-by-step approach. This feature replaces the "Continue to Writing" button on the evaluation page with a "Create Timeline" button that guides students through creating comprehensive research timelines.

## Features

### 1. Three-Step Timeline Creation Process

#### Step 1: Select Document Type
- **Research Proposal**: Structured document outlining research plan, methodology, and expected outcomes
- **Dissertation**: Comprehensive research document presenting original findings and analysis

#### Step 2: Configure Timeline
- Set Start Date and Completion Date
- Choose Academic Level (Master's, PhD, or Scholarly)
- Select Discipline (Science, Humanities, Social Sciences, Engineering, or Business)

#### Step 3: Research Structure Configuration
- Configure duration for each research section (in weeks)
- View detailed descriptions, "What to Include" lists, and "Pro Tips" for each section
- Automatic calculation of total timeline duration

### 2. Research Sections

#### Research Proposal Sections
1. **Executive Summary** - Concise overview highlighting key points
2. **Introduction/Background/Rationale** - Context and justification
3. **Problem Statement** - Research problem definition and scope
4. **Literature Review** - Existing research and theoretical frameworks
5. **Methodology** - Research design, methods, and procedures
6. **Research Ethics** - Ethical considerations and compliance
7. **Scheduling** - Timeline and milestones
8. **Conclusion** - Key points and research significance
9. **References** - Comprehensive source list

#### Dissertation Sections
1. **Abstract** - Comprehensive summary
2. **Introduction** - Research context and objectives
3. **Literature Review** - Extensive research review
4. **Methodology** - Detailed research methods
5. **Results** - Findings and data analysis
6. **Discussion** - Interpretation and implications
7. **Conclusion** - Key findings and contributions
8. **References** - Bibliography
9. **Appendices** - Supplementary materials

### 3. Timeline Tracking

#### Progress Indicators
- **Blue**: In Progress
- **Green**: Completed
- **Grey**: Not Started

#### Dashboard Integration
- Upcoming deadlines display
- Current section in progress
- Quick actions (Continue Writing, View Tags, Get Help)
- Progress visualization with color-coded status

### 4. Gantt Chart Visualization

- Visual timeline representation
- Section duration mapping
- Status-based color coding
- Export options (PNG, PDF)
- Week-by-week breakdown

## User Flow

### 1. Topic Evaluation
1. Student enters research topic
2. System provides evaluation with score and feedback
3. "Continue to Writing" button is replaced with "Create Timeline"

### 2. Timeline Creation
1. **Document Type Selection**: Choose between Research Proposal or Dissertation
2. **Timeline Configuration**: Set dates, academic level, and discipline
3. **Structure Setup**: Configure duration for each research section
4. **Timeline Generation**: Create and save the timeline

### 3. Timeline Management
1. **Dashboard View**: See active timelines and progress
2. **Progress Tracking**: Update section statuses
3. **Gantt Chart**: Visual timeline representation
4. **Export Options**: Download timeline as PNG or PDF

## Technical Implementation

### State Management
- **Jotai**: Used for state management with localStorage persistence
- **Timeline Store**: Centralized timeline data management
- **Serialization**: Proper date handling for localStorage storage

### Components
- **TimelineCreationModal**: Three-step creation wizard
- **TimelineTracker**: Progress tracking and status management
- **GanttChart**: Visual timeline representation
- **TimelineTracker**: Section-by-section progress display

### Data Structure
```typescript
interface Timeline {
  id: string;
  documentType: 'Research Proposal' | 'Dissertation';
  startDate: Date;
  completionDate: Date;
  academicLevel: 'Master\'s' | 'PhD' | 'Scholarly';
  discipline: 'Science' | 'Humanities' | 'Social Sciences' | 'Engineering' | 'Business';
  sections: TimelineSection[];
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineSection {
  id: string;
  title: string;
  description: string;
  whatToInclude: string[];
  proTips: string[];
  duration: number; // in weeks
  status: 'not-started' | 'in-progress' | 'completed';
}
```

## Navigation

### New Routes
- `/student/timelines` - Dedicated timelines page
- Timeline creation modal accessible from evaluation page

### Sidebar Integration
- Added "Timelines" navigation item
- Calendar icon for easy identification
- Positioned after "My Research" for logical flow

## Benefits

1. **Structured Planning**: Students follow a systematic approach to research planning
2. **Progress Tracking**: Visual feedback on research progress
3. **Time Management**: Realistic timeline estimation and tracking
4. **Academic Guidance**: Built-in best practices and pro tips
5. **Flexibility**: Support for different document types and academic levels
6. **Export Options**: Professional timeline documentation

## Future Enhancements

1. **Collaboration**: Share timelines with mentors and peers
2. **Notifications**: Deadline reminders and progress alerts
3. **Templates**: Pre-built timeline templates for common research types
4. **Integration**: Connect with writing tools and project management
5. **Analytics**: Research productivity insights and time tracking
6. **Mobile Support**: Responsive design for mobile devices

## Usage Instructions

### Creating a Timeline
1. Go to the evaluation page (`/student/evaluate`)
2. Enter and evaluate your research topic
3. Click "Create Timeline" button
4. Follow the three-step creation process
5. Configure section durations
6. Save your timeline

### Managing Timelines
1. Access timelines from the sidebar navigation
2. View progress and update section statuses
3. Switch between list and Gantt chart views
4. Export timelines for documentation
5. Track deadlines and upcoming tasks

### Dashboard Integration
1. View active timelines on the main dashboard
2. Quick access to timeline management
3. Progress overview and status updates
4. Direct navigation to timeline creation

This feature provides students with a comprehensive tool for planning, tracking, and managing their research projects, ensuring they stay organized and on track throughout their academic journey.
