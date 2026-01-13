import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

interface PredictionsAlertProps {
  predictedConsumption: number;
  averageConsumption: number;
  confidence: number;
}

export function PredictionsAlert({ 
  predictedConsumption, 
  averageConsumption,
  confidence 
}: PredictionsAlertProps) {
  const percentageChange = ((predictedConsumption - averageConsumption) / averageConsumption) * 100;
  const isIncrease = percentageChange > 5;
  const isSignificant = Math.abs(percentageChange) > 5;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Week Prediction</h3>

      <div
        className={`rounded-lg p-4 border-2 ${
          isIncrease
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isIncrease ? (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-medium mb-2 ${isIncrease ? "text-red-900" : "text-green-900"}`}>
              {isIncrease ? "High Consumption Alert" : "Staying on Track"}
            </h4>
            
            <p className={`text-sm mb-3 ${isIncrease ? "text-red-700" : "text-green-700"}`}>
              {isIncrease ? (
                <>
                  Your energy use next week is predicted to <strong>increase by {Math.abs(percentageChange).toFixed(1)}%</strong>.
                  You're likely to use <strong>{predictedConsumption.toFixed(1)} kWh</strong> compared to your average of {averageConsumption.toFixed(1)} kWh.
                </>
              ) : isSignificant ? (
                <>
                  Great news! Your energy use next week is predicted to <strong>decrease by {Math.abs(percentageChange).toFixed(1)}%</strong>.
                  Expected usage: <strong>{predictedConsumption.toFixed(1)} kWh</strong> vs. your average of {averageConsumption.toFixed(1)} kWh.
                </>
              ) : (
                <>
                  Your energy use next week is predicted to remain <strong>stable</strong> at around <strong>{predictedConsumption.toFixed(1)} kWh</strong>.
                </>
              )}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>ML Confidence: {(confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {isIncrease && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-900">
            <strong>💡 Tip:</strong> Check the recommendations panel for ways to reduce your consumption and avoid going over your usual usage.
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Predictions are based on historical usage patterns, weather forecasts, and typical weekly trends.
          Updated daily using machine learning algorithms.
        </p>
      </div>
    </div>
  );
}
