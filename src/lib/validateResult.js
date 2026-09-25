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
    const dayNumber = Number(dayItem.dayNumber) || Number(dayItem.day) || (dayIdx + 1);
    const theme = dayItem.theme || `Day ${dayNumber} Exploration`;
    const dateOrDay = dayItem.dateOrDay || `Day ${dayNumber}`;
    const estimatedDailyCost = dayItem.estimatedDailyCost || '$100';

    const stops = Array.isArray(dayItem.stops)
      ? dayItem.stops.map((stopItem, stopIdx) => {
          const title = String(stopItem.title || stopItem.activity || `Stop ${stopIdx + 1}`);
          const durationMinutes = Number(stopItem.durationMinutes) || (parseInt(String(stopItem.duration)) || 60);
          const costEstimate = typeof stopItem.costEstimate === 'number'
            ? stopItem.costEstimate
            : (parseInt(String(stopItem.cost).replace(/[^0-9]/g, '')) || 0);

          return {
            id: String(stopItem.id || `stop-${dayNumber}-${stopIdx + 1}`),
            title,
            activity: title,
            time: String(stopItem.time || '10:00 AM'),
            duration: String(stopItem.duration || `${durationMinutes}m`),
            durationMinutes,
            location: String(stopItem.location || parsed.destination),
            description: String(stopItem.description || 'Explore and experience this curated destination.'),
            cost: stopItem.cost !== undefined ? String(stopItem.cost) : (costEstimate > 0 ? `$${costEstimate}` : 'Free'),
            costEstimate,
            category: stopItem.category || 'Sightseeing',
            tips: String(stopItem.tips || 'Wear comfortable shoes and check opening times.')
          };
        })
      : [];

    return {
      day: dayNumber,
      dayNumber: dayNumber,
      dateOrDay,
      theme,
      estimatedDailyCost,
      stops
    };
  });

  // Step 5: Normalize budget telemetry
  const rawTotalBudget = parsed.estimatedTotalBudget || {};
  const rawBudget = parsed.estimatedBudget || {};

  const activitiesCost = Number(rawTotalBudget.breakdown?.activities) || Number(rawBudget.activities) || 200;
  const foodCost = Number(rawTotalBudget.breakdown?.food) || Number(rawBudget.foodAndDining) || 350;
  const stayCost = Number(rawTotalBudget.breakdown?.stay) || Number(rawBudget.accommodation) || 500;
  const transportCost = Number(rawTotalBudget.breakdown?.transport) || Number(rawBudget.localTransport) || 150;
  const currency = rawTotalBudget.currency || rawBudget.currency || 'USD';
  const totalAmount = Number(rawTotalBudget.amount) || Number(rawBudget.totalEstimatedUsd) || (activitiesCost + foodCost + stayCost + transportCost);

  const estimatedTotalBudget = {
    currency,
    amount: totalAmount,
    breakdown: {
      activities: activitiesCost,
      food: foodCost,
      stay: stayCost,
      transport: transportCost
    }
  };

  const estimatedBudget = {
    totalEstimatedUsd: totalAmount,
    accommodation: stayCost,
    foodAndDining: foodCost,
    activities: activitiesCost,
    localTransport: transportCost,
    currency
  };

  // Step 6: Return normalized, safe object
  const sanitizedTrip = {
    ...parsed,
    durationDays: Number(parsed.durationDays) || validatedDays.length,
    days: validatedDays,
    estimatedTotalBudget,
    estimatedBudget,
    packingHighlights: Array.isArray(parsed.packingHighlights)
      ? parsed.packingHighlights
      : (Array.isArray(parsed.packingChecklist) ? parsed.packingChecklist : []),
    packingChecklist: Array.isArray(parsed.packingChecklist)
      ? parsed.packingChecklist
      : (Array.isArray(parsed.packingHighlights) ? parsed.packingHighlights : []),
    localTips: Array.isArray(parsed.localTips) ? parsed.localTips : []
  };

  return {
    isValid: true,
    data: sanitizedTrip
  };
}
