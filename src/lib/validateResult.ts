/**
 * @file validateResult.ts
 * @description Defensive parsing and structural validation before rendering.
 * Referenced in Flam Frontend Assignment Guide (Section 5 & 6).
 * 
 * Ensures that unpredictable LLM output is thoroughly verified:
 * 1. Checks that raw response parses to an object.
 * 2. Validates top-level required fields (tripTitle, destination, days).
 * 3. Enforces that 'days' is a non-empty array with valid stops.
 * 4. Normalizes missing optional fields gracefully rather than crashing.
 * 5. Returns { isValid: true, data: sanitizedTrip } or { isValid: false, error: ... }
 */

import { resilientJSONParse } from '../utils/jsonRepair.js';
import type { TripResult, ValidationResult, DayPlan, Stop } from '../types/result';

export class SchemaValidationError extends Error {
  field?: string;
  rawPayload?: unknown;
  code: string;

  constructor(message: string, field?: string, rawPayload?: unknown) {
    super(message);
    this.name = 'SchemaValidationError';
    this.field = field;
    this.rawPayload = rawPayload;
    this.code = 'WRONG_SHAPE';
  }
}

/**
 * Defensive structural validator that guarantees the UI receives only predictable data.
 */
export function validateTripResult(raw: unknown): { isValid: boolean; data?: TripResult; error?: string; code?: string } {
  // Step 1: Parse if raw string
  let parsed: any = raw;
  if (typeof raw === 'string') {
    if (!raw.trim()) {
      return {
        isValid: false,
        error: 'Model returned an empty response. Please retry.',
        code: 'EMPTY_RESPONSE'
      };
    }
    try {
      parsed = resilientJSONParse(raw);
    } catch (parseError: any) {
      return {
        isValid: false,
        error: `Malformed JSON from model: ${parseError.message}`,
        code: 'MALFORMED_JSON'
      };
    }
  }

  // Step 2: Validate root is an object
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      isValid: false,
      error: 'Model response was not a structured JSON object.',
      code: 'WRONG_SHAPE'
    };
  }

  // Step 3: Structural checks for critical top-level fields
  if (!parsed.tripTitle || typeof parsed.tripTitle !== 'string') {
    return {
      isValid: false,
      error: "Missing or invalid 'tripTitle' field in model output.",
      code: 'WRONG_SHAPE'
    };
  }

  if (!parsed.destination || typeof parsed.destination !== 'string') {
    return {
      isValid: false,
      error: "Missing or invalid 'destination' field in model output.",
      code: 'WRONG_SHAPE'
    };
  }

  if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
    return {
      isValid: false,
      error: "Missing or empty 'days' itinerary array in model output.",
      code: 'WRONG_SHAPE'
    };
  }

  // Step 4: Validate each day and stop
  const validatedDays: DayPlan[] = parsed.days.map((dayItem: any, dayIdx: number) => {
    const dayNumber = Number(dayItem.dayNumber) || Number(dayItem.day) || dayIdx + 1;
    const theme = dayItem.theme || `Day ${dayNumber} Exploration`;
    const stopsList = Array.isArray(dayItem.stops) ? dayItem.stops : [];

    const validatedStops: Stop[] = stopsList.map((stopItem: any, stopIdx: number) => ({
      id: String(stopItem.id || `stop-${dayNumber}-${stopIdx + 1}`),
      time: String(stopItem.time || '10:00 AM'),
      duration: String(stopItem.duration || '90m'),
      durationMinutes: Number(stopItem.durationMinutes) || 90,
      activity: String(stopItem.activity || stopItem.title || 'Attraction / Activity'),
      title: String(stopItem.title || stopItem.activity || 'Attraction / Activity'),
      location: String(stopItem.location || parsed.destination),
      description: String(stopItem.description || 'Explore and experience this destination.'),
      cost: stopItem.cost !== undefined ? String(stopItem.cost) : '$20',
      costEstimate: Number(stopItem.costEstimate) || 20,
      category: String(stopItem.category || 'Sightseeing'),
      tips: stopItem.tips ? String(stopItem.tips) : 'Wear comfortable walking shoes.'
    }));

    return {
      day: dayNumber,
      dayNumber: dayNumber,
      theme,
      estimatedDailyCost: dayItem.estimatedDailyCost || '$100',
      stops: validatedStops
    };
  });

  // Step 5: Normalize optional metadata fields
  const sanitizedTrip: TripResult = {
    id: parsed.id || `trip-${Date.now().toString(36)}`,
    tripTitle: parsed.tripTitle.trim(),
    destination: parsed.destination.trim(),
    duration: parsed.duration || `${validatedDays.length} days`,
    durationDays: Number(parsed.durationDays) || validatedDays.length,
    travelStyle: parsed.travelStyle || parsed.tripStyle || 'Balanced Explorer',
    summary: parsed.summary || `A curated ${validatedDays.length}-day journey through ${parsed.destination}.`,
    days: validatedDays,
    estimatedTotalBudget: parsed.estimatedTotalBudget || {
      currency: 'USD',
      amount: 1200,
      breakdown: { activities: 250, food: 350, stay: 500, transport: 100 }
    },
    estimatedBudget: parsed.estimatedBudget || parsed.estimatedTotalBudget || {
      totalEstimatedUsd: 1200,
      accommodation: 500,
      foodAndDining: 350,
      activities: 250,
      localTransport: 100,
      currency: 'USD'
    },
    packingChecklist: Array.isArray(parsed.packingChecklist)
      ? parsed.packingChecklist
      : (Array.isArray(parsed.packingHighlights) ? parsed.packingHighlights : [
          'Comfortable walking footwear',
          'Universal power adapter',
          'Portable charger',
          'Lightweight waterproof jacket'
        ]),
    localTips: Array.isArray(parsed.localTips)
      ? parsed.localTips
      : [
          'Download offline transit maps before departure',
          'Keep small bills for local merchants and markets'
        ]
  };

  return {
    isValid: true,
    data: sanitizedTrip
  };
}

export function validateResult(raw: unknown) {
  return validateTripResult(raw);
}

export default validateTripResult;
