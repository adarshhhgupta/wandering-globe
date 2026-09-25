/**
 * @file result.js
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

/**
 * @typedef {Object} Stop
 * @property {string} id - Unique identifier (e.g. "stop-101")
 * @property {string} time - Activity scheduled time (e.g. "09:00 AM")
 * @property {string} duration - Approximate duration (e.g. "90m", "2h")
 * @property {string} activity - Name of the excursion or point of interest
 * @property {string} location - Specific landmark, district, or GPS coordinate
 * @property {string} description - Insider cultural context & tips
 * @property {string} cost - Estimated localized expense (e.g. "$25", "Free", "¥3000")
 * @property {'Sightseeing' | 'Food' | 'Culture' | 'Adventure' | 'Relaxation' | 'Transit'} category - Tag categorization
 */

/**
 * @typedef {Object} DayPlan
 * @property {number} day - Numeric day index (1-indexed)
 * @property {string} theme - Editorial thematic title for the day
 * @property {string} estimatedDailyCost - Aggregated daily cost
 * @property {Array<Stop>} stops - Sequential list of itinerary stops
 */

/**
 * @typedef {Object} BudgetBreakdown
 * @property {number} totalEstimatedUsd - Overall estimated total budget in USD
 * @property {number} accommodation - Projected lodging share
 * @property {number} foodAndDining - Projected culinary expenses
 * @property {number} activities - Attractions & admissions
 * @property {number} localTransport - Rail, taxi, and transit passes
 * @property {string} currency - Base ISO currency code (USD, JPY, EUR, INR)
 */

/**
 * @typedef {Object} TripResult
 * @property {string} [id] - Local cache tracking ID
 * @property {string} tripTitle - Evocative expedition name
 * @property {string} destination - Geocoded destination
 * @property {string} duration - Trip length (e.g. "4 days")
 * @property {string} travelStyle - Chosen travel vibe
 * @property {string} summary - Free-form holistic editorial summary
 * @property {Array<DayPlan>} days - Day-by-day structured itinerary
 * @property {BudgetBreakdown} estimatedBudget - Financial telemetry
 * @property {Array<string>} packingChecklist - AI suggested gear checklist
 * @property {Array<string>} localTips - Curated insider tips
 * @property {string} [savedAt] - Local storage timestamp
 */

export const TRIP_RESULT_TYPES = {
  VERSION: '1.0.0',
  CATEGORIES: ['Sightseeing', 'Food', 'Culture', 'Adventure', 'Relaxation', 'Transit']
};
