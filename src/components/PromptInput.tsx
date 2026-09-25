import React from 'react';
import { TripInput } from './TripInput.jsx';

/**
 * @file PromptInput.tsx
 * @description Free-form text input component explicitly specified in Flam Assignment Guide (Section 5).
 * "A free-form text input — the only way the user gets information into the app."
 */

export interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  activeSimulation?: string | null;
  onRunRaceConditionTest?: () => void;
  theme?: string;
}

export const PromptInput: React.FC<PromptInputProps> = (props) => {
  return <TripInput {...props} />;
};

export default PromptInput;
