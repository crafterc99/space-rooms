'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const VALID_ROOMS = [
  'Conference Room A',
  'Conference Room B',
  'Meeting Room',
  'Phone Booth',
  'Open Space',
] as const;

const MAX_TITLE_LEN = 120;
const MAX_NOTES_LEN = 800;
const MAX_BOOKING_DAYS_AHEAD = 90;

function isValidUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

export async function createBooking(data: {
  room_name: string;
  title: string;
  booked_by: string;
  start_time: string;
  end_time: string;
  notes?: string;
}) {
  // --- Validation ---
  if (!VALID_ROOMS.includes(data.room_name as (typeof VALID_ROOMS)[number])) {
    throw new Error('Invalid room name.');
  }

  const title = data.title.trim().slice(0, MAX_TITLE_LEN);
  if (!title) throw new Error('Title is required.');

  const notes = data.notes?.trim().slice(0, MAX_NOTES_LEN) ?? null;

  if (!isValidUuid(data.booked_by)) throw new Error('Invalid user.');

  const start = new Date(data.start_time);
  const end   = new Date(data.end_time);
  const now   = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error('Invalid times.');
  if (end <= start) throw new Error('End time must be after start time.');

  const maxAhead = new Date(now);
  maxAhead.setDate(maxAhead.getDate() + MAX_BOOKING_DAYS_AHEAD);
  if (start > maxAhead) throw new Error(`Cannot book more than ${MAX_BOOKING_DAYS_AHEAD} days ahead.`);

  // Past bookings allowed (for backdating), but cap at 1 day ago
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  if (start < oneDayAgo) throw new Error('Cannot book that far in the past.');

  // --- Persist ---
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('bookings').insert({
    room_name:  data.room_name,
    title,
    notes,
    booked_by:  data.booked_by,
    start_time: start.toISOString(),
    end_time:   end.toISOString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath('/bookings');
  revalidatePath('/');
}

export async function cancelBooking(bookingId: string) {
  if (!isValidUuid(bookingId)) throw new Error('Invalid booking ID.');

  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

  if (error) throw new Error(error.message);

  revalidatePath('/bookings');
  revalidatePath('/');
}
