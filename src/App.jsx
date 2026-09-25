import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { PromptInput } from './components/PromptInput.jsx';
import { ResultView } from './components/ResultView.jsx';
import { ErrorState } from './components/ErrorState.jsx';
import { LoadingState } from './components/LoadingState.jsx';
import { SimulationModal } from './components/SimulationModal.jsx';
import { SavedTripsDrawer } from './components/SavedTripsDrawer.jsx';
import { ApiKeyModal } from './components/ApiKeyModal.jsx';
import { Footer } from './components/Footer.jsx';
import { useTripPlanner } from './hooks/useTripPlanner.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { checkServerHealthApi } from './lib/api.js';

export function App() {
  // Default to clean, professional light theme
  const [theme, setTheme] = useLocalStorage('wandering_globe_ui_theme', 'light');
  const [savedTrips, setSavedTrips] = useLocalStorage('wandering_globe_saved_trips', []);
  const [clientApiKey, setClientApiKey] = useLocalStorage('wandering_globe_api_key', '');

  // UI Drawer & Modal States
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [serverHasKey, setServerHasKey] = useState(false);

  // Core Trip Planner Hook
  const {
    status,
    trip,
    error,
    historyLength,
    lastActionMessage,
    lastPrompt,
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
  } = useTripPlanner();

  // Synchronize HTML theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check server health and API key status on mount
  useEffect(() => {
    checkServerHealthApi()
      .then((data) => {
        if (data && data.hasGroqKey) {
          setServerHasKey(true);
        }
      })
      .catch((err) => {
        console.warn('Backend server health check not reachable yet:', err.message);
      });
  }, []);

  // Handle plan trip with current simulation setting
  const handlePlanTrip = (promptText) => {
    planTrip(promptText, {
      simulation: activeSimulation,
      apiKey: clientApiKey
    });
  };

  // Handle refinement with current simulation setting
  const handleRefineTrip = (refinementPrompt) => {
    refineTrip(refinementPrompt, {
      simulation: activeSimulation,
      apiKey: clientApiKey
    });
  };

  // Save Trip to Local Storage
  const handleSaveTrip = (currentTrip) => {
    if (!currentTrip) return;
    const exists = savedTrips.some(
      (t) => t.id === currentTrip.id || (t.destination === currentTrip.destination && t.tripTitle === currentTrip.tripTitle)
    );
    if (!exists) {
      const tripWithId = {
        ...currentTrip,
        id: currentTrip.id || `saved-${Date.now().toString(36)}`,
        savedAt: new Date().toISOString()
      };
      setSavedTrips((prev) => [tripWithId, ...prev]);
    }
  };

  // Check if active trip is saved
  const isCurrentTripSaved = Boolean(
    trip && savedTrips.some((t) => t.id === trip.id || (t.destination === trip.destination && t.tripTitle === trip.tripTitle))
  );

  // Delete saved trip
  const handleDeleteSavedTrip = (tripId) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  // Clear all saved trips
  const handleClearAllSaved = () => {
    if (window.confirm('Are you sure you want to remove all saved itineraries?')) {
      setSavedTrips([]);
    }
  };

  // Load a saved trip
  const handleLoadSavedTrip = (savedTrip) => {
    setTrip(savedTrip);
  };

  /**
   * Recruiter Feature: Race Condition & Stale Overwrite Test
   */
  const handleRunRaceConditionTest = useCallback(() => {
    alert(
      "Executing Race Condition Shield Test:\n\n" +
      "1. Firing Request A: 'Slow 5-day Iceland trip' (Artificially delayed by 10s)\n" +
      "2. 500ms later, firing Request B: 'Fast 3-day Paris trip'\n\n" +
      "Result: Request A is automatically aborted by AbortController. Only Request B will be rendered, proving Request A cannot overwrite Request B."
    );

    // Fire Request A with slow delay
    planTrip("Slow 5-day Iceland trip (Request A)", {
      simulation: 'slow_timeout',
      apiKey: clientApiKey
    });

    // Fire Request B 500ms later
    setTimeout(() => {
      planTrip("Fast 3-day Paris trip (Request B)", {
        simulation: null,
        apiKey: clientApiKey
      });
    }, 500);
  }, [planTrip, clientApiKey]);

  return (
    <div className="app-container">
      {/* iOS Dynamic Glass Wallpaper Background */}
      <div className="ios-wallpaper-backdrop" aria-hidden="true">
        <div className="ios-ambient-orb orb-blue" />
        <div className="ios-ambient-orb orb-purple" />
        <div className="ios-ambient-orb orb-pink" />
        <div className="ios-ambient-orb orb-orange" />
        <div className="ios-ambient-orb orb-cyan" />
        <div className="ios-ambient-orb orb-center" />
      </div>

      {/* Floating iOS Glass Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        savedTripsCount={savedTrips.length}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
        activeSimulation={activeSimulation}
        hasApiKey={serverHasKey || Boolean(clientApiKey)}
      />

      <main className="main-content">
        {/* Error State with Diagnostics and Recovery */}
        {error && (
          <ErrorState
            error={error}
            onRetry={() => handlePlanTrip(lastPrompt || 'Tokyo')}
            onLoadMockDemo={loadMockDemo}
            onDismiss={() => {}}
          />
        )}

        {/* Dedicated Loading State with Telemetry and Cancel Action */}
        {status === 'loading' && (
          <LoadingState
            onCancel={cancelRequest}
            promptText={lastPrompt}
            activeSimulation={activeSimulation}
          />
        )}

        {/* Free-form Prompt Input Card */}
        {!trip && status !== 'loading' && (
          <PromptInput
            onGenerate={handlePlanTrip}
            onCancel={cancelRequest}
            isLoading={status === 'loading'}
            activeSimulation={activeSimulation}
            onRunRaceConditionTest={handleRunRaceConditionTest}
            theme={theme}
          />
        )}

        {/* Generated Interactive Result View */}
        {trip && (
          <ResultView
            trip={trip}
            onRefine={handleRefineTrip}
            onCancelRefine={cancelRequest}
            isRefining={status === 'refining'}
            onReorderStops={reorderStops}
            onMoveStopToDay={moveStopToDay}
            onRemoveStop={removeStop}
            onAddStop={addCustomStop}
            onEditStop={editStop}
            onUndo={undoLastAction}
            historyLength={historyLength}
            lastActionMessage={lastActionMessage}
            onSaveTrip={handleSaveTrip}
            isSaved={isCurrentTripSaved}
            onNewTrip={resetPlanner}
          />
        )}
      </main>

      {/* Apple iOS Glass Footer */}
      <Footer
        onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
      />

      {/* Recruiter Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        activeSimulation={activeSimulation}
        onSelectSimulation={setActiveSimulation}
        onRunRaceConditionTest={handleRunRaceConditionTest}
      />

      {/* Saved Trips Drawer */}
      <SavedTripsDrawer
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        savedTrips={savedTrips}
        onLoadTrip={handleLoadSavedTrip}
        onDeleteTrip={handleDeleteSavedTrip}
        onClearAll={handleClearAllSaved}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={clientApiKey}
        onSaveApiKey={setClientApiKey}
        serverHasKey={serverHasKey}
      />
    </div>
  );
}
