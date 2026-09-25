import React from 'react';
import { TripView } from './TripView.jsx';

/**
 * @file ResultView.jsx
 * @description Routes parsed and validated structured data to the interactive UI.
 * Explicitly specified in Flam Assignment Guide (Section 5).
 * "ResultView.tsx — routes parsed data to the right UI"
 */
export function ResultView(props) {
  return <TripView {...props} />;
}

export { TripView };
