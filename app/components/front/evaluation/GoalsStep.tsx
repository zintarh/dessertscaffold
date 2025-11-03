"use client";
import { Check } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface GoalsStepProps {
  goals: Goal[];
  selectedGoal: string | null;
  onSelectGoal: (goalId: string) => void;
}

export default function GoalsStep({
  goals,
  selectedGoal,
  onSelectGoal,
}: GoalsStepProps) {
  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              onClick={() => onSelectGoal(goal.id)}
              className={`relative p-6 text-left border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? `border-default bg-accent-soft ring-2 ring-[var(--accent)]`
                  : "border-default hover:bg-surface-muted bg-surface"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`w-12 h-12 bg-accent-soft rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon className={`w-6 h-6 text-accent`} />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {goal.title}
                  </h3>
                </div>
                <p
                  className="text-sm text-secondary"
                >
                  {goal.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
