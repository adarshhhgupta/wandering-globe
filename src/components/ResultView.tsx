import React from 'react';
import { TripView } from './TripView.jsx';
import type { TripResult } from '../types/result';

/**
 * @file ResultView.tsx
 * @description Routes parsed and validated structured data to the interactive UI.
 * Explicitly specified in Flam Assignment Guide (Section 5).
 * "ResultView.tsx — routes parsed data to the right UI"
 */

export interface ResultViewProps {
  trip: TripResult;
  onRefine: (prompt: string) => void;
  onCancelRefine?: () => void;
  isRefining?: boolean;
  onReorderStops?: (dayNumber: number, sourceIndex: number, targetIndex: number) => void;
  onMoveStopToDay?: (sourceDayNumber: number, stopIndex: number, targetDayNumber: number) => void;
  onRemoveStop?: (dayNumber: number, stopIndex: number) => void;
  onAddStop?: (dayNumber: number, newStop: any) => void;
  onEditStop?: (dayNumber: number, stopIndex: number, updatedStop: any) => void;
  onUndo?: () => void;
  historyLength?: number;
  lastActionMessage?: string | null;
  onSaveTrip?: (trip: TripResult) => void;
  isSaved?: boolean;
  onNewTrip?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = (props) => {
  return <TripView {...(props as any)} />;
};

export default ResultView;
