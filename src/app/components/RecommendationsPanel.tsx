import { Lightbulb, Clock, TrendingDown, Zap } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: {
    savings: number;
    co2Reduction: number;
  };
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200 text-red-700";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "low":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{rec.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="font-medium">₱{rec.impact.savings}/month</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded">
                    <Zap className="w-3 h-3 text-blue-600" />
                    <span className="font-medium">{rec.impact.co2Reduction} kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Recommendations are personalized based on your usage patterns and updated weekly
        </p>
      </div>
    </div>
  );
}
