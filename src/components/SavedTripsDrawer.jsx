import React from 'react';
import { BookmarkCheck, X, Trash2, ExternalLink, Calendar, MapPin, Download } from 'lucide-react';

export function SavedTripsDrawer({
  isOpen,
  onClose,
  savedTrips,
  onLoadTrip,
  onDeleteTrip,
  onClearAll
}) {
  if (!isOpen) return null;

  const handleExportSingle = (trip) => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `${trip.destination || 'itinerary'}-wanderforge.json`);
    dlAnchor.click();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-row">
            <BookmarkCheck size={20} className="drawer-icon" />
            <div>
              <h3>Saved Itineraries</h3>
              <p className="drawer-sub">{savedTrips.length} trips stored locally</p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {savedTrips.length === 0 ? (
            <div className="empty-saved-state">
              <BookmarkCheck size={36} className="empty-icon" />
              <h4>No saved trips yet</h4>
              <p>When you generate an itinerary, click "Save Itinerary" to preserve it here for offline reference.</p>
            </div>
          ) : (
            <div className="saved-trips-list">
              {savedTrips.map((saved) => (
                <div key={saved.id} className="saved-trip-item">
                  <div className="saved-item-header">
                    <div className="saved-dest-tag">
                      <MapPin size={12} />
                      <span>{saved.destination}</span>
                    </div>
                    <span className="saved-date">
                      {new Date(saved.savedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="saved-trip-title">{saved.tripTitle}</h4>
                  <p className="saved-summary">{saved.summary?.slice(0, 100)}...</p>

                  <div className="saved-meta-row">
                    <span className="saved-meta-item">
                      <Calendar size={12} /> {saved.durationDays} Days ({saved.days?.length} total days)
                    </span>
                    <span className="saved-meta-item">
                      ${saved.estimatedTotalBudget?.amount || 0} est.
                    </span>
                  </div>

                  <div className="saved-item-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onLoadTrip(saved);
                        onClose();
                      }}
                    >
                      <ExternalLink size={13} />
                      <span>Load Trip</span>
                    </button>

                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() => handleExportSingle(saved)}
                      title="Export JSON"
                    >
                      <Download size={14} />
                    </button>

                    <button
                      type="button"
                      className="icon-action-btn delete-btn"
                      onClick={() => onDeleteTrip(saved.id)}
                      title="Delete saved trip"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {savedTrips.length > 0 && (
          <div className="drawer-footer">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-danger"
              onClick={onClearAll}
            >
              Clear All Saved Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
