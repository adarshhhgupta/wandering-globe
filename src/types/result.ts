/**
 * @file result.ts
 * @description Formal Structured Schema Definition for Wandering Globe Itineraries.
 * Designed in Step 1 of the Flam Frontend Internship Assignment.
 * 
 * Strict JSON Contract guaranteed by Groq LPU + Backend Schema Validator:
 * - tripTitle: string
 * - destination: string
 * - duration: string
 * - travelStyle: string
 * - summary: string
 * - days: Array<DayPlan>
 * - estimatedBudget: BudgetBreakdown
 * - packingChecklist: Array<string>
 * - localTips: Array<string>
 */

export type StopCategory =
  | 'Sightseeing'
  | 'Food'
  | 'Culture'
  | 'Adventure'
  | 'Relaxation'
  | 'Transit'
  | 'Nightlife'
  | 'Shopping';

export interface Stop {
  id: string;
  time: string;
  duration?: string | number;
  durationMinutes?: number;
  activity?: string;
  title?: string;
  location: string;
  description: string;
  cost?: string | number;
  costEstimate?: number;
  category: StopCategory | string;
  tips?: string;
}

export interface DayPlan {
  day?: number;
  dayNumber?: number;
  dateOrDay?: string;
  theme: string;
  estimatedDailyCost?: string | number;
  stops: Stop[];
}

export interface BudgetBreakdown {
  totalEstimatedUsd?: number;
  amount?: number;
  currency?: string;
  accommodation?: number;
  stay?: number;
  foodAndDining?: number;
  food?: number;
  activities?: number;
  localTransport?: number;
  transport?: number;
  breakdown?: {
    activities?: number;
    food?: number;
    stay?: number;
    transport?: number;
  };
}

export interface TripResult {
  id?: string;
  tripTitle: string;
  destination: string;
  duration?: string | number;
  durationDays?: number;
  travelStyle?: string;
  tripStyle?: string;
  summary: string;
  days: DayPlan[];
  estimatedBudget?: BudgetBreakdown;
  estimatedTotalBudget?: BudgetBreakdown;
  packingChecklist?: string[];
  packingHighlights?: string[];
  localTips?: string[];
  savedAt?: string;
}

export interface ValidationSuccess {
  isValid: true;
  data: TripResult;
  error: null;
}

export interface ValidationFailure {
  isValid: false;
  data: null;
  error: string;
  details?: unknown;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;
