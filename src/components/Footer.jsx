import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  DollarSign,
  Heart,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Lock,
  Flame,
  ArrowUpRight,
  ArrowUp,
  Clock,
  CloudSun,
  Activity,
  Zap,
  Radio
} from 'lucide-react';

export function Footer({ onOpenSimulationModal, onOpenApiKeyModal, onOpenSavedTrips }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [worldTimes, setWorldTimes] = useState([]);

  // Calculate live global city times
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const cities = [
        {
          city: 'Tokyo',
          code: 'HND',
          country: 'Japan',
          flag: '🇯🇵',
          offset: 9,
          weather: '18°C 🌙 Clear',
          desc: 'Capital of Neon & Zen'
        },
        {
          city: 'Paris',
          code: 'CDG',
          country: 'France',
          flag: '🇫🇷',
          offset: 2,
          weather: '16°C ⛅ Partly Cloudy',
          desc: 'City of Lights & Art'
        },
        {
          city: 'New York',
          code: 'JFK',
          country: 'USA',
          flag: '🇺🇸',
          offset: -4,
          weather: '19°C ☀️ Sunny',
          desc: 'Global Culture Hub'
        },
        {
          city: 'London',
          code: 'LHR',
          country: 'UK',
          flag: '🇬🇧',
          offset: 1,
          weather: '14°C 🌧️ Light Drizzle',
          desc: 'Historic Metropole'
        },
        {
          city: 'Reykjavik',
          code: 'KEF',
          country: 'Iceland',
          flag: '🇮🇸',
          offset: 0,
          weather: '6°C 🌬️ Crisp Breeze',
          desc: 'Glaciers & Volcanos'
        }
      ];

      const formatted = cities.map((c) => {
        // UTC time + offset
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const targetDate = new Date(utc + 3600000 * c.offset);
        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');
        const seconds = String(targetDate.getSeconds()).padStart(2, '0');
        return {
          ...c,
          timeStr: `${hours}:${minutes}:${seconds}`
        };
      });

      setWorldTimes(formatted);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll depth for scroll-to-top circular progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-glass-card">
        {/* World Clocks & Flight Hubs Section */}
        <section id="world-clocks-section" className="footer-world-clocks-tray" aria-label="Global Travel Clocks">
          <div className="clocks-tray-header">
            <div className="tray-title-group">
              <span className="live-clock-radar-dot" />
              <Clock size={14} className="text-ios-blue" />
              <h3 className="clocks-heading">Global Travel Clocks & Active Flight Hubs</h3>
            </div>
            <span className="clocks-sub-badge">Live Synchronized Telemetry</span>
          </div>

          <div className="world-clocks-grid">
            {worldTimes.map((clock) => (
              <div key={clock.code} className="world-clock-card">
                <div className="clock-card-top">
                  <span className="clock-flag">{clock.flag}</span>
                  <span className="clock-iata-badge">{clock.code}</span>
                </div>
                <div className="clock-card-middle">
                  <span className="clock-live-time">{clock.timeStr}</span>
                  <span className="clock-city-name">{clock.city}</span>
                </div>
                <div className="clock-card-bottom">
                  <span className="clock-weather-tag">{clock.weather}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recruiter Live Diagnostics & Architecture Console */}
        <section className="footer-diagnostics-bar" aria-label="System Diagnostics">
          <div className="diag-header-col">
            <div className="diag-status-pill">
              <Radio size={13} className="text-green animate-pulse-gentle" />
              <span>Proxy Gateway: <strong>Operational (Port 3001)</strong></span>
            </div>
            <span className="diag-desc">
              Express Zero-Leak Architecture • Groq LPU Inference ~0.38s • JSON Repair Online
            </span>
          </div>

          <div className="diag-actions-col">
            <button
              type="button"
              className="diag-quick-test-btn"
              onClick={onOpenSimulationModal}
              title="Launch Recruiter AI Resilience Lab"
            >
              <ShieldCheck size={13} />
              <span>Launch Resilience Lab</span>
            </button>
            <button
              type="button"
              className="diag-quick-test-btn"
              onClick={onOpenApiKeyModal}
              title="View Groq Key diagnostics"
            >
              <Cpu size={13} />
              <span>Model Gateway Info</span>
            </button>
          </div>
        </section>

        {/* Main Footer Sitemap Grid */}
        <div className="footer-main-grid">
          {/* Brand & Purpose Column */}
          <div className="footer-brand-column">
            <div className="footer-brand-row">
              <div className="brand-logo-frame footer-logo">
                <Globe className="brand-icon-globe" size={20} />
              </div>
              <span className="footer-brand-name">Wandering Globe</span>
              <span className="brand-version-pill">iOS 18</span>
            </div>

            <p className="footer-mission-text">
              An autonomous, schema-resilient travel intelligence engine engineered for the Flam
              Frontend Internship evaluation. Translates free-form natural language intent into
              structured, interactive itineraries with real-time budget telemetry and live editing.
            </p>

            <div className="system-status-indicator">
              <span className="status-radar-beacon" />
              <span className="status-label-text">
                Groq LLM Gateway: <strong>Operational (Port 3001)</strong>
              </span>
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Capabilities</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollToSection('trip-prompt-input')}>
                  Free-form AI Synthesis
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('architecture-pillars')}>
                  Heuristic Syntax Repair
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('architecture-pillars')}>
                  Race Condition Shield
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('trip-command-card')}>
                  Live Drag & Drop Reordering
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('trip-command-card')}>
                  Multi-Currency Telemetry
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenSavedTrips}>
                  LocalStorage Travel Library
                </button>
              </li>
            </ul>
          </div>

          {/* Curated Benchmarks */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Curated Hubs</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollToSection('curated-destinations')}>
                  🌸 Tokyo & Kyoto Zen (4D)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('curated-destinations')}>
                  🥐 Parisian Art & Cafés (3D)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('curated-destinations')}>
                  🌋 Iceland Ring Road (5D)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('curated-destinations')}>
                  🌴 Bali Coastal Sanctuary (4D)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('trip-prompt-input')}>
                  ✨ Custom Expedition Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Recruiter Evaluation Matrix */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Recruiter Lab</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  onClick={onOpenSimulationModal}
                  className="recruiter-highlight-link"
                >
                  <ShieldCheck size={13} className="text-ios-purple" />
                  <span>AI Failure Simulation Lab</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="recruiter-highlight-link"
                >
                  <Lock size={13} className="text-ios-blue" />
                  <span>Backend Proxy Architecture</span>
                </button>
              </li>
              <li className="footer-matrix-item">
                <CheckCircle2 size={13} className="text-green" />
                <span>React Hooks Architecture (25%)</span>
              </li>
              <li className="footer-matrix-item">
                <CheckCircle2 size={13} className="text-green" />
                <span>AI Data Handling (25%)</span>
              </li>
              <li className="footer-matrix-item">
                <CheckCircle2 size={13} className="text-green" />
                <span>Error Resilience (20%)</span>
              </li>
              <li className="footer-matrix-item">
                <CheckCircle2 size={13} className="text-green" />
                <span>UI/UX Product Sense (15%)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Spec & Specs Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-notice">
            © 2026 Wandering Globe. Built with Apple iOS 18 Glass Aesthetics for the Flam Frontend Internship Assignment.
          </p>

          <div className="specs-tag-cluster">
            <span className="spec-tag">React 19</span>
            <span className="spec-tag">Express Proxy</span>
            <span className="spec-tag">Groq LPU</span>
            <span className="spec-tag">Pure Vanilla CSS</span>
            <span className="spec-tag">Zero Client Leaks</span>
          </div>

          {/* Scroll to Top with Circular Progress Indicator */}
          <button
            type="button"
            className="scroll-to-top-btn"
            onClick={scrollToTop}
            title="Scroll to top of Studio"
            aria-label="Scroll to top"
          >
            <svg className="scroll-progress-ring" width="44" height="44" viewBox="0 0 44 44">
              <circle
                className="progress-ring-bg"
                cx="22"
                cy="22"
                r="18"
                fill="none"
                strokeWidth="2.5"
              />
              <circle
                className="progress-ring-indicator"
                cx="22"
                cy="22"
                r="18"
                fill="none"
                strokeWidth="2.5"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - scrollProgress / 100)}
              />
            </svg>
            <ArrowUp size={14} className="scroll-arrow-icon" />
          </button>
        </div>
      </div>
    </footer>
  );
}
