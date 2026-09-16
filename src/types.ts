export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface MachineItem {
  id?: string;
  userId?: string;
  unitNumber: string;
  makeModel: string;
  category: 'excavator' | 'dozer' | 'loader' | 'grader' | 'haul_truck' | 'other';
  assignedSite: string;
  hourlyOperatorRate: number; // e.g. 65 ($/hr)
  hourlyFuelBurn: number;     // e.g. 28 ($/hr)
  remoteRetrofitReady?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface ShiftMachineData {
  unitNumber: string;
  makeModel: string;
  totalEngineHours: number;    // e.g. 8.0
  activeWorkingHours: number;  // e.g. 3.2
  idleHours: number;          // e.g. 4.8
  hourlyOperatorRate: number; // e.g. 68
  fuelCostPerHour: number;    // e.g. 30
}

export interface AuditInput {
  title: string;
  siteName: string;
  shiftHours: number;
  machines: ShiftMachineData[];
  shiftNotes?: string;
  logImageBase64?: string; // compressed client-side <1MB
}

export interface MachineAuditItem {
  unitNumber: string;
  makeModel: string;
  totalEngineHours: number;
  activeHours: number;
  idleHours: number;
  idlePercentage: number;
  idlePayrollLoss: number;
  idleFuelLoss: number;
  totalWastedDollar: number;
  keyBottleneck: string;
}

export interface AuditResult {
  id?: string;
  userId?: string;
  title: string;
  siteName: string;
  timestamp: string;
  shiftHours: number;
  totalShiftCost: number;
  activeWorkCost: number;
  idlePayrollWaste: number;
  idleFuelWaste: number;
  totalWastedCost: number;
  efficiencyPercentage: number;
  monthlyLossProjection: number;
  remoteConsolidationPotential: number; // monthly savings with 1 operator covering 3 seats
  machineBreakdown: MachineAuditItem[];
  recommendations: string[];
  executiveSummary: string;
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string | null;
  companyName?: string;
  fleetSize?: number;
  primarySector?: string;
  createdAt: string;
}

export type AnalyticsEventType =
  | 'signup'
  | 'hero_feature_used'
  | 'pricing_viewed'
  | 'checkout_clicked'
  | 'webinar_registered'
  | 'pilot_requested';
