import { generateTripWithGroq, refineTripWithGroq } from './groqService.js';

/**
 * @file generate.ts
 * @description Holds the API key, calls the LLM, and returns structured JSON.
 * Referenced directly in Flam Frontend Assignment Guide (Section 5).
 * 
 * Rules:
 * - Keeps API keys securely on the server; never exposed to browser bundles.
 * - Enforces strict structured output via Groq response_format: { type: "json_object" }.
 * - Validates and normalizes the parsed payload before sending back to the frontend proxy.
 */

/**
 * Generates a structured trip itinerary from a free-form user query.
 * @param prompt - Free-form travel prompt
 * @param apiKeyOverride - Optional client-supplied key override
 * @returns Validated structured trip object
 */
export async function generate(prompt: string, apiKeyOverride: string | null = null): Promise<any> {
  return generateTripWithGroq(prompt, apiKeyOverride);
}

/**
 * Refines an existing itinerary given a natural language modification.
 * @param currentTrip - Active itinerary state
 * @param refinementPrompt - Natural language change
 * @param apiKeyOverride - Optional client-supplied key override
 * @returns Updated structured trip object
 */
export async function refine(
  currentTrip: any,
  refinementPrompt: string,
  apiKeyOverride: string | null = null
): Promise<any> {
  return refineTripWithGroq(currentTrip, refinementPrompt, apiKeyOverride);
}

export default {
  generate,
  refine
};
