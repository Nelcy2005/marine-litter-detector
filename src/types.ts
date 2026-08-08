export type LitterCategory = 
  | 'Plastic Waste'
  | 'Non-Plastic Waste'
  | 'Marine Life'
  | 'Natural Substrate';

export type EnvironmentalRisk = 'Low' | 'Medium' | 'High' | 'Critical';

export interface BoundingBox {
  ymin: number; // 0 to 1000 or 0 to 1
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedItem {
  id: string;
  label: string;
  category: LitterCategory;
  tacoCategory?: string; // e.g. "TACO 1-01: Plastic bottle"
  confidence: number; // 0.0 to 1.0
  boundingBox?: BoundingBox;
  estimatedDecompositionYears?: number;
  environmentalRisk: EnvironmentalRisk;
  description?: string;
}

export interface DetectionResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pollutionIndex: number; // 0 to 100
  pollutionLevel: 'Pristine' | 'Mild' | 'Moderate' | 'High' | 'Critical';
  summary: string;
  items: DetectedItem[];
  counts: {
    totalItems: number;
    plasticsCount: number;
    nonPlasticWasteCount: number;
    marineLifeCount: number;
  };
  threatAnalysis: {
    ingestionRisk: EnvironmentalRisk;
    entanglementRisk: EnvironmentalRisk;
    toxicLeachRisk: EnvironmentalRisk;
    primaryPollutant: string;
    recommendedAction: string;
  };
}

export interface PollutionLogRecord {
  id: string;
  date: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  pollutionIndex: number;
  totalPlastics: number;
  totalMarineLife: number;
  primaryCategory: string;
  observer: string;
  notes: string;
  imageUrl?: string;
}
