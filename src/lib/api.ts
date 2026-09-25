/**
 * @file api.ts
 * @description Centralized client API communication layer for Wandering Globe.
 * Referenced in Flam Frontend Assignment Guide (Section 5).
 * 
 * Rules:
 * - This is the ONLY place where the frontend sends network requests to the backend proxy.
 * - The LLM provider (Groq) is NEVER called directly from the browser; API keys remain securely on the server.
 * - Supports request cancellation through AbortSignal.
 */

import type { TripResult } from '../types/result';

export interface ApiOptions {
  simulation?: string | null;
  apiKey?: string | null;
  signal?: AbortSignal;
}

export interface HealthResponse {
  status: string;
  hasGroqKey: boolean;
  model?: string;
  timestamp?: string;
}

/**
 * Sends a structured itinerary generation request to the Express backend proxy.
 */
export async function planTripApi(promptText: string, options: ApiOptions = {}): Promise<Response> {
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
 */
export async function refineTripApi(
  currentTrip: TripResult,
  refinementPrompt: string,
  options: ApiOptions = {}
): Promise<Response> {
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
 * Checks server status and whether a Groq API key is active in the proxy environment.
 */
export async function checkServerHealthApi(): Promise<HealthResponse> {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error(`Server health check failed with status: ${response.status}`);
  }
  return response.json();
}

export default {
  planTripApi,
  refineTripApi,
  checkServerHealthApi
};
