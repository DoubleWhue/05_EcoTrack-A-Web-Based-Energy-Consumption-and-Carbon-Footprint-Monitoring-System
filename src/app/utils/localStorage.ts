import { ApplianceUsage } from "../components/ApplianceInput";

const STORAGE_KEY = "ecotrack_data";

export interface EcoTrackData {
  usages: ApplianceUsage[];
  goals: {
    consumptionGoal: number;
    co2Goal: number;
  };
  lastUpdated: string;
}

/**
 * Local Storage Service for EcoTrack
 * Handles data persistence across sessions
 */
export class LocalStorageService {
  /**
   * Save data to localStorage
   */
  static saveData(data: EcoTrackData): void {
    try {
      const jsonData = JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, jsonData);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }

  /**
   * Load data from localStorage
   */
  static loadData(): EcoTrackData | null {
    try {
      const jsonData = localStorage.getItem(STORAGE_KEY);
      if (!jsonData) return null;

      const data = JSON.parse(jsonData);
      return data;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return null;
    }
  }

  /**
   * Clear all data from localStorage
   */
  static clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing data from localStorage:", error);
    }
  }

  /**
   * Export data as JSON file
   */
  static exportData(): void {
    const data = this.loadData();
    if (!data) {
      console.error("No data to export");
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecotrack_data_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON file
   */
  static async importData(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.usages || !Array.isArray(data.usages)) {
        throw new Error("Invalid data format");
      }

      this.saveData(data);
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }
}
