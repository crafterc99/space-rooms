import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Booking, Profile } from '@/types';
import BookingsPanel from '@/components/bookings/BookingsPanel';

export default async function BookingsPage() {
  const supabase = await getSupabaseServerClient();

  const [bookingsResult, profilesResult] = await Promise.all([
    supabase
      .from('bookings')
      .select('*, profiles(*)')
      .order('start_time'),
    supabase.from('profiles').select('*').order('name'),
  ]);

  const bookings: Booking[] = (bookingsResult.data ?? []) as Booking[];
  const profiles: Profile[] = profilesResult.data ?? [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#e8e8f0',
            letterSpacing: '-0.02em',
          }}
        >
          Room Bookings
        </h1>
        <p style={{ color: '#6b6b80', marginTop: 4, fontSize: 14 }}>
          Schedule a room, view upcoming meetings, and see who has what booked.
        </p>
      </div>
      <BookingsPanel initialBookings={bookings} profiles={profiles} />
    </div>
  );
}
