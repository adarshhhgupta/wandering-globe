import React from 'react';
import { Loader2, XCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';

/**
 * @file LoadingState.jsx
 * @description Dedicated Loading State Component matching Section 5 & 7 of the Flam Assignment Guide.
 * 
 * Provides:
 * - Active indeterminate progress animation with heavy backdrop blur
 * - Transparent status indicators (Groq LPU inference, schema healing, budget aggregation)
 * - User-facing Cancel button wired to AbortController to prevent hung requests
 */
export function LoadingState({ onCancel, promptText, activeSimulation }) {
  return (
    <div className="loading-state-card" role="status" aria-live="polite">
      <div className="loading-spinner-wrapper">
        <Loader2 className="spinner-icon animate-spin" size={36} />
        <div className="loading-pulsing-rings" />
      </div>

      <div className="loading-text-content">
        <h3 className="loading-title">
          Synthesizing Expedition Itinerary
          <span className="loading-dots">...</span>
        </h3>
        
        {promptText && (
          <p className="loading-prompt-preview">
            &ldquo;{promptText.length > 90 ? promptText.slice(0, 90) + '...' : promptText}&rdquo;
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
            >
              <XCircle size={15} />
              <span>Cancel Request</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
