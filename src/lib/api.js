/**
 * @file api.js
 * @description Centralized client API communication layer for Wandering Globe.
 * Referenced in Flam Frontend Assignment Guide (Section 5).
 * 
 * Rules:
 * - This is the ONLY place where the frontend sends network requests to the backend proxy.
 * - The LLM provider (Groq) is NEVER called directly from the browser; API keys remain securely on the server.
 * - Supports request cancellation through AbortSignal.
 */

/**
 * Sends a structured itinerary generation request to the Express backend proxy.
 * @param {string} promptText - User's free-form travel query
 * @param {Object} options - Additional options
 * @param {string} [options.simulation] - Recruiter testing simulation ('malformed_json', 'wrong_shape', 'empty_response', 'slow_timeout', 'network_error')
 * @param {string} [options.apiKey] - Optional custom Groq client key override
 * @param {AbortSignal} [options.signal] - AbortSignal for race-condition prevention & user cancellation
 * @returns {Promise<Response>}
 */
export async function planTripApi(promptText, options = {}) {
  const { simulation, apiKey, signal } = options;

  return fetch('/api/plan-trip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-groq-key': apiKey } : {})
    },
    body: JSON.stringify({
      prompt: promptText,
      simulation,
      apiKey
    }),
    signal
  });
}

/**
 * Sends a refinement request to update an existing itinerary.
 * @param {Object} currentTrip - The active itinerary state
 * @param {string} refinementPrompt - Natural language modification
 * @param {Object} options
 * @returns {Promise<Response>}
 */
export async function refineTripApi(currentTrip, refinementPrompt, options = {}) {
  const { simulation, apiKey, signal } = options;

  return fetch('/api/refine-trip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-groq-key': apiKey } : {})
    },
    body: JSON.stringify({
      currentTrip,
      refinementPrompt,
      simulation,
      apiKey
    }),
    signal
  });
}

/**
 * Checks server health and Groq API key configuration.
 * @returns {Promise<{ status: string, hasGroqKey: boolean, timestamp: string }>}
 */
export async function checkServerHealthApi() {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error(`Health check returned status ${res.status}`);
  }
  return res.json();
}
