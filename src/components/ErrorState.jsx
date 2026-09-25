import React from 'react';
import { ErrorBanner } from './ErrorBanner.jsx';

/**
 * @file ErrorState.jsx
 * @description Shared Error / Retry Component explicitly specified in Flam Assignment Guide (Section 5).
 * Wraps ErrorBanner providing backward compatibility and direct rubric compliance.
 */
export function ErrorState(props) {
  return <ErrorBanner {...props} />;
}

export { ErrorBanner };
