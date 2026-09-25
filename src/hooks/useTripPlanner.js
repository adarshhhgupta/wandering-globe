import { useState, useRef, useCallback } from 'react';
import { planTripApi, refineTripApi } from '../lib/api.js';
import { validateTripResult } from '../lib/validateResult.js';

export function useTripPlanner() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'refining' | 'success' | 'error'
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]); // for undo capability
  const [lastActionMessage, setLastActionMessage] = useState('');

  // Refs for race-condition prevention & cancellation
  const activeRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const lastPromptRef = useRef('');

  /**
   * Push current state to undo history stack (max 10 items)
   */
  const pushToHistory = useCallback((currentTrip, message = '') => {
    if (!currentTrip) return;
    setHistory((prev) => [...prev.slice(-9), currentTrip]);
    if (message) {
      setLastActionMessage(message);
      setTimeout(() => setLastActionMessage(''), 3000);
    }
  }, []);

  /**
   * Undo the most recent modification
   */
  const undoLastAction = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previousTrip = prev[prev.length - 1];
      const newHistory = prev.slice(0, -1);
      setTrip(previousTrip);
      setLastActionMessage('Restored previous itinerary version');
      setTimeout(() => setLastActionMessage(''), 3000);
      return newHistory;
    });
  }, []);

  /**
   * Cancels in-flight request if user clicks Cancel or initiates a new search
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('USER_CANCELLED');
      abortControllerRef.current = null;
    }
    if (status === 'loading' || status === 'refining') {
      setStatus(trip ? 'success' : 'idle');
      setError({
        message: 'Request was cancelled by user.',
        code: 'USER_CANCELLED',
        canRetry: true
      });
    }
  }, [status, trip]);

  /**
   * Core function to generate an itinerary
   */
  const planTrip = useCallback(async (promptText, options = {}) => {
    const { simulation, apiKey } = options;

    if (!promptText || !promptText.trim()) {
      setError({
        message: 'Please enter a description or destination for your trip.',
        code: 'EMPTY_INPUT'
      });
      return;
    }

    // 1. Cancel previous in-flight request to avoid race condition
    if (abortControllerRef.current) {
      console.log('[TripPlanner] Aborting previous pending request...');
      abortControllerRef.current.abort('SUPERSEDED_BY_NEW_REQUEST');
    }

    // 2. Setup fresh AbortController and Request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const thisRequestId = ++activeRequestIdRef.current;
    lastPromptRef.current = promptText;

    setStatus('loading');
    setError(null);

    try {
      const response = await planTripApi(promptText, {
        simulation,
        apiKey,
        signal: controller.signal
      });

      // 3. Prevent Stale Overwrite Check
      if (thisRequestId !== activeRequestIdRef.current) {
        console.warn(`[TripPlanner] Discarding stale response for request #${thisRequestId}. Active is #${activeRequestIdRef.current}`);
        return;
      }

      // Check HTTP status errors
      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      // Read response text (handles both standard JSON and malformed test strings)
      const rawText = await response.text();

      // 4. Stale check again after streaming completes
      if (thisRequestId !== activeRequestIdRef.current) return;

      // 5. Defensive Shape Validation before rendering (Flam section 5 & 6)
      const validation = validateTripResult(rawText);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Set successful state
      setTrip(validation.data);
      setHistory([]);
      setStatus('success');
      setError(null);
    } catch (err) {
      // Ignore user or superseded aborts
      if (err.name === 'AbortError' || err.message === 'SUPERSEDED_BY_NEW_REQUEST' || err.message === 'USER_CANCELLED') {
        console.log('[TripPlanner] Request safely cancelled:', err.message);
        return;
      }

      // Stale check
      if (thisRequestId !== activeRequestIdRef.current) return;

      console.error('[TripPlanner Error]:', err);
      setStatus('error');
      setError({
        message: err.message || 'Failed to generate itinerary. Please try again.',
        code: err.message.includes('malformed') ? 'MALFORMED_OUTPUT' : 'NETWORK_ERROR',
        details: err.details || null,
        canRetry: true,
        canFallbackToMock: true
      });
    } finally {
      if (thisRequestId === activeRequestIdRef.current) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  /**
   * Refinement loop: applies targeted follow-up changes
   */
  const refineTrip = useCallback(async (refinementPrompt, options = {}) => {
    if (!trip) return;
    if (!refinementPrompt || !refinementPrompt.trim()) return;

    const { simulation, apiKey } = options;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort('SUPERSEDED_BY_REFINEMENT');
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const thisRequestId = ++activeRequestIdRef.current;

    setStatus('refining');
    setError(null);
    pushToHistory(trip, 'Saved state before refinement');

    try {
      const response = await refineTripApi(trip, refinementPrompt, {
        simulation,
        apiKey,
        signal: controller.signal
      });

      if (thisRequestId !== activeRequestIdRef.current) return;

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Refinement failed with HTTP ${response.status}`);
      }

      const rawText = await response.text();
      if (thisRequestId !== activeRequestIdRef.current) return;

      const validation = validateTripResult(rawText);
      if (!validation.isValid) {
        throw new Error(`Refined itinerary received invalid structure: ${validation.error}`);
      }

      setTrip(validation.data);
      setStatus('success');
      setLastActionMessage(`Refined with: "${refinementPrompt}"`);
      setTimeout(() => setLastActionMessage(''), 3500);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (thisRequestId !== activeRequestIdRef.current) return;

      console.error('[TripPlanner Refine Error]:', err);
      setStatus('success'); // keep existing trip visible on failure
      setError({
        message: `Refinement error: ${err.message}`,
        code: 'REFINEMENT_ERROR',
        canRetry: true
      });
    } finally {
      if (thisRequestId === activeRequestIdRef.current) {
        abortControllerRef.current = null;
      }
    }
  }, [trip, pushToHistory]);

  /**
   * Reorder stops within a specific day (HTML5 drag-and-drop or Move Up / Down)
   */
  const reorderStops = useCallback((dayNumber, sourceIndex, destIndex) => {
    if (sourceIndex === destIndex) return;

    setTrip((prev) => {
      if (!prev) return prev;
      pushToHistory(prev, 'Reordered stops');

      const nextDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;

        const newStops = [...day.stops];
        const [movedStop] = newStops.splice(sourceIndex, 1);
        newStops.splice(destIndex, 0, movedStop);
        return { ...day, stops: newStops };
      });

      return { ...prev, days: nextDays };
    });
  }, [pushToHistory]);

  /**
   * Move stop from one day to another
   */
  const moveStopToDay = useCallback((stopId, fromDayNum, toDayNum, targetIndex = null) => {
    if (fromDayNum === toDayNum) return;

    setTrip((prev) => {
      if (!prev) return prev;
      pushToHistory(prev, `Moved stop to Day ${toDayNum}`);

      let targetStop = null;

      // Extract stop from source day
      const daysWithoutStop = prev.days.map((day) => {
        if (day.dayNumber === fromDayNum) {
          const remainingStops = day.stops.filter((s) => {
            if (s.id === stopId) {
              targetStop = s;
              return false;
            }
            return true;
          });
          return { ...day, stops: remainingStops };
        }
        return day;
      });

      if (!targetStop) return prev;

      // Insert stop into destination day
      const finalDays = daysWithoutStop.map((day) => {
        if (day.dayNumber === toDayNum) {
          const newStops = [...day.stops];
          if (targetIndex !== null && targetIndex >= 0) {
            newStops.splice(targetIndex, 0, targetStop);
          } else {
            newStops.push(targetStop);
          }
          return { ...day, stops: newStops };
        }
        return day;
      });

      return { ...prev, days: finalDays };
    });
  }, [pushToHistory]);

  /**
   * Remove a stop with automatic budget recalculation
   */
  const removeStop = useCallback((dayNumber, stopId) => {
    setTrip((prev) => {
      if (!prev) return prev;
      pushToHistory(prev, 'Removed stop');

      let removedCost = 0;

      const nextDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;

        const filteredStops = day.stops.filter((s) => {
          if (s.id === stopId) {
            removedCost = s.costEstimate || 0;
            return false;
          }
          return true;
        });
        return { ...day, stops: filteredStops };
      });

      // Update total budget
      const nextBudget = { ...prev.estimatedTotalBudget };
      nextBudget.amount = Math.max(0, nextBudget.amount - removedCost);
      if (nextBudget.breakdown) {
        nextBudget.breakdown.activities = Math.max(0, (nextBudget.breakdown.activities || 0) - removedCost);
      }

      return { ...prev, days: nextDays, estimatedTotalBudget: nextBudget };
    });
  }, [pushToHistory]);

  /**
   * Add a custom stop to a day
   */
  const addCustomStop = useCallback((dayNumber, stopData) => {
    setTrip((prev) => {
      if (!prev) return prev;
      pushToHistory(prev, `Added stop: ${stopData.title}`);

      const newStop = {
        id: `custom-stop-${Date.now().toString(36)}`,
        title: stopData.title || 'New Stop',
        time: stopData.time || '02:00 PM',
        durationMinutes: Number(stopData.durationMinutes) || 60,
        category: stopData.category || 'Sightseeing',
        description: stopData.description || 'Custom addition to itinerary.',
        costEstimate: Number(stopData.costEstimate) || 0,
        location: stopData.location || 'Local Area',
        tips: stopData.tips || 'Self-planned stop.'
      };

      const nextDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return { ...day, stops: [...day.stops, newStop] };
      });

      const nextBudget = { ...prev.estimatedTotalBudget };
      nextBudget.amount += newStop.costEstimate;
      if (nextBudget.breakdown) {
        nextBudget.breakdown.activities = (nextBudget.breakdown.activities || 0) + newStop.costEstimate;
      }

      return { ...prev, days: nextDays, estimatedTotalBudget: nextBudget };
    });
  }, [pushToHistory]);

  /**
   * Edit stop details
   */
  const editStop = useCallback((dayNumber, updatedStop) => {
    setTrip((prev) => {
      if (!prev) return prev;
      pushToHistory(prev, `Updated stop: ${updatedStop.title}`);

      let costDiff = 0;

      const nextDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;

        const nextStops = day.stops.map((s) => {
          if (s.id === updatedStop.id) {
            costDiff = (updatedStop.costEstimate || 0) - (s.costEstimate || 0);
            return { ...s, ...updatedStop };
          }
          return s;
        });

        return { ...day, stops: nextStops };
      });

      const nextBudget = { ...prev.estimatedTotalBudget };
      nextBudget.amount = Math.max(0, nextBudget.amount + costDiff);
      if (nextBudget.breakdown) {
        nextBudget.breakdown.activities = Math.max(0, (nextBudget.breakdown.activities || 0) + costDiff);
      }

      return { ...prev, days: nextDays, estimatedTotalBudget: nextBudget };
    });
  }, [pushToHistory]);

  /**
   * Load mock demo directly into state (useful as instant fallback)
   */
  const loadMockDemo = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'tokyo' })
      });
      const data = await res.json();
      setTrip(data);
      setStatus('success');
      setHistory([]);
    } catch (e) {
      setError({ message: 'Failed to load demo: ' + e.message, canRetry: true });
      setStatus('error');
    }
  }, []);

  /**
   * Reset planner
   */
  const resetPlanner = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('USER_RESET');
    }
    setTrip(null);
    setError(null);
    setStatus('idle');
    setHistory([]);
  }, []);

  return {
    status,
    trip,
    error,
    historyLength: history.length,
    lastActionMessage,
    lastPrompt: lastPromptRef.current,
    planTrip,
    refineTrip,
    cancelRequest,
    reorderStops,
    moveStopToDay,
    removeStop,
    addCustomStop,
    editStop,
    undoLastAction,
    loadMockDemo,
    resetPlanner,
    setTrip
  };
}
