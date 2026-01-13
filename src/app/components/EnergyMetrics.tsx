import { Zap, Leaf, DollarSign, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

function MetricCard({ title, value, unit, icon, trend, trendUp }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp
                className={`w-4 h-4 ${trendUp ? "text-red-500 rotate-0" : "text-green-500 rotate-180"}`}
              />
              <span className={`text-sm ${trendUp ? "text-red-600" : "text-green-600"}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface EnergyMetricsProps {
  totalConsumption: number;
  totalCO2: number;
  totalCost: number;
  weeklyChange: number;
}

export function EnergyMetrics({ totalConsumption, totalCO2, totalCost, weeklyChange }: EnergyMetricsProps) {
  const isIncrease = weeklyChange > 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Energy Used"
        value={totalConsumption.toFixed(1)}
        unit="kWh"
        icon={<Zap className="w-6 h-6 text-blue-600" />}
        trend={`${Math.abs(weeklyChange).toFixed(1)}% vs last week`}
        trendUp={isIncrease}
      />
      <MetricCard
        title="Carbon Footprint"
        value={totalCO2.toFixed(1)}
        unit="kg CO₂"
        icon={<Leaf className="w-6 h-6 text-green-600" />}
        trend={`${Math.abs(weeklyChange).toFixed(1)}% vs last week`}
        trendUp={isIncrease}
      />
      <MetricCard
        title="Estimated Cost"
        value={`₱${totalCost.toFixed(0)}`}
        unit="this month"
        icon={<DollarSign className="w-6 h-6 text-purple-600" />}
      />
      <MetricCard
        title="Daily Average"
        value={(totalConsumption / 7).toFixed(1)}
        unit="kWh/day"
        icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
      />
    </div>
  );
}
