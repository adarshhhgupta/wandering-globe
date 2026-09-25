import React, { useState } from 'react';
import { Plus, Calendar, Clock, DollarSign, Sparkles, Check, X } from 'lucide-react';
import { StopCard } from './StopCard.jsx';
import { CATEGORY_COLORS, CURRENCY_SYMBOLS, convertCurrency } from '../utils/mockData.js';

export function DaySection({
  day,
  allDayNumbers,
  onReorderStops,
  onMoveStopToDay,
  onRemoveStop,
  onAddStop,
  onEditStop,
  currency = 'USD'
}) {
  const dayNumber = Number(day.dayNumber) || Number(day.day) || 1;
  const [isAdding, setIsAdding] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // New stop form fields
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newDuration, setNewDuration] = useState('60');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newCost, setNewCost] = useState('0');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  // Calculate day totals
  const totalDayMinutes = day.stops.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalDayHours = (totalDayMinutes / 60).toFixed(1);
  const totalDayCost = day.stops.reduce((sum, s) => sum + (s.costEstimate || 0), 0);

  const handleCreateStop = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddStop(dayNumber, {
      title: newTitle.trim(),
      time: newTime,
      durationMinutes: Number(newDuration) || 60,
      category: newCategory,
      costEstimate: Number(newCost) || 0,
      location: newLocation.trim() || 'Central District',
      description: newDescription.trim() || 'Custom planned activity.',
      tips: 'Added directly by traveler.'
    });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewCost('0');
    setIsAdding(false);
  };

  // Drag over handler for day dropzone
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { dayNumber: sourceDay, index: sourceIndex, stopId } = data;

      if (sourceDay === dayNumber) {
        // Reorder within same day
        onReorderStops(dayNumber, sourceIndex, targetIndex);
      } else {
        // Transfer from another day
        onMoveStopToDay(stopId, sourceDay, dayNumber, targetIndex);
      }
    } catch (err) {
      console.error('Failed to parse drag drop event:', err);
    }
  };

  return (
    <section className="day-section" id={`day-section-${dayNumber}`}>
      {/* Day Header */}
      <div className="day-header">
        <div className="day-title-block">
          <div className="day-badge-col">
            <span className="day-pill">Day {dayNumber}</span>
          </div>
          <div>
            <h2 className="day-theme">{day.theme}</h2>
            <div className="day-meta-pills">
              <span className="meta-pill">
                <Calendar size={13} /> {day.stops.length} activities
              </span>
              <span className="meta-pill">
                <Clock size={13} /> ~{totalDayHours} hrs planned
              </span>
              <span className="meta-pill cost-meta">
                <DollarSign size={13} /> {currencySymbol}{convertCurrency(totalDayCost, currency).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary-subtle btn-sm add-stop-toggle"
          onClick={() => setIsAdding(!isAdding)}
          title="Add a custom stop to this day"
        >
          <Plus size={15} />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Inline Form to Add New Stop */}
      {isAdding && (
        <div className="add-stop-form-card">
          <form onSubmit={handleCreateStop}>
            <div className="add-form-header">
              <span className="form-title">
                <Sparkles size={15} /> Add Custom Activity to Day {dayNumber}
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setIsAdding(false)}
                title="Cancel"
              >
                <X size={15} />
              </button>
            </div>

            <div className="edit-grid">
              <div className="form-field full-width">
                <label>Activity Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset drinks at Sky Bar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-field">
                <label>Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Duration (mins)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Cost ({currencySymbol})</label>
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {Object.keys(CATEGORY_COLORS).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-field full-width">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g. Rooftop 42, Roppongi"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div className="form-field full-width">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="What will you experience here?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="add-form-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <Plus size={15} />
                <span>Add to Day {dayNumber}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stops Timeline List */}
      <div
        className="stops-container"
        onDragOver={(e) => handleDragOver(e, day.stops.length)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, day.stops.length)}
      >
        {day.stops.length === 0 ? (
          <div className="empty-day-state">
            <p>No stops currently scheduled for Day {dayNumber}.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsAdding(true)}
            >
              + Create first activity
            </button>
          </div>
        ) : (
          day.stops.map((stop, sIndex) => (
            <div
              key={stop.id}
              className={`drop-wrapper ${dragOverIndex === sIndex ? 'drop-target-active' : ''}`}
              onDragOver={(e) => {
                e.stopPropagation();
                handleDragOver(e, sIndex);
              }}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e, sIndex);
              }}
            >
              <StopCard
                stop={stop}
                index={sIndex}
                totalStops={day.stops.length}
                dayNumber={dayNumber}
                allDayNumbers={allDayNumbers}
                onReorder={onReorderStops}
                onMoveToDay={onMoveStopToDay}
                onRemove={onRemoveStop}
                onEdit={onEditStop}
                currency={currency}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
