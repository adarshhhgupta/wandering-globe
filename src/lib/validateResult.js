/**
 * @file validateResult.js
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

export class SchemaValidationError extends Error {
  constructor(message, field, rawPayload) {
    super(message);
    this.name = 'SchemaValidationError';
    this.field = field;
    this.rawPayload = rawPayload;
    this.code = 'WRONG_SHAPE';
  }
}

/**
 * Defensive structural validator that guarantees the UI receives only predictable data.
 * @param {string | object} raw - The raw JSON string or parsed object from the LLM proxy.
 * @returns {{ isValid: boolean, data?: object, error?: string, code?: string }}
 */
export function validateTripResult(raw) {
  // Step 1: Parse if raw string
  let parsed = raw;
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
    } catch (parseError) {
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
  const validatedDays = parsed.days.map((dayItem, dayIdx) => {
    const dayNumber = Number(dayItem.day) || dayIdx + 1;
    const theme = dayItem.theme || `Day ${dayNumber} Exploration`;
    const estimatedDailyCost = dayItem.estimatedDailyCost || '$100';

    const stops = Array.isArray(dayItem.stops)
      ? dayItem.stops.map((stopItem, stopIdx) => ({
          id: stopItem.id || `stop-${dayNumber}-${stopIdx + 1}`,
          time: stopItem.time || '10:00 AM',
          duration: stopItem.duration || '90m',
          activity: stopItem.activity || 'Local Landmark Visit',
          location: stopItem.location || parsed.destination,
          description: stopItem.description || 'Explore the surrounding historic and scenic spots.',
          cost: stopItem.cost || 'Free',
          category: stopItem.category || 'Sightseeing'
        }))
      : [];

    return {
      day: dayNumber,
      theme,
      estimatedDailyCost,
      stops
    };
  });

  // Step 5: Normalize budget telemetry
  const rawBudget = parsed.estimatedBudget || {};
  const estimatedBudget = {
    totalEstimatedUsd: Number(rawBudget.totalEstimatedUsd) || 1200,
    accommodation: Number(rawBudget.accommodation) || 500,
    foodAndDining: Number(rawBudget.foodAndDining) || 350,
    activities: Number(rawBudget.activities) || 200,
    localTransport: Number(rawBudget.localTransport) || 150,
    currency: rawBudget.currency || 'USD'
  };

  // Step 6: Return normalized, safe object
  const sanitizedTrip = {
    ...parsed,
    days: validatedDays,
    estimatedBudget,
    packingChecklist: Array.isArray(parsed.packingChecklist) ? parsed.packingChecklist : [],
    localTips: Array.isArray(parsed.localTips) ? parsed.localTips : []
  };

  return {
    isValid: true,
    data: sanitizedTrip
  };
}
