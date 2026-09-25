import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X, Check, AlertCircle } from 'lucide-react';

export function ApiKeyModal({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey,
  serverHasKey
}) {
  const [apiKeyInput, setApiKeyInput] = useState(currentApiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(apiKeyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKeyInput('');
    onSaveApiKey('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container api-key-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge">
              <Key size={20} />
            </div>
            <div>
              <h3>Groq API Configuration</h3>
              <p className="modal-sub">
                WanderForge routes LLM requests through a secure Node proxy. Keys are never exposed to public browsers.
              </p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="api-key-status-box">
          <div className="status-indicator">
            <span className={`status-dot ${serverHasKey || currentApiKey ? 'active' : 'demo'}`} />
            <span>
              {serverHasKey
                ? 'Server .env key detected & active'
                : currentApiKey
                ? 'Client session key configured'
                : 'Demo / Mock mode active (No key needed)'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="api-form">
          <div className="form-field full-width">
            <label>
              Groq API Key (Optional if configured in server <code>.env</code>)
            </label>
            <input
              type="password"
              placeholder="gsk_..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="key-input"
            />
          </div>

          <div className="groq-free-info">
            <ShieldCheck size={16} className="text-green" />
            <div>
              <strong>Need a free API key?</strong>
              <p>
                Groq offers generous free tiers for Llama 3 models with instant tokens/sec.{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Get your free Groq key here <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          <div className="modal-actions-row">
            {currentApiKey && (
              <button
                type="button"
                className="btn btn-ghost text-danger btn-sm"
                onClick={handleClear}
              >
                Clear Key
              </button>
            )}

            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary btn-sm">
              {saveSuccess ? (
                <>
                  <Check size={15} /> Saved!
                </>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
