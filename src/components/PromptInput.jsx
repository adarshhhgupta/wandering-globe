import React from 'react';
import { TripInput } from './TripInput.jsx';

/**
 * @file PromptInput.jsx
 * @description Free-form text input component explicitly specified in Flam Assignment Guide (Section 5).
 * "A free-form text input — the only way the user gets information into the app."
 */
export function PromptInput(props) {
  return <TripInput {...props} />;
}

export { TripInput };
