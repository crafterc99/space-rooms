'use client';

import { useEffect, useState } from 'react';
import { Presence } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import RoomViewer from '@/components/room/RoomViewer';
import PresenceOverlay from '@/components/room/PresenceOverlay';
import CheckInOutPanel from './CheckInOutPanel';

interface PresenceRoomProps {
  initialPresence: Presence[];
}

export default function PresenceRoom({ initialPresence }: PresenceRoomProps) {
  const [presence, setPresence] = useState<Presence[]>(initialPresence);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'presence' },
        async (payload: { new: { id: string } }) => {
          const { data } = await supabase
            .from('presence')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setPresence((prev) =>
              prev.map((p) => (p.id === data.id ? data : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const presentCount = presence.filter((p) => p.status === 'in').length;

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Room visual */}
      <div style={{ flex: '0 0 60%' }}>
        <RoomViewer>
          <PresenceOverlay presence={presence} />
        </RoomViewer>
        <div style={{ marginTop: 12, fontSize: 13, color: '#6b6b80' }}>
          {presentCount === 0
            ? 'Room is empty'
            : `${presentCount} person${presentCount !== 1 ? 's' : ''} in the room`}
        </div>
      </div>

      {/* Side panel */}
      <div style={{ flex: 1 }}>
        <CheckInOutPanel presence={presence} />
      </div>
    </div>
  );
}
