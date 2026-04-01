'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function createBooking(data: {
  room_name: string;
  title: string;
  booked_by: string;
  start_time: string;
  end_time: string;
  notes?: string;
}) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('bookings').insert({
    room_name: data.room_name,
    title: data.title,
    booked_by: data.booked_by,
    start_time: data.start_time,
    end_time: data.end_time,
    notes: data.notes ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/bookings');
  revalidatePath('/');
}

export async function cancelBooking(bookingId: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

  if (error) throw new Error(error.message);

  revalidatePath('/bookings');
  revalidatePath('/');
}
