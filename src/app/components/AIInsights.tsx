import { Sparkles, AlertCircle, TrendingUp } from "lucide-react";

interface AIInsightsProps {
  insights: string[];
  anomaly: {
    hasAnomaly: boolean;
    message: string;
    date?: string;
  };
}

export function AIInsights({ insights, anomaly }: AIInsightsProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 shadow-sm border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 rounded-lg p-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <p className="text-xs text-gray-600">Powered by machine learning algorithms</p>
        </div>
      </div>

      {/* Anomaly Alert */}
      {anomaly.hasAnomaly && (
        <div className="mb-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Anomaly Detected</p>
            <p className="text-xs text-yellow-700 mt-1">{anomaly.message}</p>
          </div>
        </div>
      )}

      {/* Insights List */}
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 flex items-start gap-3 border border-purple-100"
            >
              <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>Add more usage data to receive AI-powered insights</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-500">
          AI analyzes your consumption patterns, detects anomalies, and identifies optimization opportunities in real-time.
        </p>
      </div>
    </div>
  );
}
