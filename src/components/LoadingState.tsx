import React, { useEffect } from 'react';
import { Loader2, XCircle, Sparkles, ShieldCheck, Zap, Compass } from 'lucide-react';

/**
 * @file LoadingState.tsx
 * @description Dedicated Loading State Component matching Section 5 & 7 of the Flam Assignment Guide.
 * 
 * Provides:
 * - Smooth viewport centering with auto-scroll to top
 * - High-polish glowing glass telemetry card with progress bar
 * - Indeterminate Groq LPU inference telemetry
 * - User-facing Cancel button wired to AbortController
 */

export interface LoadingStateProps {
  onCancel?: () => void;
  promptText?: string | null;
  activeSimulation?: string | null;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  onCancel,
  promptText,
  activeSimulation
}) => {
  // Smoothly ensure viewport is centered at the top so card is fully visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="loading-view-wrapper" role="status" aria-live="polite">
      <div className="loading-state-card">
        {/* Ambient Glowing Orb */}
        <div className="loading-ambient-glow" aria-hidden="true" />

        <div className="loading-spinner-wrapper">
          <div className="loading-pulsing-rings" />
          <Loader2 className="spinner-icon animate-spin" size={38} />
          <Compass className="spinner-center-compass" size={16} />
        </div>

        <div className="loading-text-content">
          <h3 className="loading-title">
            Synthesizing Expedition Itinerary
            <span className="loading-dots">...</span>
          </h3>

          {/* Shimmering Progress Bar */}
          <div className="loading-progress-bar-container">
            <div className="loading-progress-bar-fill" />
          </div>
          
          {promptText && (
            <p className="loading-prompt-preview">
              &ldquo;{promptText.length > 95 ? promptText.slice(0, 95) + '...' : promptText}&rdquo;
            </p>
          )}

          <div className="loading-telemetry-steps">
            <div className="loading-step-chip">
              <Zap size={13} className="text-amber" />
              <span>Groq LPU Inference (Llama 3.3 70B)</span>
            </div>
            <div className="loading-step-chip">
              <ShieldCheck size={13} className="text-blue" />
              <span>Defensive Schema Validation</span>
            </div>
            <div className="loading-step-chip">
              <Sparkles size={13} className="text-purple" />
              <span>Dynamic Telemetry Aggregation</span>
            </div>
          </div>

          {activeSimulation && (
            <div className="loading-sim-notice">
              <span>Active Test Mode: <strong>{activeSimulation}</strong></span>
            </div>
          )}

          {onCancel && (
            <div className="loading-cancel-wrapper">
              <button
                type="button"
                className="btn btn-secondary-subtle btn-sm btn-cancel-load"
                onClick={onCancel}
                id="loading-cancel-btn"
                aria-label="Cancel in-flight generation"
              >
                <XCircle size={15} />
                <span>Cancel Request</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
