import { ApplianceUsage } from "../components/ApplianceInput";

// CO2 emission factor and cost per kWh
const CO2_PER_KWH = 0.5;
const COST_PER_KWH = 11;

export interface DailyConsumption {
  date: string;
  consumption: number;
  appliances: { [key: string]: number };
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: {
    savings: number;
    co2Reduction: number;
  };
  priority: "high" | "medium" | "low";
  appliance: string;
}

export interface ConsumptionPrediction {
  predictedConsumption: number;
  confidence: number;
  trend: "increasing" | "decreasing" | "stable";
  percentageChange: number;
}

/**
 * AI Service for Energy Consumption Analysis
 * 
 * This service implements machine learning algorithms for:
 * 1. Pattern Detection - Identifies high-consumption habits
 * 2. Predictive Analytics - Forecasts next week's consumption
 * 3. Anomaly Detection - Detects unusual usage patterns
 * 4. Personalized Recommendations - Suggests energy-saving actions
 */
export class EcoTrackAI {
  /**
   * Analyzes daily consumption patterns
   */
  static analyzeDailyPatterns(usages: ApplianceUsage[]): DailyConsumption[] {
    const dailyMap = new Map<string, DailyConsumption>();

    usages.forEach((usage) => {
      const consumption = (usage.watts * usage.hoursPerDay) / 1000;
      
      if (!dailyMap.has(usage.date)) {
        dailyMap.set(usage.date, {
          date: usage.date,
          consumption: 0,
          appliances: {},
        });
      }

      const daily = dailyMap.get(usage.date)!;
      daily.consumption += consumption;
      daily.appliances[usage.appliance] = (daily.appliances[usage.appliance] || 0) + consumption;
    });

    return Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * Predicts next week's consumption using weighted moving average and trend analysis
   * This is a simplified ML algorithm suitable for browser execution
   */
  static predictNextWeek(usages: ApplianceUsage[]): ConsumptionPrediction {
    const dailyPatterns = this.analyzeDailyPatterns(usages);
    
    if (dailyPatterns.length < 3) {
      // Not enough data for prediction
      return {
        predictedConsumption: 0,
        confidence: 0,
        trend: "stable",
        percentageChange: 0,
      };
    }

    // Calculate weighted moving average (recent days have more weight)
    const weights = [0.1, 0.15, 0.2, 0.25, 0.3]; // Last 5 days
    const recentDays = dailyPatterns.slice(-5);
    
    let weightedSum = 0;
    let weightSum = 0;
    
    recentDays.forEach((day, index) => {
      const weight = weights[index] || 0.1;
      weightedSum += day.consumption * weight;
      weightSum += weight;
    });
    
    const weightedAverage = weightedSum / weightSum;

    // Calculate trend using linear regression
    const trend = this.calculateTrend(dailyPatterns.slice(-7));
    
    // Predict next week's average daily consumption
    const predictedDaily = weightedAverage * (1 + trend);
    
    // Calculate confidence based on data consistency
    const confidence = this.calculateConfidence(dailyPatterns);
    
    // Determine trend direction
    const percentageChange = trend * 100;
    let trendDirection: "increasing" | "decreasing" | "stable" = "stable";
    
    if (percentageChange > 5) {
      trendDirection = "increasing";
    } else if (percentageChange < -5) {
      trendDirection = "decreasing";
    }

    return {
      predictedConsumption: predictedDaily,
      confidence,
      trend: trendDirection,
      percentageChange,
    };
  }

  /**
   * Calculate trend using simple linear regression
   */
  private static calculateTrend(dailyPatterns: DailyConsumption[]): number {
    if (dailyPatterns.length < 2) return 0;

    const n = dailyPatterns.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    dailyPatterns.forEach((day, index) => {
      sumX += index;
      sumY += day.consumption;
      sumXY += index * day.consumption;
      sumX2 += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const average = sumY / n;
    
    // Return trend as percentage change per day
    return average > 0 ? slope / average : 0;
  }

  /**
   * Calculate prediction confidence based on data variance
   */
  private static calculateConfidence(dailyPatterns: DailyConsumption[]): number {
    if (dailyPatterns.length < 2) return 0.5;

    const values = dailyPatterns.map((d) => d.consumption);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate standard deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate coefficient of variation
    const cv = mean > 0 ? stdDev / mean : 1;
    
    // Convert to confidence (lower variation = higher confidence)
    // CV of 0 = 100% confidence, CV of 1+ = 50% confidence
    const confidence = Math.max(0.5, Math.min(1, 1 - cv * 0.5));
    
    return confidence;
  }

  /**
   * Generates AI-powered personalized recommendations based on usage patterns
   */
  static generateRecommendations(usages: ApplianceUsage[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Analyze appliance usage
    const applianceStats = this.analyzeApplianceUsage(usages);
    
    // Find high-consumption appliances
    const sortedAppliances = Object.entries(applianceStats)
      .sort((a, b) => b[1].totalConsumption - a[1].totalConsumption);

    // Recommendation 1: Reduce usage of highest consuming appliance
    if (sortedAppliances.length > 0) {
      const [appliance, stats] = sortedAppliances[0];
      const avgHours = stats.totalHours / stats.count;
      
      if (avgHours > 6 && appliance.toLowerCase().includes("air conditioner")) {
        const savingsPerHour = (stats.avgWatts / 1000) * COST_PER_KWH * 30; // Monthly savings
        const co2PerHour = (stats.avgWatts / 1000) * CO2_PER_KWH * 30;
        
        recommendations.push({
          id: "ai-rec-1",
          title: `Reduce ${appliance} Usage`,
          description: `Your ${appliance} runs an average of ${avgHours.toFixed(1)} hours per day. Reducing usage by 1 hour can save you ₱${savingsPerHour.toFixed(0)} per month and cut ${co2PerHour.toFixed(1)} kg CO₂. Consider using it only during peak heat hours or setting a timer.`,
          impact: {
            savings: Math.round(savingsPerHour),
            co2Reduction: parseFloat(co2PerHour.toFixed(1)),
          },
          priority: "high",
          appliance,
        });
      }
    }

    // Recommendation 2: Off-peak usage for high-wattage appliances
    const highWattageAppliances = sortedAppliances.filter(
      ([name, stats]) => stats.avgWatts > 400
    );

    if (highWattageAppliances.length > 1) {
      const [appliance, stats] = highWattageAppliances[1];
      const monthlySavings = (stats.totalConsumption * 0.3 * COST_PER_KWH * 30) / usages.length;
      const co2Savings = (stats.totalConsumption * 0.3 * CO2_PER_KWH * 30) / usages.length;

      recommendations.push({
        id: "ai-rec-2",
        title: `Off-Peak ${appliance} Usage`,
        description: `Running your ${appliance} during off-peak hours (10 PM - 6 AM) can reduce grid strain and potentially save on electricity costs. This could reduce your carbon footprint by up to 30%.`,
        impact: {
          savings: Math.round(monthlySavings),
          co2Reduction: parseFloat(co2Savings.toFixed(1)),
        },
        priority: "medium",
        appliance,
      });
    }

    // Recommendation 3: Temperature optimization for AC
    const acUsage = sortedAppliances.find(([name]) => 
      name.toLowerCase().includes("air conditioner")
    );
    
    if (acUsage) {
      const [appliance, stats] = acUsage;
      const savingsPerDegree = (stats.avgWatts / 1000) * 0.1 * COST_PER_KWH * 30;
      const co2PerDegree = (stats.avgWatts / 1000) * 0.1 * CO2_PER_KWH * 30;

      recommendations.push({
        id: "ai-rec-3",
        title: "Optimize AC Temperature",
        description: `Increasing your air conditioner temperature by 1°C can reduce energy consumption by 10%. Set it to 24-25°C for optimal comfort and efficiency.`,
        impact: {
          savings: Math.round(savingsPerDegree),
          co2Reduction: parseFloat(co2PerDegree.toFixed(1)),
        },
        priority: "medium",
        appliance,
      });
    }

    // Recommendation 4: Detect always-on appliances
    const alwaysOnAppliances = Object.entries(applianceStats).filter(
      ([name, stats]) => stats.totalHours / stats.count > 20
    );

    if (alwaysOnAppliances.length > 1) {
      const [appliance, stats] = alwaysOnAppliances[1];
      
      recommendations.push({
        id: "ai-rec-4",
        title: `Monitor ${appliance} Efficiency`,
        description: `Your ${appliance} runs continuously. Ensure it's energy-efficient and properly maintained. Consider upgrading to an inverter model if it's more than 10 years old.`,
        impact: {
          savings: Math.round(stats.totalConsumption * 0.2 * COST_PER_KWH * 30),
          co2Reduction: parseFloat((stats.totalConsumption * 0.2 * CO2_PER_KWH * 30).toFixed(1)),
        },
        priority: "low",
        appliance,
      });
    }

    // Recommendation 5: Weekly trend analysis
    const dailyPatterns = this.analyzeDailyPatterns(usages);
    if (dailyPatterns.length >= 7) {
      const weeklyAvg = dailyPatterns.slice(-7).reduce((sum, d) => sum + d.consumption, 0) / 7;
      const previousWeekAvg = dailyPatterns.slice(-14, -7).reduce((sum, d) => sum + d.consumption, 0) / 7;
      
      if (previousWeekAvg > 0) {
        const weeklyChange = ((weeklyAvg - previousWeekAvg) / previousWeekAvg) * 100;
        
        if (weeklyChange > 10) {
          recommendations.push({
            id: "ai-rec-5",
            title: "Weekly Consumption Alert",
            description: `Your energy use increased ${weeklyChange.toFixed(1)}% this week. Review your recent appliance usage to identify the cause. The AI detected changes in your consumption patterns.`,
            impact: {
              savings: Math.round((weeklyAvg - previousWeekAvg) * COST_PER_KWH * 4),
              co2Reduction: parseFloat(((weeklyAvg - previousWeekAvg) * CO2_PER_KWH * 4).toFixed(1)),
            },
            priority: "high",
            appliance: "Overall Usage",
          });
        }
      }
    }

    return recommendations.slice(0, 4); // Return top 4 recommendations
  }

  /**
   * Analyzes usage statistics by appliance
   */
  private static analyzeApplianceUsage(usages: ApplianceUsage[]) {
    const stats: {
      [appliance: string]: {
        totalConsumption: number;
        totalHours: number;
        count: number;
        avgWatts: number;
      };
    } = {};

    usages.forEach((usage) => {
      if (!stats[usage.appliance]) {
        stats[usage.appliance] = {
          totalConsumption: 0,
          totalHours: 0,
          count: 0,
          avgWatts: 0,
        };
      }

      const consumption = (usage.watts * usage.hoursPerDay) / 1000;
      stats[usage.appliance].totalConsumption += consumption;
      stats[usage.appliance].totalHours += usage.hoursPerDay;
      stats[usage.appliance].count += 1;
      stats[usage.appliance].avgWatts = usage.watts;
    });

    return stats;
  }

  /**
   * Detects anomalies in consumption patterns
   */
  static detectAnomalies(usages: ApplianceUsage[]): {
    hasAnomaly: boolean;
    message: string;
    date?: string;
  } {
    const dailyPatterns = this.analyzeDailyPatterns(usages);
    
    if (dailyPatterns.length < 7) {
      return { hasAnomaly: false, message: "Insufficient data for anomaly detection" };
    }

    // Calculate mean and standard deviation
    const values = dailyPatterns.map((d) => d.consumption);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );

    // Check for anomalies (values > 2 standard deviations from mean)
    const threshold = mean + 2 * stdDev;
    const anomalies = dailyPatterns.filter((d) => d.consumption > threshold);

    if (anomalies.length > 0) {
      const anomaly = anomalies[anomalies.length - 1];
      const percentageAbove = ((anomaly.consumption - mean) / mean) * 100;
      
      return {
        hasAnomaly: true,
        message: `Unusual consumption detected on ${new Date(anomaly.date).toLocaleDateString()}. Usage was ${percentageAbove.toFixed(0)}% higher than normal.`,
        date: anomaly.date,
      };
    }

    return { hasAnomaly: false, message: "No anomalies detected" };
  }

  /**
   * Generates insights about consumption patterns
   */
  static generateInsights(usages: ApplianceUsage[]): string[] {
    const insights: string[] = [];
    const dailyPatterns = this.analyzeDailyPatterns(usages);
    
    if (dailyPatterns.length < 2) return insights;

    // Insight 1: Most consuming appliance
    const applianceStats = this.analyzeApplianceUsage(usages);
    const topAppliance = Object.entries(applianceStats).sort(
      (a, b) => b[1].totalConsumption - a[1].totalConsumption
    )[0];

    if (topAppliance) {
      const [name, stats] = topAppliance;
      const percentage = (stats.totalConsumption / dailyPatterns.reduce((sum, d) => sum + d.consumption, 0)) * 100;
      insights.push(`Your ${name} accounts for ${percentage.toFixed(0)}% of total energy consumption.`);
    }

    // Insight 2: Weekly trend
    if (dailyPatterns.length >= 7) {
      const recentAvg = dailyPatterns.slice(-3).reduce((sum, d) => sum + d.consumption, 0) / 3;
      const weekAvg = dailyPatterns.slice(-7).reduce((sum, d) => sum + d.consumption, 0) / 7;
      
      if (recentAvg > weekAvg * 1.1) {
        insights.push("Your consumption has increased in the last 3 days compared to your weekly average.");
      } else if (recentAvg < weekAvg * 0.9) {
        insights.push("Great job! Your consumption has decreased in the last 3 days.");
      }
    }

    return insights;
  }
}
