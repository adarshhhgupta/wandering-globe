import React, { useState } from 'react';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Lightbulb,
  DollarSign,
  Trash2,
  Edit3,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  CornerDownRight
} from 'lucide-react';
import { CATEGORY_COLORS, CURRENCY_SYMBOLS } from '../utils/mockData.js';

export function StopCard({
  stop,
  index,
  totalStops,
  dayNumber,
  allDayNumbers,
  onReorder,
  onMoveToDay,
  onRemove,
  onEdit,
  currency = 'USD'
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form local state
  const [editTitle, setEditTitle] = useState(stop.title);
  const [editTime, setEditTime] = useState(stop.time);
  const [editDuration, setEditDuration] = useState(stop.durationMinutes);
  const [editCost, setEditCost] = useState(stop.costEstimate);
  const [editCategory, setEditCategory] = useState(stop.category);
  const [editLocation, setEditLocation] = useState(stop.location);
  const [editTips, setEditTips] = useState(stop.tips);
  const [editDescription, setEditDescription] = useState(stop.description);

  const categoryStyle = CATEGORY_COLORS[stop.category] || CATEGORY_COLORS.Sightseeing;
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onEdit(dayNumber, {
      ...stop,
      title: editTitle.trim() || stop.title,
      time: editTime,
      durationMinutes: Number(editDuration) || 60,
      costEstimate: Number(editCost) || 0,
      category: editCategory,
      location: editLocation,
      tips: editTips,
      description: editDescription
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(stop.title);
    setEditTime(stop.time);
    setEditDuration(stop.durationMinutes);
    setEditCost(stop.costEstimate);
    setEditCategory(stop.category);
    setEditLocation(stop.location);
    setEditTips(stop.tips);
    setEditDescription(stop.description);
    setIsEditing(false);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ dayNumber, index, stopId: stop.id }));
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('is-dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('is-dragging');
  };

  if (isEditing) {
    return (
      <div className="stop-card editing-mode" id={`stop-card-${stop.id}`}>
        <form onSubmit={handleSaveEdit} className="stop-edit-form">
          <div className="edit-form-header">
            <h4>Edit Activity Details</h4>
            <div className="edit-actions">
              <button type="submit" className="icon-btn success" title="Save changes">
                <Check size={16} />
              </button>
              <button type="button" className="icon-btn" onClick={handleCancelEdit} title="Cancel">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="edit-grid">
            <div className="form-field full-width">
              <label>Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Time</label>
              <input
                type="text"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Duration (mins)</label>
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Est. Cost ({currencySymbol})</label>
              <input
                type="number"
                value={editCost}
                onChange={(e) => setEditCost(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-field full-width">
              <label>Location / Neighborhood</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </div>

            <div className="form-field full-width">
              <label>Description</label>
              <textarea
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <div className="form-field full-width">
              <label>Insider Tips</label>
              <input
                type="text"
                value={editTips}
                onChange={(e) => setEditTips(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      id={`stop-card-${stop.id}`}
      className={`stop-card ${isExpanded ? 'expanded' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="stop-card-main">
        {/* Drag Handle & Mobile Order Arrows */}
        <div className="stop-reorder-controls">
          <div className="drag-handle" title="Drag to reorder stops">
            <GripVertical size={18} />
          </div>
          <div className="mobile-arrows">
            <button
              type="button"
              className="arrow-btn"
              disabled={index === 0}
              onClick={() => onReorder(dayNumber, index, index - 1)}
              title="Move stop earlier"
              aria-label="Move stop up"
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              className="arrow-btn"
              disabled={index === totalStops - 1}
              onClick={() => onReorder(dayNumber, index, index + 1)}
              title="Move stop later"
              aria-label="Move stop down"
            >
              <ArrowDown size={13} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="stop-info" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="stop-meta-row">
            <span className="stop-time-badge">
              <Clock size={12} />
              {stop.time} ({stop.durationMinutes}m)
            </span>

            <span
              className="stop-category-badge"
              style={{
                backgroundColor: categoryStyle.bg,
                color: categoryStyle.text,
                borderColor: categoryStyle.border
              }}
            >
              {stop.category}
            </span>

            {stop.costEstimate > 0 ? (
              <span className="stop-cost-badge">
                {currencySymbol}{stop.costEstimate}
              </span>
            ) : (
              <span className="stop-cost-badge free-badge">Free</span>
            )}
          </div>

          <h3 className="stop-title">{stop.title}</h3>

          <div className="stop-location-row">
            <MapPin size={13} className="location-pin" />
            <span className="stop-location">{stop.location}</span>
          </div>

          {!isExpanded && (
            <p className="stop-brief-desc">{stop.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="stop-card-actions">
          <button
            type="button"
            className="icon-action-btn"
            onClick={() => setIsEditing(true)}
            title="Edit activity"
            aria-label="Edit stop"
          >
            <Edit3 size={15} />
          </button>

          <button
            type="button"
            className="icon-action-btn delete-btn"
            onClick={() => onRemove(dayNumber, stop.id)}
            title="Remove from itinerary"
            aria-label="Remove stop"
          >
            <Trash2 size={15} />
          </button>

          <button
            type="button"
            className="icon-action-btn expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse details' : 'Expand details'}
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="stop-expanded-body">
          <p className="stop-full-desc">{stop.description}</p>

          {stop.tips && (
            <div className="stop-tips-box">
              <Lightbulb size={16} className="tip-bulb-icon" />
              <div>
                <strong>Insider Advice:</strong> {stop.tips}
              </div>
            </div>
          )}

          {/* Move to another Day selector */}
          {allDayNumbers.length > 1 && (
            <div className="move-day-selector">
              <CornerDownRight size={14} />
              <span>Transfer to another day:</span>
              <div className="day-move-buttons">
                {allDayNumbers
                  .filter((d) => d !== dayNumber)
                  .map((targetDay) => (
                    <button
                      key={targetDay}
                      type="button"
                      className="btn-move-day"
                      onClick={() => onMoveToDay(stop.id, dayNumber, targetDay)}
                    >
                      Day {targetDay}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
