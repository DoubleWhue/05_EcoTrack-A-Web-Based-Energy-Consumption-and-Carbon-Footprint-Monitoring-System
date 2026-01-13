import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export interface ApplianceUsage {
  id: string;
  appliance: string;
  watts: number;
  hoursPerDay: number;
  date: string;
}

interface ApplianceInputProps {
  onAdd: (usage: Omit<ApplianceUsage, "id">) => void;
  recentEntries: ApplianceUsage[];
  onDelete: (id: string) => void;
}

const COMMON_APPLIANCES = [
  { name: "Air Conditioner", watts: 1500 },
  { name: "Refrigerator", watts: 150 },
  { name: "Washing Machine", watts: 500 },
  { name: "Television", watts: 100 },
  { name: "Computer/Laptop", watts: 200 },
  { name: "Electric Fan", watts: 75 },
  { name: "Microwave", watts: 1000 },
  { name: "Water Heater", watts: 2000 },
  { name: "Rice Cooker", watts: 400 },
  { name: "LED Lights (per bulb)", watts: 10 },
];

export function ApplianceInput({ onAdd, recentEntries, onDelete }: ApplianceInputProps) {
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [customWatts, setCustomWatts] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appliance = COMMON_APPLIANCES.find((a) => a.name === selectedAppliance);
    const watts = customWatts ? parseFloat(customWatts) : appliance?.watts || 0;
    const hours = parseFloat(hoursPerDay);

    if (selectedAppliance && watts > 0 && hours > 0) {
      onAdd({
        appliance: selectedAppliance,
        watts,
        hoursPerDay: hours,
        date,
      });
      
      // Reset form
      setHoursPerDay("");
      setCustomWatts("");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Appliance Usage</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Appliance
          </label>
          <select
            value={selectedAppliance}
            onChange={(e) => setSelectedAppliance(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose an appliance...</option>
            {COMMON_APPLIANCES.map((app) => (
              <option key={app.name} value={app.name}>
                {app.name} ({app.watts}W)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours Used Today
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="24"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 8"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Wattage (optional)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={customWatts}
            onChange={(e) => setCustomWatts(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave blank to use default"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Usage Entry
        </button>
      </form>

      {recentEntries.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Entries</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{entry.appliance}</p>
                  <p className="text-xs text-gray-600">
                    {entry.hoursPerDay}h/day • {((entry.watts * entry.hoursPerDay) / 1000).toFixed(2)} kWh • {entry.date}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
