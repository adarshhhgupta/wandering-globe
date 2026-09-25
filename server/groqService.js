import Groq from 'groq-sdk';
import { extractAndParseJSON, validateAndNormalizeTrip } from './validateSchema.js';

const SYSTEM_INSTRUCTION_NEW_TRIP = `You are Wandering Globe AI, an expert travel architect and planetary concierge.
Your job is to transform a user's free-form trip description into a detailed, realistic, day-by-day structured itinerary.

You MUST respond strictly with valid, pure JSON matching this exact schema. Do not add conversational text, commentary, or markdown formatting outside the JSON object.

JSON SCHEMA:
{
  "tripTitle": "Concise, evocative title (e.g. Kyoto Zen & Gastronomy Escape)",
  "destination": "Primary destination name (City, Country)",
  "durationDays": 3,
  "summary": "2-3 sentences overview of the travel vibe and pacing",
  "tripStyle": "One of: Cultural, Adventure, Leisure, Foodie, Budget, Luxury, Family",
  "estimatedTotalBudget": {
    "currency": "USD",
    "amount": 1250,
    "breakdown": {
      "activities": 300,
      "food": 450,
      "stay": 400,
      "transport": 100
    }
  },
  "packingHighlights": [
    "Item 1 with reason",
    "Item 2 with reason",
    "Item 3 with reason"
  ],
  "localTips": [
    "Tip 1 for transport or local customs",
    "Tip 2 for dining or booking tickets"
  ],
  "days": [
    {
      "dayNumber": 1,
      "dateOrDay": "Day 1",
      "theme": "Theme of this day (e.g. Ancient Temples & Twilight Lanterns)",
      "stops": [
        {
          "id": "stop-1-1",
          "title": "Name of Attraction or Activity",
          "time": "09:30 AM",
          "durationMinutes": 90,
          "category": "Sightseeing | Food | Adventure | Culture | Relaxation | Nightlife | Shopping | Transit",
          "description": "Engaging 1-2 sentence description of what to experience.",
          "costEstimate": 25,
          "location": "Neighborhood or specific street/district",
          "tips": "Pro tip (e.g. arrive early to avoid tour buses, buy ticket online)"
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. Provide realistic durations and chronological timings for each day (e.g., 09:00 AM, 12:30 PM, 03:00 PM, 07:00 PM).
2. Generate between 3 to 5 stops per day with varied categories (mix of Food, Sightseeing, Culture, Relaxation).
3. If the user didn't specify duration, default to a smart 3-day or 4-day plan.
4. Keep JSON valid, properly quoted, and devoid of trailing commas.`;

const SYSTEM_INSTRUCTION_REFINE_TRIP = `You are Wandering Globe AI, an expert travel architect.
The user wants to refine or tweak an existing structured travel itinerary based on their follow-up feedback.

You will receive the CURRENT ITINERARY as a JSON object, followed by the USER'S REFINEMENT REQUEST (e.g. "Replace the expensive dinner on Day 2 with authentic street food", "Add a sunrise hike on Day 1", "Make the entire trip slower paced and budget friendly").

Modify the existing itinerary to fulfill the user's specific request while preserving the overall coherence, existing valid stops, and schema structure.

You MUST respond strictly with valid, pure JSON adhering to the exact same schema. Do NOT include markdown fences, preambles, or conversational commentary.`;

/**
 * Supported models list with fallback priority
 */
const SUPPORTED_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b'
];

function extractFailedGeneration(err) {
  if (!err) return null;
  if (err.error?.failed_generation) {
    return err.error.failed_generation;
  }
  const str = typeof err.message === 'string' ? err.message : JSON.stringify(err);
  const match = str.match(/"failed_generation":\s*"((?:\\.|[^"\\])*)"/s);
  if (match && match[1]) {
    try {
      return JSON.parse(`"${match[1]}"`);
    } catch (_) {
      return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }
  return null;
}

function getGroqClient(customApiKey) {
  const apiKey = customApiKey || process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  return new Groq({ apiKey });
}

/**
 * Attempts completion across supported models in case of account model availability differences
 */
async function callGroqWithFallback(groq, params) {
  let lastErr = null;
  for (const model of SUPPORTED_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        ...params,
        max_tokens: 4096,
        model
      });
      return completion;
    } catch (err) {
      lastErr = err;
      console.warn(`[Groq Model Error with ${model}]:`, err.message);

      // Check if error contains failed_generation that can be salvaged directly
      const failedGen = extractFailedGeneration(err);
      if (failedGen) {
        console.log(`[Groq AI] Successfully salvaged JSON from failed_generation error!`);
        return {
          choices: [
            {
              message: {
                content: failedGen
              }
            }
          ]
        };
      }

      continue;
    }
  }
  throw lastErr;
}

/**
 * Generates a brand-new trip itinerary using Groq LLM
 */
export async function generateTripWithGroq(prompt, customApiKey) {
  const groq = getGroqClient(customApiKey);

  const completion = await callGroqWithFallback(groq, {
    messages: [
      {
        role: 'system',
        content: SYSTEM_INSTRUCTION_NEW_TRIP,
      },
      {
        role: 'user',
        content: `Please plan an itinerary for: "${prompt.trim()}". Return strictly the requested JSON structure.`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const rawContent = completion.choices[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Groq returned empty response content');
  }

  const parsed = extractAndParseJSON(rawContent);
  const validated = validateAndNormalizeTrip(parsed);
  return validated;
}

/**
 * Refines an existing trip itinerary with a follow-up prompt
 */
export async function refineTripWithGroq(currentTrip, refinementPrompt, customApiKey) {
  const groq = getGroqClient(customApiKey);

  const completion = await callGroqWithFallback(groq, {
    messages: [
      {
        role: 'system',
        content: SYSTEM_INSTRUCTION_REFINE_TRIP,
      },
      {
        role: 'user',
        content: `CURRENT ITINERARY:\n${JSON.stringify(currentTrip, null, 2)}\n\nUSER REFINEMENT REQUEST:\n"${refinementPrompt.trim()}"\n\nApply the requested changes and output the complete updated JSON itinerary.`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const rawContent = completion.choices[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Groq returned empty refinement response');
  }

  const parsed = extractAndParseJSON(rawContent);
  const validated = validateAndNormalizeTrip(parsed);
  return validated;
}
