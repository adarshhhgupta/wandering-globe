import React from 'react';
import { Compass, Clock } from 'lucide-react';

export function DestinationPortal({ destination, tripTitle, tripStyle, durationDays }) {
  const destLower = (destination || '').toLowerCase();

  let themeClass = 'theme-japan';
  let emblemEmoji = '🌸';
  let highlightTag = 'Historic Shrines & Gastronomy';
  let timezoneNote = 'GMT+9 • High-Speed Rail & Walking';

  if (destLower.includes('paris') || destLower.includes('france')) {
    themeClass = 'theme-paris';
    emblemEmoji = '🥐';
    highlightTag = 'Café Culture & World-Class Art';
    timezoneNote = 'GMT+1 • Metro & River Walking';
  } else if (destLower.includes('iceland')) {
    themeClass = 'theme-iceland';
    emblemEmoji = '🌋';
    highlightTag = 'Glacial Lagoons & Volcanic Power';
    timezoneNote = 'GMT+0 • 4WD Self-Drive Recommended';
  } else if (destLower.includes('bali') || destLower.includes('beach') || destLower.includes('indonesia')) {
    themeClass = 'theme-bali';
    emblemEmoji = '🏝️';
    highlightTag = 'Sanctuary Terraces & Ocean Sunsets';
    timezoneNote = 'GMT+8 • Private Driver / Scooter';
  } else if (destLower.includes('rome') || destLower.includes('italy')) {
    themeClass = 'theme-rome';
    emblemEmoji = '🏛️';
    highlightTag = 'Ancient Colosseums & Piazza Dining';
    timezoneNote = 'GMT+1 • Pedestrian Cobblestone District';
  }

  const cityName = destination ? destination.split(',')[0] : 'Expedition';

  return (
    <div className={`destination-showcase-card ${themeClass}`}>
      <div className="showcase-content">
        <div className="showcase-top">
          <span className="showcase-emblem">{emblemEmoji}</span>
          <span className="showcase-days-badge">{durationDays} Days Planned</span>
        </div>

        <div className="showcase-main">
          <h3 className="showcase-city">{cityName}</h3>
          <p className="showcase-highlight">{highlightTag}</p>
        </div>

        <div className="showcase-meta-row">
          <span className="showcase-meta-item">
            <Compass size={13} /> {tripStyle}
          </span>
          <span className="showcase-meta-item">
            <Clock size={13} /> {timezoneNote}
          </span>
        </div>
      </div>
    </div>
  );
}
