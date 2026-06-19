export interface UserProfile {
  id?: number;
  dietPreference: 'meat-heavy' | 'vegetarian' | 'vegan' | 'local-focus';
  transportPreference: 'car' | 'carpool' | 'transit' | 'bike' | 'walk';
  carType?: 'gas' | 'petrol_hatchback' | 'petrol_sedan' | 'diesel_sedan' | 'diesel_suv' | 'hybrid' | 'electric';
  commutingDays: number; // days per week
  housingType: 'house' | 'apartment' | 'shared';
  solarPanels: boolean;
  smartThermostat: boolean;
  ledBulbs: boolean;
  airConUsage: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface StructuredAICo2Data {
  scenario: string;
  impactLevel: 'low' | 'medium' | 'high';
  estimatedCO2Saved: string; // e.g., "12kg CO2"
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  recommendations: string[];
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  structuredData?: StructuredAICo2Data;
}

export interface SimulationRecord {
  id?: number;
  scenarioId: string;
  timestamp: number;
  inputs: Record<string, any>;
  estimatedCO2Saved: number; // kg per year
}

export interface ActionJourneyItem {
  id?: number;
  week: number;
  action: string;
  description: string;
  estimatedCO2Saved: number; // kg CO2 saved per week
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'travel' | 'lifestyle';
  status: 'pending' | 'completed' | 'skipped';
  updatedAt: number;
}
