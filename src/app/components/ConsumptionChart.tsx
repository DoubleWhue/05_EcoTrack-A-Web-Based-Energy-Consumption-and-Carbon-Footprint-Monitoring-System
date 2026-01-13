import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DailyData {
  date: string;
  consumption: number;
  predicted?: number;
}

interface ConsumptionChartProps {
  data: DailyData[];
  showPredictions?: boolean;
}

export function ConsumptionChart({ data, showPredictions = false }: ConsumptionChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Consumption Trend</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="consumption"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorConsumption)"
            name="Actual Usage (kWh)"
          />
          {showPredictions && (
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorPredicted)"
              strokeDasharray="5 5"
              name="Predicted Usage (kWh)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
