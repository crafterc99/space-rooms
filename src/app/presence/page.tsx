import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Presence } from '@/types';
import PresenceRoom from '@/components/presence/PresenceRoom';

export default async function PresencePage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from('presence')
    .select('*, profiles(*)')
    .order('profiles(name)');

  const presence: Presence[] = data ?? [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
          Presence Room
        </h1>
        <p style={{ color: '#6b6b80', marginTop: 4, fontSize: 14 }}>
          Check in when you arrive and see who else is in the space.
        </p>
      </div>
      <PresenceRoom initialPresence={presence} />
    </div>
  );
}
