import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Booking, Equipment, Presence } from '@/types';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isActiveNow(booking: Booking) {
  const now = new Date();
  return new Date(booking.start_time) <= now && new Date(booking.end_time) >= now;
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [presenceResult, equipmentResult, bookingsResult] = await Promise.all([
    supabase.from('presence').select('*, profiles(*)').order('profiles(name)'),
    supabase.from('equipment').select('*, profiles(*)').order('name'),
    supabase
      .from('bookings')
      .select('*, profiles(*)')
      .gte('end_time', now.toISOString())
      .lte('start_time', todayEnd.toISOString())
      .order('start_time'),
  ]);

  const presence: Presence[] = (presenceResult.data ?? []) as Presence[];
  const equipment: Equipment[] = (equipmentResult.data ?? []) as Equipment[];
  const todayBookings: Booking[] = (bookingsResult.data ?? []) as Booking[];

  const inRoom = presence.filter((p) => p.status === 'in');
  const available = equipment.filter((e) => e.status === 'available').length;
  const inUse = equipment.filter((e) => e.status === 'in_use').length;
  const overdue = equipment.filter(
    (e) => e.due_back_at && new Date(e.due_back_at) < now,
  );

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#e8e8f0',
            letterSpacing: '-0.02em',
          }}
        >
          Space Rooms
        </h1>
        <p style={{ color: '#6b6b80', marginTop: 6, fontSize: 15 }}>
          Real-time overview of your space — equipment, people, and bookings.
        </p>
      </div>

      {/* Stat cards row */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {/* Occupancy card */}
        <Link
          href="/presence"
          style={{
            background: '#1a1a24',
            border: '1px solid #22c55e33',
            borderRadius: 12,
            padding: '20px 20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            In the Space
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#e8e8f0', lineHeight: 1 }}>
            {inRoom.length}
            <span style={{ fontSize: 14, color: '#6b6b80', fontWeight: 500, marginLeft: 6 }}>
              / {presence.length}
            </span>
          </div>
          {inRoom.length === 0 ? (
            <div style={{ fontSize: 13, color: '#6b6b80' }}>Nobody here yet</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {inRoom.map((p) => (
                <div
                  key={p.user_id}
                  style={{
                    background: `${p.profiles?.avatar_color ?? '#6366f1'}22`,
                    border: `1px solid ${p.profiles?.avatar_color ?? '#6366f1'}66`,
                    borderRadius: 20,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: p.profiles?.avatar_color ?? '#6366f1',
                  }}
                >
                  {p.profiles?.name ?? 'Unknown'}
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginTop: 'auto' }}>
            View presence →
          </div>
        </Link>

        {/* Equipment card */}
        <Link
          href="/equipment"
          style={{
            background: '#1a1a24',
            border: `1px solid ${overdue.length > 0 ? '#ef444433' : '#6366f133'}`,
            borderRadius: 12,
            padding: '20px 20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: overdue.length > 0 ? '#ef4444' : '#6366f1',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Equipment
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#e8e8f0', lineHeight: 1 }}>
            {available}
            <span style={{ fontSize: 14, color: '#6b6b80', fontWeight: 500, marginLeft: 6 }}>
              available
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, color: '#6b6b80' }}>
              <span style={{ color: '#ef444499', fontWeight: 600 }}>{inUse}</span> checked out
              {overdue.length > 0 && (
                <span style={{ color: '#ef4444', fontWeight: 700 }}>
                  {' '}· {overdue.length} overdue
                </span>
              )}
            </div>
            {overdue.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {overdue.slice(0, 2).map((e) => (
                  <div key={e.id} style={{ fontSize: 12, color: '#ef4444' }}>
                    ⚠ {e.name}
                    {e.profiles && (
                      <span style={{ color: '#6b6b80' }}> — {e.profiles.name}</span>
                    )}
                  </div>
                ))}
                {overdue.length > 2 && (
                  <div style={{ fontSize: 12, color: '#ef4444' }}>
                    + {overdue.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', marginTop: 'auto' }}>
            Manage equipment →
          </div>
        </Link>

        {/* Bookings card */}
        <Link
          href="/bookings"
          style={{
            background: '#1a1a24',
            border: '1px solid #f59e0b33',
            borderRadius: 12,
            padding: '20px 20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Today&apos;s Bookings
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#e8e8f0', lineHeight: 1 }}>
            {todayBookings.length}
            <span style={{ fontSize: 14, color: '#6b6b80', fontWeight: 500, marginLeft: 6 }}>
              meeting{todayBookings.length !== 1 ? 's' : ''}
            </span>
          </div>
          {todayBookings.length === 0 ? (
            <div style={{ fontSize: 13, color: '#6b6b80' }}>No meetings scheduled today</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {todayBookings.slice(0, 3).map((b) => {
                const active = isActiveNow(b);
                return (
                  <div key={b.id} style={{ fontSize: 12, color: active ? '#f59e0b' : '#6b6b80', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', flexShrink: 0, display: 'inline-block' }} />}
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(b.start_time)}</span>
                    <span style={{ color: active ? '#e8e8f0' : '#6b6b80', fontWeight: active ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.title}
                    </span>
                  </div>
                );
              })}
              {todayBookings.length > 3 && (
                <div style={{ fontSize: 12, color: '#6b6b80' }}>+ {todayBookings.length - 3} more</div>
              )}
            </div>
          )}
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginTop: 'auto' }}>
            View schedule →
          </div>
        </Link>
      </div>

      {/* Today's schedule strip */}
      {todayBookings.length > 0 && (
        <div
          style={{
            background: '#1a1a24',
            border: '1px solid #2a2a3a',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#6b6b80',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 14,
            }}
          >
            Today&apos;s Schedule
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayBookings.map((b) => {
              const active = isActiveNow(b);
              return (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    background: active ? '#6366f111' : '#111118',
                    border: `1px solid ${active ? '#6366f133' : '#2a2a3a'}`,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      flex: '0 0 110px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: active ? '#818cf8' : '#6b6b80',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatTime(b.start_time)} – {formatTime(b.end_time)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#e8e8f0' }}>{b.title}</span>
                    <span style={{ fontSize: 12, color: '#6b6b80', marginLeft: 8 }}>{b.room_name}</span>
                  </div>
                  {active && (
                    <span
                      style={{
                        background: '#6366f122',
                        color: '#818cf8',
                        border: '1px solid #6366f133',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                      }}
                    >
                      LIVE
                    </span>
                  )}
                  {b.profiles && (
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: `${b.profiles.avatar_color}22`,
                        border: `2px solid ${b.profiles.avatar_color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 800,
                        color: b.profiles.avatar_color,
                        flexShrink: 0,
                      }}
                    >
                      {b.profiles.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick-nav cards */}
      <div className="grid-3" style={{ gap: 14 }}>
        {[
          { href: '/equipment', label: 'Equipment Room', sub: 'Check out & return shared equipment', color: '#6366f1' },
          { href: '/presence',  label: 'Presence Room',  sub: 'See who is in the space right now',   color: '#22c55e' },
          { href: '/bookings',  label: 'Room Bookings',  sub: 'Book a room or view the schedule',    color: '#f59e0b' },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              background: '#111118',
              border: `1px solid ${card.color}22`,
              borderRadius: 10,
              padding: '16px 18px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: card.color }}>{card.label}</div>
            <div style={{ fontSize: 12, color: '#6b6b80', lineHeight: 1.4 }}>{card.sub}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: card.color, marginTop: 4 }}>Open →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
