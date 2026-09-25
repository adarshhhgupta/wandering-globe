import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  BookmarkCheck,
  Key,
  ShieldCheck,
  Sun,
  Moon,
  Cpu,
  Compass,
  Layers,
  Plane,
  Clock,
  ChevronDown,
  Wifi,
  Radio,
  CheckCircle2
} from 'lucide-react';

export function Header({
  theme,
  setTheme,
  savedTripsCount,
  onOpenSavedTrips,
  onOpenApiKeyModal,
  onOpenSimulationModal,
  activeSimulation,
  hasApiKey
}) {
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const [currentUtcTime, setCurrentUtcTime] = useState('');

  // Real-time UTC/JST Live Clock in Header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Tokyo Time (JST = UTC+9)
      const tokyoHours = (now.getUTCHours() + 9) % 24;
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentUtcTime(`${String(tokyoHours).padStart(2, '0')}:${minutes}:${seconds} JST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dismiss Dynamic Island when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.dynamic-island-wrapper')) {
        setIsIslandExpanded(false);
      }
    };
    if (isIslandExpanded) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isIslandExpanded]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Identity */}
        <div
          className="header-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-frame">
            <Globe className="brand-icon-globe" size={20} />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-line">
              <span className="brand-main-title">Wandering Globe</span>
              <span className="brand-version-pill">AI Studio</span>
            </div>
            <p className="brand-descriptor">Autonomous Itinerary Architect & Travel Engine</p>
          </div>
        </div>

        {/* Apple Dynamic Island Live Activity Pill (Interactive) */}
        <div className="dynamic-island-wrapper">
          <div
            className={`dynamic-island-capsule ${isIslandExpanded ? 'is-expanded' : ''}`}
            onClick={() => setIsIslandExpanded(!isIslandExpanded)}
            role="button"
            tabIndex={0}
            title="Click to toggle Dynamic Island Live Telemetry"
          >
            <div className="capsule-content-compact">
              <span className="island-radar-dot" />
              <Plane size={13} className="island-plane-icon" />
              <span className="island-flight-tag">NH-107 • HND → KIX</span>
              <span className="island-pill-divider">|</span>
              <Clock size={11} className="island-clock-icon" />
              <span className="island-time-tag">{currentUtcTime || '21:42 JST'}</span>
              <ChevronDown
                size={12}
                className={`island-chevron ${isIslandExpanded ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Expanded Dynamic Island Flyout Panel */}
            {isIslandExpanded && (
              <div
                className="dynamic-island-flyout"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flyout-header-row">
                  <div className="flyout-flight-title">
                    <Plane size={15} className="text-ios-blue" />
                    <div>
                      <span className="flyout-airline">All Nippon Airways • NH 107</span>
                      <span className="flyout-aircraft">Boeing 787-9 Dreamliner</span>
                    </div>
                  </div>
                  <span className="flyout-status-badge">In Flight • On Time</span>
                </div>

                <div className="flyout-route-meter">
                  <div className="meter-col left">
                    <span className="station-code">HND</span>
                    <span className="station-city">Tokyo Haneda</span>
                    <span className="gate-info">Gate 64 • Dep 08:30</span>
                  </div>
                  <div className="meter-track-center">
                    <div className="track-bar">
                      <div className="track-fill" style={{ width: '64%' }} />
                      <Plane size={12} className="track-plane-indicator" style={{ left: '62%' }} />
                    </div>
                    <span className="estimated-landing">Landing in 38m</span>
                  </div>
                  <div className="meter-col right">
                    <span className="station-code">KIX</span>
                    <span className="station-city">Osaka Kansai</span>
                    <span className="gate-info">Gate 19 • Arr 09:45</span>
                  </div>
                </div>

                <div className="flyout-telemetry-grid">
                  <div className="telemetry-box">
                    <span className="t-label">Altitude</span>
                    <span className="t-val">34,000 FT</span>
                  </div>
                  <div className="telemetry-box">
                    <span className="t-label">Ground Speed</span>
                    <span className="t-val">542 KTS</span>
                  </div>
                  <div className="telemetry-box">
                    <span className="t-label">Tokyo Weather</span>
                    <span className="t-val">18°C 🌤️ Clear</span>
                  </div>
                  <div className="telemetry-box">
                    <span className="t-label">Groq LPU Latency</span>
                    <span className="t-val text-green font-bold">0.38s (Active)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Quick Navigation Links */}
        <nav className="header-nav-center" aria-label="Quick Navigation">
          <button
            type="button"
            className="nav-glass-link"
            onClick={() => scrollToSection('trip-prompt-input')}
          >
            Studio
          </button>
          <button
            type="button"
            className="nav-glass-link"
            onClick={() => scrollToSection('curated-destinations')}
          >
            Expeditions
          </button>
          <button
            type="button"
            className="nav-glass-link"
            onClick={() => scrollToSection('architecture-pillars')}
          >
            Architecture
          </button>
          <button
            type="button"
            className="nav-glass-link"
            onClick={() => scrollToSection('world-clocks-section')}
          >
            Live Radar
          </button>
        </nav>

        {/* Action Controls & Navigation */}
        <div className="header-actions-group">
          {/* Recruiter Resilience Lab Button */}
          <button
            id="simulation-toggle-btn"
            className={`action-chip lab-chip ${activeSimulation ? 'lab-chip-active' : ''}`}
            onClick={onOpenSimulationModal}
            title="Recruiter Lab: Simulate malformed JSON, 429 rate limits, 10s timeouts & race conditions"
          >
            <ShieldCheck size={14} />
            <span className="chip-label">
              {activeSimulation ? `Test: ${activeSimulation}` : 'AI Resilience Lab'}
            </span>
            {activeSimulation && <span className="active-ping-dot" />}
          </button>

          {/* Model Gateway Status */}
          <button
            id="api-key-btn"
            className={`action-chip ${hasApiKey ? 'key-active-chip' : 'key-demo-chip'}`}
            onClick={onOpenApiKeyModal}
            title="Groq API Key configuration and backend proxy diagnostics"
          >
            <Cpu size={14} />
            <span className="chip-label">{hasApiKey ? 'Groq Active' : 'Demo Mode'}</span>
            <span className={`status-indicator-dot ${hasApiKey ? 'online' : 'offline'}`} />
          </button>

          {/* Saved Trips Drawer Trigger */}
          <button
            id="saved-trips-btn"
            className="action-chip saved-chip"
            onClick={onOpenSavedTrips}
            title="Open saved itineraries library"
          >
            <BookmarkCheck size={14} />
            <span className="chip-label">Saved</span>
            {savedTripsCount > 0 && (
              <span className="saved-counter-badge">{savedTripsCount}</span>
            )}
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            id="theme-toggle-btn"
            className="theme-mode-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
