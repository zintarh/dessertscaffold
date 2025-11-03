"use client";
import { BookOpen, Calendar } from "lucide-react";

interface TimelineSetupStepProps {
  researchTopic: string;
  projectType: "dissertation" | "research-proposal";
  researchStartDate: string;
  setResearchStartDate: (date: string) => void;
  researchCompletionDate: string;
  setResearchCompletionDate: (date: string) => void;
  academicLevel: string;
  setAcademicLevel: (level: string) => void;
  discipline: string;
  setDiscipline: (discipline: string) => void;
  academicLevels: string[];
  disciplines: string[];
}

export default function TimelineSetupStep({
  researchTopic,
  researchStartDate,
  setResearchStartDate,
  researchCompletionDate,
  setResearchCompletionDate,
  academicLevel,
  setAcademicLevel,
  discipline,
  setDiscipline,
  academicLevels,
  disciplines,
}: TimelineSetupStepProps) {
  return (
    <div className="flex-1 space-y-6">
    <div className="space-y-6">
      <div className="text-center">
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Research Timeline Setup
        </h3>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Configure your research parameters for "{researchTopic}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-muted rounded-lg">
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Research Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              type="date"
              value={researchStartDate}
              onChange={(e) => setResearchStartDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-transparent text-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Expected Completion Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              type="date"
              value={researchCompletionDate}
              onChange={(e) =>
                setResearchCompletionDate(e.target.value)
              }
              className="w-full pl-10 pr-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-transparent text-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Academic Level
          </label>
          <select
            value={academicLevel}
            onChange={(e) => setAcademicLevel(e.target.value)}
            className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-surface text-primary"
          >
            <option value="">Select academic level</option>
            {academicLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Discipline
          </label>
          <select
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-surface text-primary"
          >
            <option value="">Select discipline</option>
            {disciplines.map((disc) => (
              <option key={disc} value={disc}>
                {disc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
  );
}
