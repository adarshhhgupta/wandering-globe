/**
 * Server-side Schema Validation & Normalization for Trip Itinerary
 * Ensures that the AI-generated structured data satisfies all application requirements
 * and applies resilient fallbacks for missing optional properties.
 */

export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * Extracts and parses JSON from raw LLM output, resilient to markdown backticks
 * and accidental conversational prefixes or suffixes.
 */
export function extractAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new ValidationError('AI returned empty response or invalid text stream');
  }

  let cleaned = rawText.trim();

  // Strip Markdown code block wrappers: ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
    cleaned = cleaned.trim();
  }

  // Attempt initial JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt multi-level repair for common LLM syntax slip-ups:
    // 1. Remove trailing commas before closing braces/brackets
    let repaired = cleaned.replace(/,\s*([}\]])/g, '$1');

    // 2. Locate first '{' and last '}' if model included preamble or postscript
    const firstBrace = repaired.indexOf('{');
    const lastBrace = repaired.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      repaired = repaired.substring(firstBrace, lastBrace + 1);
    }

    try {
      return JSON.parse(repaired);
    } catch (secondErr) {
      throw new ValidationError(
        'AI output could not be parsed as valid JSON: ' + secondErr.message,
        { rawSample: rawText.slice(0, 300) }
      );
    }
  }
}

/**
 * Validates and normalizes the parsed trip object.
 * Applies defaults and ensures every day and stop has unique IDs and valid attributes.
 */
export function validateAndNormalizeTrip(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ValidationError('Expected root object with trip details, got ' + typeof data);
  }

  // Check required core fields
  if (!data.tripTitle && !data.destination) {
    throw new ValidationError('Missing trip title and destination in AI response');
  }

  if (!Array.isArray(data.days) || data.days.length === 0) {
    throw new ValidationError('Invalid or empty "days" itinerary array returned by AI');
  }

  // Normalize root fields
  const normalized = {
    tripTitle: String(data.tripTitle || `${data.destination || 'Uncharted'} Adventure`),
    destination: String(data.destination || 'Selected Destination'),
    durationDays: Number(data.durationDays) || data.days.length,
    summary: String(data.summary || 'A curated travel itinerary crafted by WanderForge AI.'),
    tripStyle: String(data.tripStyle || 'Balanced Explorer'),
    estimatedTotalBudget: {
      currency: data.estimatedTotalBudget?.currency || 'USD',
      amount: Number(data.estimatedTotalBudget?.amount) || 0,
      breakdown: {
        activities: Number(data.estimatedTotalBudget?.breakdown?.activities) || 0,
        food: Number(data.estimatedTotalBudget?.breakdown?.food) || 0,
        stay: Number(data.estimatedTotalBudget?.breakdown?.stay) || 0,
        transport: Number(data.estimatedTotalBudget?.breakdown?.transport) || 0,
      }
    },
    packingHighlights: Array.isArray(data.packingHighlights)
      ? data.packingHighlights.map(String).filter(Boolean)
      : ['Comfortable walking shoes', 'Weather-appropriate layers', 'Universal power adapter'],
    localTips: Array.isArray(data.localTips)
      ? data.localTips.map(String).filter(Boolean)
      : ['Keep local currency handy for small vendors', 'Pre-book top attractions to skip peak queues'],
    days: []
  };

  // Validate and normalize each day
  normalized.days = data.days.map((day, dIndex) => {
    const dayNumber = Number(day.dayNumber) || (dIndex + 1);
    const dayTheme = String(day.theme || `Day ${dayNumber}: Highlights & Exploration`);
    const dateOrDay = String(day.dateOrDay || `Day ${dayNumber}`);

    const rawStops = Array.isArray(day.stops) ? day.stops : [];
    const stops = rawStops.map((stop, sIndex) => {
      const stopId = stop.id || `stop-${dayNumber}-${sIndex + 1}-${Date.now().toString(36).slice(-4)}`;
      return {
        id: String(stopId),
        title: String(stop.title || `Stop ${sIndex + 1}`),
        time: String(stop.time || '10:00 AM'),
        durationMinutes: Number(stop.durationMinutes) || 60,
        category: sanitizeCategory(stop.category),
        description: String(stop.description || 'Explore and enjoy this location.'),
        costEstimate: Number(stop.costEstimate) || 0,
        location: String(stop.location || 'Central Area'),
        tips: String(stop.tips || 'Check opening hours and weather beforehand.')
      };
    });

    return {
      dayNumber,
      theme: dayTheme,
      dateOrDay,
      stops
    };
  });

  // Calculate total budget if amount was 0
  if (normalized.estimatedTotalBudget.amount === 0) {
    let stopsCostTotal = 0;
    normalized.days.forEach(d => {
      d.stops.forEach(s => { stopsCostTotal += s.costEstimate; });
    });
    // Add estimated stay + transport heuristic if 0
    if (normalized.estimatedTotalBudget.breakdown.activities === 0) {
      normalized.estimatedTotalBudget.breakdown.activities = stopsCostTotal;
    }
    normalized.estimatedTotalBudget.amount = 
      normalized.estimatedTotalBudget.breakdown.activities +
      normalized.estimatedTotalBudget.breakdown.food +
      normalized.estimatedTotalBudget.breakdown.stay +
      normalized.estimatedTotalBudget.breakdown.transport;
    if (normalized.estimatedTotalBudget.amount === 0) {
      normalized.estimatedTotalBudget.amount = stopsCostTotal > 0 ? stopsCostTotal * 2 : 500;
    }
  }

  return normalized;
}

function sanitizeCategory(cat) {
  const allowed = ['Sightseeing', 'Food', 'Adventure', 'Culture', 'Relaxation', 'Nightlife', 'Shopping', 'Transit'];
  if (!cat) return 'Sightseeing';
  const match = allowed.find(a => a.toLowerCase() === String(cat).toLowerCase());
  return match || 'Sightseeing';
}
