import { Leaf } from "lucide-react";

interface CarbonFootprintMeterProps {
  currentCO2: number;
  goalCO2: number;
}

export function CarbonFootprintMeter({ currentCO2, goalCO2 }: CarbonFootprintMeterProps) {
  const percentage = Math.min((currentCO2 / goalCO2) * 100, 100);
  const isOverGoal = currentCO2 > goalCO2;
  
  // Calculate equivalent trees needed to offset CO2
  // Average tree absorbs ~21 kg CO2 per year
  const treesNeeded = Math.ceil(currentCO2 / 21);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Carbon Footprint Meter</h3>
        <div className="bg-green-50 rounded-lg p-2">
          <Leaf className="w-5 h-5 text-green-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-gray-600">Current Emissions</span>
            <span className="text-2xl font-semibold text-gray-900">
              {currentCO2.toFixed(1)} <span className="text-sm text-gray-500">kg CO₂</span>
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverGoal 
                  ? "bg-gradient-to-r from-red-500 to-red-600" 
                  : "bg-gradient-to-r from-green-500 to-green-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">0 kg</span>
            <span className="text-xs text-gray-500">Goal: {goalCO2} kg</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Environmental Impact</p>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌳</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {treesNeeded} {treesNeeded === 1 ? "tree" : "trees"} needed
                </p>
                <p className="text-xs text-gray-600">
                  to offset your monthly emissions
                </p>
              </div>
            </div>
            
            {isOverGoal ? (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ You're {((currentCO2 / goalCO2 - 1) * 100).toFixed(0)}% over your carbon goal
              </p>
            ) : (
              <p className="text-xs text-green-600 mt-2">
                ✓ You're on track! {((1 - currentCO2 / goalCO2) * 100).toFixed(0)}% below your goal
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <strong>Did you know?</strong> Your current emissions equal driving a car for approximately {(currentCO2 / 0.404).toFixed(0)} km.
          </p>
        </div>
      </div>
    </div>
  );
}
