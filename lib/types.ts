export type RiskLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type RiskBand = "0-3" | "4-6" | "7-9" | "10";

export const HEALTH_CONCERNS_CHECKLIST = [
  "Allergies",
  "Diabetes",
  "Heart stroke / cardiovascular",
  "High blood pressure",
  "Asthma / respiratory",
  "Epilepsy / seizures",
  "Mental health conditions",
  "Immunocompromised",
  "Chronic kidney/liver disease",
  "Other (see additional note)",
] as const;

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: EmergencyContact;
  citizenship: string;
  height: string;
  weight: string;
  bloodType: string;
  race: string;
  healthConcerns: Record<string, boolean>;
  vaccinationHistory: string;
  additionalNote: string;
  consentSigned: boolean;
  consentDate: string;
  createdAt: string;
}

export type DestinationType = "us" | "international";

export interface Destination {
  id: string;
  type: DestinationType;
  usState?: string;
  country?: string;
  city: string;
  arrivalDate: string;
  departureDate: string;
}

export interface TravelPlan {
  id: string;
  userId: string;
  destinations: Destination[];
  primaryTransportation: string;
  checklist: {
    immigration: boolean;
    healthRegulations: boolean;
    lawRegulations: boolean;
    weather: boolean;
    other: string;
  };
  createdAt: string;
}

export interface SubRegionRisk {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskScore: RiskLevel;
  radiusMiles: number;
  sources: { label: string; url: string }[];
}

export interface TravelAnalysis {
  planId: string;
  overallRiskScore: RiskLevel;
  subRegions: SubRegionRisk[];
  recommendations: string[];
  verifiedChecklist: Record<string, boolean>;
  followUpServices: { id: string; type: string; name: string; link?: string }[];
  notificationEnabled: boolean;
  lastNotifiedAt?: string;
  updatedAt: string;
}

export interface RealtimeShare {
  id: string;
  userId: string;
  planId: string;
  sharedWith: { email: string; label: string }[];
  riskScore: RiskLevel;
  weather: { temp: number; condition: string; location: string };
  concerns: {
    food: string;
    water: string;
    airPollution: string;
    noisePollution: string;
    unrest: string;
    disasters: string;
  };
  additionalNote: string;
  updatedAt: string;
}
