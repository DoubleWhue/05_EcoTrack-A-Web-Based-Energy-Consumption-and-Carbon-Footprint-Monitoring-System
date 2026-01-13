import { Target, Award } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

interface GoalsTrackerProps {
  goals: Goal[];
}

export function GoalsTracker({ goals }: GoalsTrackerProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Sustainability Goals</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const isAchieved = progress >= 100;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                  {isAchieved && <Award className="w-4 h-4 text-yellow-500" />}
                </div>
                <span className="text-xs text-gray-500">Due: {goal.deadline}</span>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAchieved
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gradient-to-r from-purple-500 to-purple-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  {goal.current.toFixed(1)} / {goal.target.toFixed(1)} {goal.unit}
                </span>
                <span className={`text-xs font-medium ${isAchieved ? "text-green-600" : "text-purple-600"}`}>
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        + Add New Goal
      </button>
    </div>
  );
}
