import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Compass,
  ArrowRight,
  Flame,
  XCircle,
  ShieldCheck,
  Cpu,
  Layers,
  DollarSign,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Plane,
  Zap,
  TrendingUp,
  Activity,
  CloudSun,
  Coins,
  RefreshCw,
  Navigation
} from 'lucide-react';
import { SAMPLE_PROMPTS } from '../utils/mockData.js';
import { HeroRadarCanvas } from './HeroRadarCanvas.jsx';

export function TripInput({
  onGenerate,
  onCancel,
  isLoading,
  activeSimulation,
  onRunRaceConditionTest,
  theme = 'light'
}) {
  const [prompt, setPrompt] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('3 days');
  const [selectedStyle, setSelectedStyle] = useState('Balanced Explorer');

  // Quick Inspiration Presets
  const INSPIRATION_PRESETS = [
    {
      emoji: '🌸',
      label: 'Kyoto Zen & Shrines',
      prompt: '4 days in Kyoto. Tranquil moss shrines, Arashiyama bamboo grove, traditional tea ceremonies, Fushimi Inari sunrise, and Pontocho alley dining.',
      duration: '4 days',
      style: 'Cultural & Heritage'
    },
    {
      emoji: '🗼',
      label: 'Tokyo Cyberpunk & Food',
      prompt: '3 days in Tokyo. Tsukiji morning fish market, Akihabara tech district, Shibuya Sky sunset, Omoide Yokocho yakitori, and TeamLab Borderless.',
      duration: '3 days',
      style: 'Foodie & Culinary'
    },
    {
      emoji: '🌋',
      label: 'Iceland Ring Road & Geysers',
      prompt: '5 days in Iceland. Golden Circle waterfalls, Gullfoss geysers, Reynisfjara black sand beach, glacier hike, and geothermal lagoon baths.',
      duration: '5 days',
      style: 'Adventure & Outdoors'
    },
    {
      emoji: '🥐',
      label: 'Paris Art & Montmartre',
      prompt: '3 days in Paris. Montmartre secret bakeries, Musée d’Orsay impressionist art, Seine sunset cruise, Latin Quarter bookshops, and bistro dining.',
      duration: '3 days',
      style: 'Relaxed & Scenic'
    },
    {
      emoji: '🌴',
      label: 'Bali Sanctuary & Waterfalls',
      prompt: '4 days in Bali. Ubud monkey forest sanctuary, Tegalalang rice terraces, sunrise yoga, Uluwatu clifftop temple, and beach sunset dinner.',
      duration: '4 days',
      style: 'Relaxed & Scenic'
    }
  ];

  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
    setSelectedDuration(preset.duration);
    setSelectedStyle(preset.style);
    const inputEl = document.getElementById('trip-prompt-input');
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectSample = (sampleText) => {
    setPrompt(sampleText);
    const inputEl = document.getElementById('trip-prompt-input');
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    let finalPrompt = prompt.trim();
    if (!finalPrompt.toLowerCase().includes('day') && selectedDuration) {
      finalPrompt = `${selectedDuration} trip. ${finalPrompt}`;
    }
    if (selectedStyle && !finalPrompt.toLowerCase().includes(selectedStyle.toLowerCase())) {
      finalPrompt = `${finalPrompt} (Style: ${selectedStyle})`;
    }

    onGenerate(finalPrompt);
  };

  return (
    <div className="trip-input-hero-wrapper">
      {/* Background Interactive Flight Radar Canvas */}
      <HeroRadarCanvas theme={theme} />

      {/* Central Editorial Hero Header */}
      <header className="hero-editorial-header">
        <div className="hero-pill-badge">
          <span className="pulsing-live-dot" />
          <Sparkles size={13} className="sparkle-icon" />
          <span> Apple Intelligence • Travel Studio OS 18</span>
        </div>

        <h1 className="hero-monumental-title">
          Where will curiosity <span className="gradient-text-accent">lead you?</span>
        </h1>

        <p className="hero-monumental-subtitle">
          Describe any dream expedition in free-form language — ancient moss shrines, hidden culinary bistros,
          scenic alpine roadtrips, or strict budget boundaries. Wandering Globe synthesizes unstructured
          intent into a resilient, interactive day-by-day itinerary with live budget telemetry.
        </p>

        {/* Live Metric Ribbon */}
        <div className="hero-metric-ribbon">
          <div className="ribbon-item">
            <Zap size={13} className="text-amber" />
            <span>0.4s Groq LPU Inference</span>
          </div>
          <span className="ribbon-sep">•</span>
          <div className="ribbon-item">
            <ShieldCheck size={13} className="text-blue" />
            <span>Strict Schema Self-Healing</span>
          </div>
          <span className="ribbon-sep">•</span>
          <div className="ribbon-item">
            <DollarSign size={13} className="text-green" />
            <span>Real-time Dynamic Telemetry</span>
          </div>
          <span className="ribbon-sep">•</span>
          <div className="ribbon-item">
            <Flame size={13} className="text-orange" />
            <span>Stale Overwrite Shield</span>
          </div>
        </div>

        {/* Quick Inspiration Sparks Pills */}
        <div className="hero-inspiration-sparks-row" aria-label="Inspiration Presets">
          <span className="sparks-lead-label">Quick Sparks:</span>
          {INSPIRATION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="inspiration-spark-pill"
              onClick={() => handleSelectPreset(preset)}
              title={`Load: ${preset.prompt}`}
            >
              <span className="spark-emoji">{preset.emoji}</span>
              <span className="spark-text">{preset.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Panoramic Studio Grid (Side Telemetry Framing Central Command) */}
      <div className="panoramic-studio-grid">
        {/* Left Side: Apple Live Activity Transit Card */}
        <aside className="studio-side-widget widget-flight-telemetry" aria-label="Flight Telemetry">
          <div className="widget-glass-card">
            <div className="widget-header">
              <div className="widget-header-left">
                <Plane size={14} className="text-ios-blue animate-pulse-gentle" />
                <span className="widget-title">Transit Telemetry</span>
              </div>
              <span className="live-status-pill">
                <span className="live-pulse-dot" /> Live
              </span>
            </div>

            <div className="widget-flight-body">
              <div className="flight-route-display">
                <div className="station-endpoint">
                  <span className="airport-iata">HND</span>
                  <span className="station-city-sub">Tokyo Haneda</span>
                </div>

                <div className="flight-progress-indicator">
                  <div className="flight-line-track">
                    <span className="track-bullet start" />
                    <span className="track-dashed-line" />
                    <div className="plane-transit-marker">
                      <Plane size={11} className="plane-icon-traveling" />
                    </div>
                    <span className="track-bullet end" />
                  </div>
                  <span className="track-status-caption">Tokaido Shinkansen N700S</span>
                </div>

                <div className="station-endpoint right">
                  <span className="airport-iata">KIX</span>
                  <span className="station-city-sub">Osaka Kansai</span>
                </div>
              </div>

              <div className="widget-telemetry-stats">
                <div className="t-stat-item">
                  <span className="t-stat-label">Departure</span>
                  <span className="t-stat-value font-semibold">08:30 JST</span>
                </div>
                <div className="t-stat-item">
                  <span className="t-stat-label">Status</span>
                  <span className="t-stat-value text-green font-semibold">On Time</span>
                </div>
                <div className="t-stat-item">
                  <span className="t-stat-label">Gate</span>
                  <span className="t-stat-value font-semibold">Track 14</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Main Command Center Card */}
        <main id="trip-command-card" className="trip-command-card">
          <form onSubmit={handleSubmit} className="command-form">
            {/* Prompt Entry Area */}
            <div className="command-textarea-wrapper">
              <textarea
                id="trip-prompt-input"
                className="command-textarea"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 4 days in Kyoto and Tokyo. We love tranquil moss shrines, Tsukiji morning food markets, matcha tea ceremonies, and neon night street photography on a moderate budget..."
                disabled={isLoading}
              />

              <div className="textarea-utility-bar">
                <div className="utility-left">
                  <span className="char-badge">{prompt.length} chars</span>
                  <span className="kbd-shortcut-hint">Press <kbd>⌘</kbd> + <kbd>Enter</kbd> to plan</span>
                </div>
                {prompt.length > 0 && !isLoading && (
                  <button
                    type="button"
                    className="clear-link-btn"
                    onClick={() => setPrompt('')}
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>

            {/* Configuration Controls Bar */}
            <div className="command-filters-panel">
              {/* Duration Selector */}
              <div className="filter-block">
                <span className="filter-label">
                  <Calendar size={13} /> Duration:
                </span>
                <div className="ios-segmented-control">
                  {['2 days', '3 days', '4 days', '5 days', '7 days'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      className={`ios-segment-btn ${selectedDuration === dur ? 'is-active' : ''}`}
                      onClick={() => setSelectedDuration(dur)}
                      disabled={isLoading}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Vibe Selector */}
              <div className="filter-block">
                <span className="filter-label">
                  <Compass size={13} /> Travel Vibe:
                </span>
                <div className="ios-segmented-control">
                  {[
                    { id: 'Balanced Explorer', label: '⚖️ Balanced' },
                    { id: 'Cultural & Heritage', label: '⛩️ Cultural' },
                    { id: 'Foodie & Culinary', label: '🍜 Culinary' },
                    { id: 'Adventure & Outdoors', label: '🏔️ Adventure' },
                    { id: 'Relaxed & Scenic', label: '☕ Relaxed' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      className={`ios-segment-btn ${selectedStyle === style.id ? 'is-active' : ''}`}
                      onClick={() => setSelectedStyle(style.id)}
                      disabled={isLoading}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="command-actions-row">
              {isLoading ? (
                <div className="loading-state-banner">
                  <div className="loading-spinner-ring" />
                  <div className="loading-text-stack">
                    <span className="loading-primary-text">
                      Synthesizing structured itinerary schema with Groq LLM...
                    </span>
                    <span className="loading-sub-text">
                      Validating JSON boundaries, assigning coordinate data, and calculating budget telemetry
                    </span>
                  </div>
                  <button
                    type="button"
                    id="cancel-request-btn"
                    className="cancel-abort-btn"
                    onClick={onCancel}
                  >
                    <XCircle size={16} />
                    <span>Abort Request</span>
                  </button>
                </div>
              ) : (
                <div className="submit-cluster">
                  <button
                    type="submit"
                    id="generate-trip-btn"
                    className="btn-launch-itinerary"
                    disabled={!prompt.trim()}
                  >
                    <Globe size={18} />
                    <span>Chart My Itinerary</span>
                    <ArrowRight size={18} />
                  </button>

                  {onRunRaceConditionTest && (
                    <button
                      type="button"
                      id="test-race-condition-btn"
                      className="btn-race-test"
                      onClick={onRunRaceConditionTest}
                      title="Fires 2 rapid requests (Request A slow, Request B fast) to verify Request A is aborted and cannot overwrite Request B."
                    >
                      <Flame size={15} />
                      <span>Test Stale Overwrite Shield</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </form>
        </main>

        {/* Right Side: Live Currency & Destination Weather Card */}
        <aside className="studio-side-widget widget-destination-telemetry" aria-label="Destination Telemetry">
          <div className="widget-glass-card">
            <div className="widget-header">
              <div className="widget-header-left">
                <Coins size={14} className="text-ios-purple animate-pulse-gentle" />
                <span className="widget-title">Budget & Telemetry</span>
              </div>
              <span className="auto-balance-pill">Auto</span>
            </div>

            <div className="widget-budget-body">
              <div className="budget-headline-metric">
                <span className="budget-primary-number">$1,255</span>
                <span className="budget-currency-code">USD</span>
                <span className="budget-fx-rate">≈ ¥192,500</span>
              </div>

              {/* Progress Segments */}
              <div className="widget-progress-track">
                <div className="progress-seg seg-blue" style={{ width: '32%' }} title="Activities (32%)" />
                <div className="progress-seg seg-orange" style={{ width: '28%' }} title="Dining & Food (28%)" />
                <div className="progress-seg seg-green" style={{ width: '25%' }} title="Hotels & Stays (25%)" />
                <div className="progress-seg seg-purple" style={{ width: '15%' }} title="Transit (15%)" />
              </div>

              {/* Destination Weather & Conditions */}
              <div className="destination-live-weather">
                <div className="weather-chip">
                  <CloudSun size={13} className="text-amber" />
                  <span>Tokyo: 18°C Clear</span>
                </div>
                <div className="weather-chip">
                  <Activity size={13} className="text-ios-green" />
                  <span>4 Days • 2 Free Stops</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Recruiter Engineering Architecture Pillars */}
      <section id="architecture-pillars" className="architecture-pillars-section" aria-label="Technical Highlights">
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-wrapper shield">
              <ShieldCheck size={18} />
            </div>
            <div className="pillar-body">
              <h4 className="pillar-title">Schema Self-Healing</h4>
              <p className="pillar-desc">
                Multi-pass syntax parser strips LLM code fences, repairs unclosed brackets, and enforces schema integrity.
              </p>
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrapper cpu">
              <Cpu size={18} />
            </div>
            <div className="pillar-body">
              <h4 className="pillar-title">Zero-Leak Backend Proxy</h4>
              <p className="pillar-desc">
                Groq API keys are strictly retained on an Express server proxy with automatic client fallback mode.
              </p>
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrapper flame">
              <Flame size={18} />
            </div>
            <div className="pillar-body">
              <h4 className="pillar-title">Race Condition Shield</h4>
              <p className="pillar-desc">
                AbortController cancellation & monotonic request IDs discard slow out-of-order network responses.
              </p>
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrapper telemetry">
              <DollarSign size={18} />
            </div>
            <div className="pillar-body">
              <h4 className="pillar-title">Live Budget Telemetry</h4>
              <p className="pillar-desc">
                Dynamic cost aggregation recalculates instantly as users reorder, edit, or delete itinerary stops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Editorial Destination Cards */}
      <section id="curated-destinations" className="curated-destinations-section">
        <div className="section-title-row">
          <div>
            <h3 className="section-heading">Curated Expedition Benchmarks</h3>
            <p className="section-subheading">
              Select a pre-configured scenario to benchmark structured JSON generation in real-time.
            </p>
          </div>
        </div>

        <div className="destinations-showcase-grid">
          {SAMPLE_PROMPTS.map((dest) => (
            <div
              key={dest.id}
              className="curated-destination-card"
              onClick={() => handleSelectSample(dest.text)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectSample(dest.text);
                }
              }}
            >
              <div className="card-top-row">
                <span className="card-flag-emblem">{dest.emoji}</span>
                <div className="card-badge-cluster">
                  <span className="dest-tag-duration">{dest.duration}</span>
                  <span className="dest-tag-vibe">{dest.vibe}</span>
                </div>
              </div>

              <div className="card-middle-content">
                <h4 className="card-dest-title">{dest.title}</h4>
                <p className="card-dest-tagline">{dest.tagline}</p>
              </div>

              <div className="card-bottom-row">
                <span className="card-load-action">
                  Load Expedition <ArrowRight size={14} />
                </span>
                <span className="country-label">{dest.country}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
