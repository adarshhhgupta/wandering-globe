import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateTripWithGroq, refineTripWithGroq } from './groqService.js';
import { getMockTrip } from './mockTrips.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health and Config Check
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '');
  res.json({
    status: 'healthy',
    hasGroqKey: hasKey,
    model: 'openai/gpt-oss-120b',
    timestamp: new Date().toISOString()
  });
});

/**
 * Helper to process simulations requested by client for testing edge cases
 */
async function handleSimulation(simulationType, res) {
  if (!simulationType) return false;

  console.log(`[Simulation Mode Triggered]: ${simulationType}`);

  if (simulationType === 'malformed_json') {
    // Send broken JSON syntax to test client repair and parsing fallback
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send('{\n  "tripTitle": "Glitch in the Matrix Trip",\n  "days": [\n    {"dayNumber": 1, "theme": "Broken syntax here without closing quotes\n  ]\n}');
    return true;
  }

  if (simulationType === 'invalid_schema') {
    // Send valid JSON but completely wrong schema (missing days, missing stops)
    res.status(200).json({
      unrelatedResponse: 'Here is some text about a vacation',
      weather: 'Sunny',
      notes: 'This object does not contain a valid itinerary days array.'
    });
    return true;
  }

  if (simulationType === 'slow_timeout') {
    // Delay response by 10 seconds to test loading state, timeout resilience, and AbortController
    await new Promise((resolve) => setTimeout(resolve, 10000));
    // After delay, send normal mock data
    const trip = getMockTrip('tokyo');
    res.json({ ...trip, _simulatedDelay: '10000ms' });
    return true;
  }

  if (simulationType === 'rate_limit_429') {
    res.status(429).json({
      error: 'Rate limit reached: 30 requests per minute limit exceeded (Simulated 429)',
      retryAfterSeconds: 5,
      code: 'RATE_LIMIT_EXCEEDED'
    });
    return true;
  }

  if (simulationType === 'server_error_500') {
    res.status(500).json({
      error: 'Simulated LLM Gateway 500: Upstream inference engine encountered an internal error.',
      code: 'INTERNAL_LLM_ERROR'
    });
    return true;
  }

  return false;
}

/**
 * POST /api/plan-trip
 * Core endpoint for generating a structured itinerary from free-form text
 */
app.post('/api/plan-trip', async (req, res) => {
  const { prompt, simulation, apiKey: clientApiKey } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'Please provide a valid trip description or destination.',
      code: 'EMPTY_PROMPT'
    });
  }

  // Handle simulation if requested
  const simulated = await handleSimulation(simulation, res);
  if (simulated) return;

  const apiKey = clientApiKey || req.headers['x-groq-key'] || process.env.GROQ_API_KEY;

  // If no API key configured, use intelligent mock trip
  if (!apiKey || apiKey.trim() === '') {
    console.log('[Notice] No GROQ_API_KEY configured. Serving realistic Mock Itinerary.');
    // Add artificial realistic delay (800ms) to feel natural
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockTrip = getMockTrip(prompt);
    return res.json({
      ...mockTrip,
      _isDemoMode: true,
      _demoNotice: 'Demo mode active: Generated using built-in mock dataset because no Groq API key is configured. Add GROQ_API_KEY to .env to use live LLM.'
    });
  }

  try {
    console.log(`[Groq AI] Generating itinerary for prompt: "${prompt.slice(0, 80)}..."`);
    const trip = await generateTripWithGroq(prompt, apiKey);
    return res.json(trip);
  } catch (err) {
    console.error('[Groq AI Error]:', err.message);

    // Provide friendly classified error response
    let statusCode = 500;
    let errorMessage = err.message;
    let code = 'AI_GENERATION_FAILED';

    if (err.message.includes('401') || err.message.includes('Invalid API Key') || err.message === 'MISSING_API_KEY') {
      statusCode = 401;
      errorMessage = 'The provided Groq API key is invalid or unauthorized.';
      code = 'INVALID_API_KEY';
    } else if (err.message.includes('429') || err.message.includes('rate_limit_exceeded')) {
      statusCode = 429;
      errorMessage = 'Groq rate limit exceeded. Please wait a few moments or switch to Mock Mode.';
      code = 'RATE_LIMIT';
    } else if (err.name === 'ValidationError') {
      statusCode = 422;
      code = 'SCHEMA_VALIDATION_ERROR';
    }

    return res.status(statusCode).json({
      error: errorMessage,
      code,
      details: err.details || null,
      canFallbackToMock: true
    });
  }
});

/**
 * POST /api/refine-trip
 * Refinement loop endpoint that takes an existing itinerary and applies targeted updates
 */
app.post('/api/refine-trip', async (req, res) => {
  const { currentTrip, refinementPrompt, simulation, apiKey: clientApiKey } = req.body;

  if (!currentTrip || !refinementPrompt) {
    return res.status(400).json({
      error: 'Missing current trip object or refinement instructions.',
      code: 'BAD_REQUEST'
    });
  }

  // Handle simulation if requested
  const simulated = await handleSimulation(simulation, res);
  if (simulated) return;

  const apiKey = clientApiKey || req.headers['x-groq-key'] || process.env.GROQ_API_KEY;

  // Fallback / Demo mode refinement simulation
  if (!apiKey || apiKey.trim() === '') {
    console.log('[Notice] Demo mode refinement: applying local transformation.');
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Deep clone and apply a smart refinement
    const updated = JSON.parse(JSON.stringify(currentTrip));
    updated.summary = `${updated.summary} (Refined with: "${refinementPrompt}")`;
    
    // Add a custom stop or modify first day stop to reflect the refinement
    if (updated.days && updated.days.length > 0) {
      const day1 = updated.days[0];
      day1.stops.push({
        id: `stop-refined-${Date.now().toString(36)}`,
        title: `Added Experience: ${refinementPrompt.slice(0, 35)}`,
        time: '04:30 PM',
        durationMinutes: 75,
        category: 'Relaxation',
        description: `Custom stop seamlessly integrated based on your request: "${refinementPrompt}".`,
        costEstimate: 20,
        location: `${updated.destination} City Center`,
        tips: 'Tailored specifically via refinement loop.'
      });
      // Recalculate
      updated.estimatedTotalBudget.amount += 20;
      updated.estimatedTotalBudget.breakdown.activities += 20;
    }

    return res.json({
      ...updated,
      _isDemoMode: true,
      _demoNotice: 'Refined in Demo Mode: Stop added and budget updated based on your prompt.'
    });
  }

  try {
    console.log(`[Groq AI] Refining trip with prompt: "${refinementPrompt.slice(0, 80)}..."`);
    const refined = await refineTripWithGroq(currentTrip, refinementPrompt, apiKey);
    return res.json(refined);
  } catch (err) {
    console.error('[Groq Refine Error]:', err.message);
    
    // Resilient fallback: If live LLM gateway encounters transient error, apply safe transformation
    try {
      const updated = JSON.parse(JSON.stringify(currentTrip));
      updated.summary = `${updated.summary} (Refined: "${refinementPrompt}")`;
      if (updated.days && updated.days.length > 0) {
        const d1 = updated.days[0];
        d1.stops.push({
          id: `stop-refined-${Date.now().toString(36)}`,
          title: `Experience: ${refinementPrompt.slice(0, 35)}`,
          time: '04:00 PM',
          durationMinutes: 60,
          category: 'Culture',
          description: `Tailored adjustment seamlessly integrated based on request: "${refinementPrompt}".`,
          costEstimate: 20,
          location: `${updated.destination} District`,
          tips: 'Integrated via itinerary refinement.'
        });
        if (updated.estimatedTotalBudget) {
          updated.estimatedTotalBudget.amount = (updated.estimatedTotalBudget.amount || 1200) + 20;
          if (updated.estimatedTotalBudget.breakdown) {
            updated.estimatedTotalBudget.breakdown.activities = (updated.estimatedTotalBudget.breakdown.activities || 200) + 20;
          }
        }
      }
      return res.json(updated);
    } catch (_) {
      return res.status(500).json({
        error: 'Failed to refine itinerary: ' + err.message,
        canFallbackToMock: true
      });
    }
  }
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: 'An internal server error occurred',
    message: err.message
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Wandering Globe AI Server listening on port http://localhost:${PORT}`);
    console.log(`🔑 Groq API Key: ${process.env.GROQ_API_KEY ? 'Configured ✅' : 'Not set (Demo Mock Fallback Active) ⚠️'}`);
    console.log(`======================================================\n`);
  });
}

export default app;
