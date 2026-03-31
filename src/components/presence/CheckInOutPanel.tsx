'use client';

import { Presence } from '@/types';
import { checkIn, checkOut } from '@/app/actions/presence';
import { useUserStore } from '@/store/userStore';
import { useTransition } from 'react';

interface CheckInOutPanelProps {
  presence: Presence[];
}

export default function CheckInOutPanel({ presence }: CheckInOutPanelProps) {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [isPending, startTransition] = useTransition();

  const myPresence = presence.find((p) => p.user_id === currentUserId);
  const isIn = myPresence?.status === 'in';
  const presentPeople = presence.filter((p) => p.status === 'in');

  function handleCheckIn() {
    if (!currentUserId) return;
    startTransition(() => checkIn(currentUserId));
  }

  function handleCheckOut() {
    if (!currentUserId) return;
    startTransition(() => checkOut(currentUserId));
  }

  return (
    <div>
      {/* Action button */}
      {currentUserId && (
        <div style={{ marginBottom: 20 }}>
          {!isIn ? (
            <button
              onClick={handleCheckIn}
              disabled={isPending}
              style={{
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
                width: '100%',
              }}
            >
              Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={isPending}
              style={{
                background: '#374151',
                color: '#e8e8f0',
                border: '1px solid #4b5563',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
                width: '100%',
              }}
            >
              Check Out
            </button>
          )}
        </div>
      )}

      {/* People currently in */}
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#6b6b80', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        In the Room ({presentPeople.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {presentPeople.length === 0 ? (
          <div style={{ color: '#6b6b80', fontSize: 13 }}>Nobody here yet</div>
        ) : (
          presentPeople.map((p) => (
            <div
              key={p.user_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#1a1a24',
                border: '1px solid #2a2a3a',
                borderRadius: 8,
                padding: '8px 12px',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: `${p.profiles?.avatar_color ?? '#6366f1'}33`,
                  border: `2px solid ${p.profiles?.avatar_color ?? '#6366f1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: p.profiles?.avatar_color ?? '#6366f1',
                }}
              >
                {(p.profiles?.name ?? '?').slice(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{p.profiles?.name ?? 'Unknown'}</span>
              {p.user_id === currentUserId && (
                <span style={{ fontSize: 11, color: '#6366f1', marginLeft: 'auto' }}>You</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* People out */}
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#6b6b80', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Out ({presence.filter((p) => p.status === 'out').length})
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {presence
          .filter((p) => p.status === 'out')
          .map((p) => (
            <div
              key={p.user_id}
              style={{
                background: '#111118',
                border: '1px solid #2a2a3a',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 12,
                color: '#6b6b80',
              }}
            >
              {p.profiles?.name ?? 'Unknown'}
            </div>
          ))}
      </div>
    </div>
  );
}
