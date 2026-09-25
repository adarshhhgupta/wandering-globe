import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, XCircle } from 'lucide-react';
import { REFINEMENT_PRESETS } from '../utils/mockData.js';

export function RefinementBar({
  onRefine,
  onCancel,
  isRefining
}) {
  const [refinementInput, setRefinementInput] = useState('');

  const handleRefineSubmit = (e) => {
    e.preventDefault();
    if (!refinementInput.trim() || isRefining) return;
    onRefine(refinementInput.trim());
    setRefinementInput('');
  };

  const handleSelectPreset = (presetText) => {
    onRefine(presetText);
  };

  return (
    <div className="refinement-dock-container">
      <div className="refinement-card">
        <div className="refinement-header-row">
          <div className="refinement-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI Refinement Loop (Preserves existing structure)</span>
          </div>
          <span className="refinement-hint">
            Directly edits current days & stops without regenerating from scratch
          </span>
        </div>

        {/* Refinement Prompt Form */}
        <form onSubmit={handleRefineSubmit} className="refinement-form">
          <input
            id="refinement-prompt-input"
            type="text"
            className="refinement-text-input"
            placeholder="e.g. 'Replace dinner on Day 2 with authentic street ramen', 'Add a sunrise viewpoint on Day 1'..."
            value={refinementInput}
            onChange={(e) => setRefinementInput(e.target.value)}
            disabled={isRefining}
          />

          {isRefining ? (
            <button
              type="button"
              className="btn btn-danger-outline btn-sm"
              onClick={onCancel}
              title="Abort refinement request"
            >
              <XCircle size={15} />
              <span>Cancel</span>
            </button>
          ) : (
            <button
              type="submit"
              id="refine-submit-btn"
              className="btn btn-primary btn-sm"
              disabled={!refinementInput.trim()}
            >
              <Send size={14} />
              <span>Refine Itinerary</span>
            </button>
          )}
        </form>

        {/* Quick Refinement Chips */}
        <div className="refinement-chips-row">
          <span className="chips-label">Quick Suggestions:</span>
          <div className="chips-scroll">
            {REFINEMENT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="refine-preset-chip"
                onClick={() => handleSelectPreset(preset)}
                disabled={isRefining}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
