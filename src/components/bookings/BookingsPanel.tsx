'use client';

import { useEffect, useState, useTransition, type CSSProperties, type FormEvent } from 'react';
import { Booking, Profile } from '@/types';
import { createBooking, cancelBooking } from '@/app/actions/bookings';
import { useUserStore } from '@/store/userStore';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const ROOMS = [
  'Conference Room A',
  'Conference Room B',
  'Meeting Room',
  'Phone Booth',
  'Open Space',
];

const inputStyle: CSSProperties = {
  background: '#111118',
  border: '1px solid #2a2a3a',
  borderRadius: 6,
  padding: '8px 10px',
  fontSize: 13,
  color: '#e8e8f0',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

function isActiveNow(booking: Booking) {
  const now = new Date();
  return new Date(booking.start_time) <= now && new Date(booking.end_time) >= now;
}

interface BookingsPanelProps {
  initialBookings: Booking[];
  profiles: Profile[];
}

export default function BookingsPanel({ initialBookings }: BookingsPanelProps) {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];
  const [formRoom, setFormRoom] = useState(ROOMS[0]);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(today);
  const [formStart, setFormStart] = useState('09:00');
  const [formEnd, setFormEnd] = useState('10:00');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        async (payload: { new: { id: string } }) => {
          const { data } = await supabase
            .from('bookings')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single();
          if (data) {
            setBookings((prev) =>
              [...prev, data as Booking].sort(
                (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
              ),
            );
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookings' },
        (payload: { old: { id: string } }) => {
          setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!currentUserId || !formTitle.trim()) return;

    const start = new Date(`${formDate}T${formStart}`);
    const end = new Date(`${formDate}T${formEnd}`);

    if (end <= start) {
      setFormError('End time must be after start time.');
      return;
    }

    startTransition(() =>
      createBooking({
        room_name: formRoom,
        title: formTitle.trim(),
        booked_by: currentUserId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        notes: formNotes.trim() || undefined,
      }),
    );

    setFormTitle('');
    setFormNotes('');
    setShowForm(false);
  }

  function handleCancel(id: string) {
    startTransition(() => cancelBooking(id));
  }

  // Split into upcoming and past
  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.end_time) >= now);
  const pastCount = bookings.filter((b) => new Date(b.end_time) < now).length;

  // Group upcoming bookings by date
  const grouped = upcoming.reduce<Record<string, Booking[]>>((acc, b) => {
    const dateKey = new Date(b.start_time).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        {currentUserId ? (
          <button
            onClick={() => setShowForm((s) => !s)}
            style={{
              background: showForm ? '#374151' : '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {showForm ? '✕ Cancel' : '+ Book a Room'}
          </button>
        ) : (
          <span style={{ fontSize: 13, color: '#6b6b80' }}>Select a user to book a room</span>
        )}
      </div>

      {/* Booking form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            background: '#1a1a24',
            border: '1px solid #6366f133',
            borderRadius: 12,
            padding: 20,
            marginBottom: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e8e8f0', margin: 0 }}>New Booking</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Room
              </span>
              <select value={formRoom} onChange={(e) => setFormRoom(e.target.value)} style={inputStyle}>
                {ROOMS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Date
              </span>
              <input
                type="date"
                value={formDate}
                min={today}
                onChange={(e) => setFormDate(e.target.value)}
                style={inputStyle}
                required
              />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Meeting Title
            </span>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Sprint Review, 1:1, Team Sync…"
              style={inputStyle}
              required
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Start Time
              </span>
              <input
                type="time"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
                style={inputStyle}
                required
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                End Time
              </span>
              <input
                type="time"
                value={formEnd}
                onChange={(e) => setFormEnd(e.target.value)}
                style={inputStyle}
                required
              />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Notes (optional)
            </span>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Agenda, attendees, dial-in info…"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </label>

          {formError && (
            <div style={{ fontSize: 13, color: '#ef4444' }}>{formError}</div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={isPending || !formTitle.trim()}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending || !formTitle.trim() ? 0.6 : 1,
              }}
            >
              {isPending ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}

      {/* Schedule list */}
      {sortedDates.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 0',
            color: '#6b6b80',
            fontSize: 14,
          }}
        >
          No upcoming bookings. Book a room to get started.
        </div>
      ) : (
        sortedDates.map((dateKey) => (
          <div key={dateKey} style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#6b6b80',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {formatDateLabel(grouped[dateKey][0].start_time)}
              <span style={{ fontWeight: 400, color: '#3a3a4a' }}>
                — {grouped[dateKey].length} booking{grouped[dateKey].length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grouped[dateKey].map((booking) => {
                const active = isActiveNow(booking);
                const isMine = booking.booked_by === currentUserId;

                return (
                  <div
                    key={booking.id}
                    style={{
                      background: '#1a1a24',
                      border: `1px solid ${active ? '#6366f155' : '#2a2a3a'}`,
                      borderLeft: `3px solid ${active ? '#6366f1' : '#2a2a3a'}`,
                      borderRadius: 8,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    {/* Time */}
                    <div
                      style={{
                        flex: '0 0 80px',
                        fontSize: 12,
                        color: active ? '#818cf8' : '#6b6b80',
                        fontWeight: 600,
                        lineHeight: 1.6,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      <div>{formatTime(booking.start_time)}</div>
                      <div style={{ opacity: 0.7 }}>{formatTime(booking.end_time)}</div>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0' }}>
                          {booking.title}
                        </span>
                        {active && (
                          <span
                            style={{
                              background: '#6366f122',
                              color: '#818cf8',
                              border: '1px solid #6366f144',
                              borderRadius: 4,
                              padding: '1px 7px',
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                            }}
                          >
                            LIVE
                          </span>
                        )}
                        {isMine && (
                          <span style={{ fontSize: 10, color: '#6366f1', fontWeight: 700 }}>You</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b6b80', marginTop: 2 }}>
                        {booking.room_name}
                        {booking.profiles && (
                          <span>
                            {' '}
                            ·{' '}
                            <span
                              style={{
                                color: booking.profiles.avatar_color,
                                fontWeight: 600,
                              }}
                            >
                              {booking.profiles.name}
                            </span>
                          </span>
                        )}
                      </div>
                      {booking.notes && (
                        <div
                          style={{
                            fontSize: 12,
                            color: '#6b6b80',
                            marginTop: 6,
                            padding: '4px 8px',
                            background: '#111118',
                            borderRadius: 4,
                            fontStyle: 'italic',
                          }}
                        >
                          {booking.notes}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    {booking.profiles && (
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: `${booking.profiles.avatar_color}22`,
                          border: `2px solid ${booking.profiles.avatar_color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 800,
                          color: booking.profiles.avatar_color,
                          flexShrink: 0,
                        }}
                      >
                        {booking.profiles.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Cancel */}
                    {isMine && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={isPending}
                        style={{
                          background: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef444433',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: isPending ? 'not-allowed' : 'pointer',
                          flexShrink: 0,
                          opacity: isPending ? 0.6 : 1,
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {pastCount > 0 && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 16,
            borderTop: '1px solid #2a2a3a',
            fontSize: 12,
            color: '#3a3a4a',
          }}
        >
          {pastCount} past booking{pastCount !== 1 ? 's' : ''} not shown
        </div>
      )}
    </div>
  );
}
