import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Compass,
  Download,
  Printer,
  BookmarkPlus,
  RotateCcw,
  Sparkles,
  Luggage,
  Info,
  CheckSquare,
  Square,
  Share2,
  Check,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DaySection } from './DaySection.jsx';
import { BudgetSummary } from './BudgetSummary.jsx';
import { RefinementBar } from './RefinementBar.jsx';
import { DestinationPortal } from './DestinationPortal.jsx';

export function TripView({
  trip,
  onRefine,
  onCancelRefine,
  isRefining,
  onReorderStops,
  onMoveStopToDay,
  onRemoveStop,
  onAddStop,
  onEditStop,
  onUndo,
  historyLength,
  lastActionMessage,
  onSaveTrip,
  isSaved,
  onNewTrip
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    trip.estimatedTotalBudget?.currency || 'USD'
  );
  const [packedItems, setPackedItems] = useState({});
  const [copyFeedback, setCopyFeedback] = useState(false);

  const allDayNumbers = trip.days.map((d) => d.dayNumber);

  const togglePackItem = (idx) => {
    setPackedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSaveWithCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    onSaveTrip(trip);
  };

  const handleExportJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '-')}-wandering-globe.json`);
    dlAnchor.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const summaryText = `🌍 ${trip.tripTitle}\n📍 Destination: ${trip.destination} (${trip.durationDays} Days)\n🎒 Style: ${trip.tripStyle}\n\nGenerated with Wandering Globe AI`;
    navigator.clipboard.writeText(summaryText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  return (
    <div className="trip-view-wrapper">
      {/* Top Notification Toast for Micro-Actions */}
      {lastActionMessage && (
        <div className="action-toast-banner" role="status">
          <Sparkles size={14} className="sparkle-icon" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* Main Overview Hero with 3D Destination Portal */}
      <section className="trip-overview-hero">
        <div className="overview-split-layout">
          <div className="overview-left-content">
            <div className="overview-badges">
              <span className="badge-destination">
                <MapPin size={13} /> {trip.destination}
              </span>
              <span className="badge-style">
                <Compass size={13} /> {trip.tripStyle}
              </span>
              <span className="badge-duration">
                <Calendar size={13} /> {trip.durationDays} Days
              </span>
              {trip._isDemoMode && (
                <span className="badge-demo" title="Generated in Demo Mode">
                  Demo Mode Dataset
                </span>
              )}
            </div>

            <h1 className="trip-main-title">{trip.tripTitle}</h1>
            <p className="trip-lead-summary">{trip.summary}</p>

            {/* Action Toolbar */}
            <div className="trip-action-toolbar">
              {historyLength > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary-subtle btn-sm undo-btn"
                  onClick={onUndo}
                  title="Undo last change"
                >
                  <RotateCcw size={14} />
                  <span>Undo ({historyLength})</span>
                </button>
              )}

              <button
                type="button"
                id="save-trip-btn"
                className={`btn btn-sm ${isSaved ? 'btn-success-subtle' : 'btn-primary'}`}
                onClick={handleSaveWithCelebration}
                title="Save to your browser's local library"
              >
                <BookmarkPlus size={15} />
                <span>{isSaved ? 'Saved to Library' : 'Save Itinerary'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary-subtle btn-sm"
                onClick={handleExportJSON}
                title="Download as JSON schema file"
              >
                <Download size={14} />
                <span className="hide-mobile">JSON</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary-subtle btn-sm"
                onClick={handlePrint}
                title="Print or Save as PDF"
              >
                <Printer size={14} />
                <span className="hide-mobile">Print / PDF</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary-subtle btn-sm"
                onClick={handleShare}
                title="Copy trip overview text"
              >
                {copyFeedback ? <Check size={14} className="text-green" /> : <Share2 size={14} />}
                <span className="hide-mobile">{copyFeedback ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onNewTrip}
                title="Create another itinerary"
              >
                New Search
              </button>
            </div>
          </div>

          {/* 3D Destination Portal Window (Inspired by Planet Jumping Reference) */}
          <div className="overview-right-portal">
            <DestinationPortal
              destination={trip.destination}
              tripTitle={trip.tripTitle}
              tripStyle={trip.tripStyle}
              durationDays={trip.durationDays}
            />
          </div>
        </div>
      </section>

      {/* Grid Layout: Main Timeline + Sidebar Details */}
      <div className="itinerary-grid">
        {/* Left Column: Days and Drag-and-Drop Stops */}
        <main className="timeline-column">
          <div className="timeline-header-bar">
            <h3>Day-by-Day Schedule</h3>
            <span className="timeline-instructions">
              💡 Tip: Drag stops or use the arrows to reorder. Expand stops for insider tips.
            </span>
          </div>

          <div className="days-stack">
            {trip.days.map((day) => (
              <DaySection
                key={day.dayNumber}
                day={day}
                allDayNumbers={allDayNumbers}
                onReorderStops={onReorderStops}
                onMoveStopToDay={onMoveStopToDay}
                onRemoveStop={onRemoveStop}
                onAddStop={onAddStop}
                onEditStop={onEditStop}
                currency={selectedCurrency}
              />
            ))}
          </div>
        </main>

        {/* Right Column: Financials, Packing Checklist & Local Tips */}
        <aside className="sidebar-column">
          {/* Budget & Spend Breakdown */}
          <BudgetSummary
            trip={trip}
            selectedCurrency={selectedCurrency}
            onChangeCurrency={setSelectedCurrency}
          />

          {/* Packing Highlights Checklist */}
          {trip.packingHighlights && trip.packingHighlights.length > 0 && (
            <div className="sidebar-card packing-card">
              <div className="sidebar-card-header">
                <Luggage size={18} className="text-indigo" />
                <h4>Packing Checklist</h4>
              </div>
              <ul className="packing-checklist">
                {trip.packingHighlights.map((item, idx) => {
                  const isChecked = Boolean(packedItems[idx]);
                  return (
                    <li
                      key={idx}
                      className={`packing-item ${isChecked ? 'item-packed' : ''}`}
                      onClick={() => togglePackItem(idx)}
                    >
                      <span className="check-box">
                        {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </span>
                      <span className="packing-text">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Local Insider Advice */}
          {trip.localTips && trip.localTips.length > 0 && (
            <div className="sidebar-card tips-card">
              <div className="sidebar-card-header">
                <Info size={18} className="text-amber" />
                <h4>Destination Insider Tips</h4>
              </div>
              <ul className="local-tips-list">
                {trip.localTips.map((tip, idx) => (
                  <li key={idx} className="tip-item">
                    <span className="tip-bullet">•</span>
                    <span className="tip-text">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Refinement Loop Sticky Dock */}
      <RefinementBar
        onRefine={onRefine}
        onCancel={onCancelRefine}
        isRefining={isRefining}
      />
    </div>
  );
}
