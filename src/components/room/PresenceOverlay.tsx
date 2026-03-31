import { Presence } from '@/types';
import { PRESENCE_POSITIONS } from '@/lib/constants';

interface PresenceOverlayProps {
  presence: Presence[];
}

export default function PresenceOverlay({ presence }: PresenceOverlayProps) {
  const present = presence.filter((p) => p.status === 'in');

  return (
    <>
      {present.map((p, idx) => {
        const pos = PRESENCE_POSITIONS[idx];
        if (!pos) return null;
        const [left, top] = pos;
        const color = p.profiles?.avatar_color ?? '#6366f1';
        const initials = (p.profiles?.name ?? '?').slice(0, 2).toUpperCase();

        return (
          <div
            key={p.user_id}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `${color}33`,
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color,
                boxShadow: `0 0 14px ${color}55`,
              }}
            >
              {initials}
            </div>
            {/* Name label */}
            <div
              style={{
                background: '#0f0f14ee',
                color: '#e8e8f0',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                border: '1px solid #2a2a3a',
              }}
            >
              {p.profiles?.name ?? 'Unknown'}
            </div>
          </div>
        );
      })}
    </>
  );
}
