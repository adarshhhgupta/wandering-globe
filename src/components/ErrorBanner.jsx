import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  HelpCircle
} from 'lucide-react';

export function ErrorBanner({
  error,
  onRetry,
  onLoadMockDemo,
  onDismiss
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!error) return null;

  // Categorize error for clear user guidance
  let errorCategory = 'Model Generation Error';
  let advice = 'You can retry the request or load a verified demo itinerary.';

  if (error.code === 'MALFORMED_OUTPUT' || error.message.toLowerCase().includes('malformed')) {
    errorCategory = 'Malformed AI JSON Syntax';
    advice = 'The language model returned text that violated strict JSON syntax. WanderForge\'s client repair attempted recovery, but the syntax was too corrupted.';
  } else if (error.code === 'SCHEMA_VALIDATION_ERROR' || error.message.toLowerCase().includes('schema') || error.message.toLowerCase().includes('days')) {
    errorCategory = 'Schema Shape Mismatch';
    advice = 'The AI produced JSON, but missing required structural fields (such as the days array or stop parameters).';
  } else if (error.code === 'RATE_LIMIT' || error.message.toLowerCase().includes('rate limit')) {
    errorCategory = 'Groq Rate Limit Reached';
    advice = 'Groq\'s free tier rate limit was reached. Please wait a few seconds or switch to Mock Demo mode.';
  } else if (error.code === 'USER_CANCELLED') {
    errorCategory = 'Request Cancelled';
    advice = 'The in-flight request was terminated via AbortController before completion.';
  }

  return (
    <div className="error-banner-card" role="alert">
      <div className="error-banner-content">
        <div className="error-icon-box">
          <AlertTriangle size={24} className="alert-icon" />
        </div>

        <div className="error-text-block">
          <div className="error-header-row">
            <span className="error-category-pill">{errorCategory}</span>
            <span className="error-timestamp">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          <h3 className="error-title">
            {error.message || 'An error occurred while communicating with the AI model.'}
          </h3>

          <p className="error-advice">{advice}</p>

          {/* Action Buttons */}
          <div className="error-actions-row">
            {error.canRetry && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onRetry}
                id="error-retry-btn"
              >
                <RotateCcw size={14} />
                <span>Retry Generation</span>
              </button>
            )}

            {error.canFallbackToMock && (
              <button
                type="button"
                className="btn btn-secondary-subtle btn-sm"
                onClick={onLoadMockDemo}
                id="error-demo-btn"
              >
                <Sparkles size={14} />
                <span>Load Verified Demo Itinerary</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            >
              {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>{showTechnicalDetails ? 'Hide Diagnostics' : 'View Diagnostics'}</span>
            </button>
          </div>

          {/* Technical Diagnostics */}
          {showTechnicalDetails && (
            <div className="error-diagnostics-box">
              <div className="diag-line">
                <strong>Error Code:</strong> {error.code || 'UNKNOWN'}
              </div>
              <div className="diag-line">
                <strong>Raw Message:</strong> {error.message}
              </div>
              {error.details && (
                <pre className="diag-code">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
