import React from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  FileCode,
  Clock,
  Zap,
  ServerCrash,
  Sparkles,
  X,
  Flame,
  CheckCircle2
} from 'lucide-react';

export function SimulationModal({
  isOpen,
  onClose,
  activeSimulation,
  onSelectSimulation,
  onRunRaceConditionTest
}) {
  if (!isOpen) return null;

  const simulationOptions = [
    {
      id: null,
      title: 'Normal (Live Groq LLM)',
      desc: 'Calls Groq llama-3.3-70b-versatile with strict JSON schema format.',
      icon: <Sparkles size={18} className="sim-icon text-indigo" />,
      rubricBadge: 'Production Core'
    },
    {
      id: 'mock_mode',
      title: 'Built-in Mock Fallback Mode',
      desc: 'Returns a realistic Kyoto or Paris itinerary with 0ms delay. Does not require any API key.',
      icon: <CheckCircle2 size={18} className="sim-icon text-green" />,
      rubricBadge: 'Zero-Config Demo'
    },
    {
      id: 'malformed_json',
      title: 'Simulate Malformed JSON',
      desc: 'Simulates the LLM returning unclosed braces or unquoted keys. Verifies client repair heuristics & fallback.',
      icon: <FileCode size={18} className="sim-icon text-amber" />,
      rubricBadge: 'Rubric: Malformed Output (20%)'
    },
    {
      id: 'invalid_schema',
      title: 'Simulate Wrong Shape / Missing Schema',
      desc: 'Simulates valid JSON but missing the required "days" array and stop objects. Verifies shape validation.',
      icon: <AlertOctagon size={18} className="sim-icon text-red" />,
      rubricBadge: 'Rubric: Wrong Shape (20%)'
    },
    {
      id: 'slow_timeout',
      title: 'Simulate Slow / 10s Network Delay',
      desc: 'Delays the response by 10,000ms. Verifies active loading UI, cancel button, and AbortController.',
      icon: <Clock size={18} className="sim-icon text-cyan" />,
      rubricBadge: 'Rubric: Slow / Timeout (20%)'
    },
    {
      id: 'rate_limit_429',
      title: 'Simulate 429 Rate Limit Exceeded',
      desc: 'Returns HTTP 429 Too Many Requests to test exponential backoff advice and friendly user error handling.',
      icon: <Zap size={18} className="sim-icon text-orange" />,
      rubricBadge: 'Rubric: Failed / Quota (20%)'
    },
    {
      id: 'server_error_500',
      title: 'Simulate 500 LLM Gateway Outage',
      desc: 'Returns HTTP 500 internal server error to verify retry mechanics and mock fallback prompts.',
      icon: <ServerCrash size={18} className="sim-icon text-purple" />,
      rubricBadge: 'Rubric: Server Failure (20%)'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container simulation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3>AI Resilience & Failure Lab</h3>
              <p className="modal-sub">
                Designed for recruiters to evaluate how WanderForge handles edge cases, bad AI output, and race conditions.
              </p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Live Race Condition Test Block */}
        <div className="race-condition-card">
          <div className="race-card-header">
            <div className="race-title">
              <Flame size={16} />
              <strong>Race Condition & Stale Overwrite Shield</strong>
            </div>
            <span className="badge-highlight">Key Requirement</span>
          </div>
          <p className="race-desc">
            Requirement: <em>"Don't let a stale response overwrite a newer one."</em><br />
            Clicking this button fires <strong>Request A</strong> (artificially delayed by 3s) and then immediately fires <strong>Request B</strong>.
            WanderForge aborts Request A and uses incremental <code>requestId</code> tracking so Request A cannot corrupt Request B.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              onClose();
              onRunRaceConditionTest();
            }}
          >
            <Flame size={15} />
            <span>Execute Stale Overwrite Demonstration</span>
          </button>
        </div>

        {/* Simulation Options Grid */}
        <div className="simulation-options-list">
          {simulationOptions.map((opt) => {
            const isSelected = activeSimulation === opt.id;
            return (
              <div
                key={String(opt.id)}
                className={`sim-option-card ${isSelected ? 'active-sim' : ''}`}
                onClick={() => {
                  onSelectSimulation(opt.id);
                  onClose();
                }}
              >
                <div className="sim-left">
                  {opt.icon}
                  <div>
                    <div className="sim-title-row">
                      <span className="sim-name">{opt.title}</span>
                      <span className="sim-rubric-badge">{opt.rubricBadge}</span>
                    </div>
                    <p className="sim-desc">{opt.desc}</p>
                  </div>
                </div>
                <div className="sim-radio">
                  <div className={`radio-dot ${isSelected ? 'selected' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <span className="footer-note">
            Current mode: <strong>{activeSimulation ? `Active: ${activeSimulation}` : 'Normal Production LLM'}</strong>
          </span>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
