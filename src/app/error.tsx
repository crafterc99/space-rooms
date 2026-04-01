'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console — swap for a real error reporter (Sentry etc.) in production
    console.error('[Space Rooms error]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
        padding: '32px 24px',
      }}
    >
      <div style={{ fontSize: 40 }}>⚠</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0' }}>
        Something went wrong
      </h2>
      <p style={{ fontSize: 14, color: '#6b6b80', maxWidth: 360 }}>
        {error.message ?? 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        style={{
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        Try again
      </button>
    </div>
  );
}
