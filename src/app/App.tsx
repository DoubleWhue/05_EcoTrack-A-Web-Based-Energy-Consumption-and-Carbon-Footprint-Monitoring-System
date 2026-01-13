import { useState, useEffect } from "react";
import { Leaf, Clock, Info, Download, Upload, Sparkles } from "lucide-react";
import { EnergyMetrics } from "./components/EnergyMetrics";
import { ApplianceInput, ApplianceUsage } from "./components/ApplianceInput";
import { ConsumptionChart } from "./components/ConsumptionChart";
import { CarbonFootprintMeter } from "./components/CarbonFootprintMeter";
import { RecommendationsPanel } from "./components/RecommendationsPanel";
import { PredictionsAlert } from "./components/PredictionsAlert";
import { GoalsTracker } from "./components/GoalsTracker";
import { AIInsights } from "./components/AIInsights";
import { EcoTrackAI } from "./utils/aiService";
import { LocalStorageService } from "./utils/localStorage";

// CO2 emission factor: ~0.5 kg CO2 per kWh (average for Philippines grid)
const CO2_PER_KWH = 0.5;
// Average electricity cost in Philippines: ~₱10-12 per kWh
const COST_PER_KWH = 11;

function App() {
  const [applianceUsages, setApplianceUsages] = useState<ApplianceUsage[]>([]);
  const [consumptionGoal, setConsumptionGoal] = useState(200);
  const [co2Goal, setCo2Goal] = useState(100);
  const [showAIInfo, setShowAIInfo] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = LocalStorageService.loadData();
    if (savedData && savedData.usages.length > 0) {
      setApplianceUsages(savedData.usages);
      setConsumptionGoal(savedData.goals.consumptionGoal);
      setCo2Goal(savedData.goals.co2Goal);
    } else {
      // Initialize with sample data for demonstration
      initializeSampleData();
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (applianceUsages.length > 0) {
      LocalStorageService.saveData({
        usages: applianceUsages,
        goals: {
          consumptionGoal,
          co2Goal,
        },
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [applianceUsages, consumptionGoal, co2Goal]);

  const initializeSampleData = () => {
    const sampleData: ApplianceUsage[] = [
      {
        id: "1",
        appliance: "Air Conditioner",
        watts: 1500,
        hoursPerDay: 8,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "2",
        appliance: "Refrigerator",
        watts: 150,
        hoursPerDay: 24,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "3",
        appliance: "Television",
        watts: 100,
        hoursPerDay: 5,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "4",
        appliance: "Air Conditioner",
        watts: 1500,
        hoursPerDay: 10,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "5",
        appliance: "Washing Machine",
        watts: 500,
        hoursPerDay: 2,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "6",
        appliance: "Computer/Laptop",
        watts: 200,
        hoursPerDay: 8,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "7",
        appliance: "Air Conditioner",
        watts: 1500,
        hoursPerDay: 9,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        id: "8",
        appliance: "Refrigerator",
        watts: 150,
        hoursPerDay: 24,
        date: new Date().toISOString().split("T")[0],
      },
      {
        id: "9",
        appliance: "Electric Fan",
        watts: 75,
        hoursPerDay: 6,
        date: new Date().toISOString().split("T")[0],
      },
    ];
    setApplianceUsages(sampleData);
  };

  const handleAddUsage = (usage: Omit<ApplianceUsage, "id">) => {
    const newUsage: ApplianceUsage = {
      ...usage,
      id: Date.now().toString(),
    };
    setApplianceUsages([newUsage, ...applianceUsages]);
  };

  const handleDeleteUsage = (id: string) => {
    setApplianceUsages(applianceUsages.filter((usage) => usage.id !== id));
  };

  const handleExportData = () => {
    LocalStorageService.exportData();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      LocalStorageService.importData(file).then((success) => {
        if (success) {
          const data = LocalStorageService.loadData();
          if (data) {
            setApplianceUsages(data.usages);
            setConsumptionGoal(data.goals.consumptionGoal);
            setCo2Goal(data.goals.co2Goal);
            alert("Data imported successfully!");
          }
        } else {
          alert("Failed to import data. Please check the file format.");
        }
      });
    }
  };

  // Calculate total consumption (kWh)
  const totalConsumption = applianceUsages.reduce((sum, usage) => {
    return sum + (usage.watts * usage.hoursPerDay) / 1000;
  }, 0);

  // Calculate total CO2 emissions
  const totalCO2 = totalConsumption * CO2_PER_KWH;

  // Calculate total cost
  const totalCost = totalConsumption * COST_PER_KWH;

  // AI-powered weekly change analysis
  const dailyPatterns = EcoTrackAI.analyzeDailyPatterns(applianceUsages);
  let weeklyChange = 0;
  
  if (dailyPatterns.length >= 14) {
    const thisWeek = dailyPatterns.slice(-7).reduce((sum, d) => sum + d.consumption, 0) / 7;
    const lastWeek = dailyPatterns.slice(-14, -7).reduce((sum, d) => sum + d.consumption, 0) / 7;
    weeklyChange = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;
  }

  // Generate chart data with AI predictions
  const generateChartData = () => {
    const data = [];
    
    // Get actual data from AI analysis
    const recentPatterns = dailyPatterns.slice(-7);
    
    // Pad with zeros if we don't have 7 days of data
    for (let i = 7 - recentPatterns.length; i > 0; i--) {
      const date = new Date(Date.now() - (6 - recentPatterns.length + i) * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        consumption: 0,
      });
    }
    
    // Add actual data
    recentPatterns.forEach((pattern) => {
      data.push({
        date: new Date(pattern.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        consumption: pattern.consumption,
      });
    });

    // AI Predictions for next 7 days
    const prediction = EcoTrackAI.predictNextWeek(applianceUsages);
    const baselinePrediction = prediction.predictedConsumption;
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      // Add some variation to predictions based on trend
      const variation = Math.sin(i * 0.5) * 0.1 * baselinePrediction;
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        consumption: 0,
        predicted: Math.max(0, baselinePrediction + variation),
      });
    }

    return data;
  };

  // AI-generated recommendations
  const aiRecommendations = EcoTrackAI.generateRecommendations(applianceUsages);
  
  // Convert to format expected by RecommendationsPanel
  const recommendations = aiRecommendations.map((rec) => ({
    ...rec,
    icon: <Clock className="w-5 h-5" />,
  }));

  // Goals
  const goals = [
    {
      id: "1",
      title: "Reduce Monthly Consumption",
      target: consumptionGoal,
      current: totalConsumption,
      unit: "kWh",
      deadline: "Jan 31, 2026",
    },
    {
      id: "2",
      title: "Lower Carbon Footprint",
      target: co2Goal,
      current: totalCO2,
      unit: "kg CO₂",
      deadline: "Jan 31, 2026",
    },
  ];

  // AI Prediction for next week
  const aiPrediction = EcoTrackAI.predictNextWeek(applianceUsages);
  const averageConsumption = dailyPatterns.length > 0
    ? dailyPatterns.reduce((sum, d) => sum + d.consumption, 0) / dailyPatterns.length
    : 0;

  // AI Insights
  const insights = EcoTrackAI.generateInsights(applianceUsages);
  const anomaly = EcoTrackAI.detectAnomalies(applianceUsages);

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-2">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">EcoTrack</h1>
              <p className="text-blue-100 text-sm mt-1">
                AI-Powered Energy Consumption & Carbon Footprint Monitor
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900">
              <strong>Welcome to EcoTrack!</strong> Monitor your energy consumption in real-time, track your carbon
              footprint, and receive AI-powered recommendations to reduce your environmental impact.
              Start by logging your appliance usage below.
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-6">
          <EnergyMetrics
            totalConsumption={totalConsumption}
            totalCO2={totalCO2}
            totalCost={totalCost}
            weeklyChange={weeklyChange}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart and Input */}
          <div className="lg:col-span-2 space-y-6">
            <ConsumptionChart data={chartData} showPredictions={true} />
            <ApplianceInput
              onAdd={handleAddUsage}
              recentEntries={applianceUsages.slice(0, 5)}
              onDelete={handleDeleteUsage}
            />
          </div>

          {/* Right Column - Meter, Predictions, Recommendations, Goals */}
          <div className="space-y-6">
            <CarbonFootprintMeter currentCO2={totalCO2} goalCO2={co2Goal} />
            <PredictionsAlert
              predictedConsumption={aiPrediction.predictedConsumption}
              averageConsumption={averageConsumption}
              confidence={aiPrediction.confidence}
            />
          </div>
        </div>

        {/* Bottom Section - Recommendations and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecommendationsPanel recommendations={recommendations} />
          <GoalsTracker goals={goals} />
        </div>

        {/* AI Insights Section */}
        <div className="mt-6">
          <AIInsights insights={insights} anomaly={anomaly} />
        </div>

        {/* Data Management Section */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
              <p className="text-sm text-gray-600">Export or import your energy usage data</p>
            </div>
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => setShowAIInfo(!showAIInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Features Info
            </button>
          </div>

          {showAIInfo && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🤖 AI Features in EcoTrack</h4>
              <ul className="text-sm text-purple-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Pattern Detection:</strong> AI analyzes your daily consumption to identify high-usage habits and peak consumption times.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Predictive Analytics:</strong> Using weighted moving averages and linear regression, the system predicts your next week's consumption with confidence scoring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Anomaly Detection:</strong> ML algorithms detect unusual consumption patterns using statistical analysis (2 standard deviations from mean).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Personalized Recommendations:</strong> AI generates custom energy-saving tips based on your specific appliance usage patterns and calculates potential savings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Trend Analysis:</strong> The system tracks weekly trends and alerts you to consumption changes, helping you stay proactive.</span>
                </li>
              </ul>
              <p className="text-xs text-purple-600 mt-3">
                📍 <strong>Find AI Features:</strong> Check the "AI Insights" panel, "Next Week Prediction" card, and "AI-Powered Recommendations" section.
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Emission factors based on Philippines grid electricity (0.5 kg CO₂/kWh) • Data updated in real-time
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;