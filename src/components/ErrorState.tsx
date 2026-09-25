import React from 'react';
import { ErrorBanner } from './ErrorBanner.jsx';

/**
 * @file ErrorState.tsx
 * @description Shared Error / Retry Component explicitly specified in Flam Assignment Guide (Section 5).
 * "ErrorState.tsx — shared error / retry UI"
 */

export interface ErrorStateProps {
  error: {
    message?: string;
    details?: string;
    code?: string;
    rawPayload?: unknown;
  } | string | null;
  onRetry: () => void;
  onLoadMockDemo?: () => void;
  onDismiss?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = (props) => {
  return <ErrorBanner {...(props as any)} />;
};

export default ErrorState;
