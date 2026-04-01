'use client';

import { useEffect, useState } from 'react';
import { Equipment } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import RoomViewer from '@/components/room/RoomViewer';
import EquipmentOverlay from '@/components/room/EquipmentOverlay';
import EquipmentList from './EquipmentList';

interface EquipmentRoomProps {
  initialEquipment: Equipment[];
}

export default function EquipmentRoom({ initialEquipment }: EquipmentRoomProps) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel('equipment-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'equipment' },
        async (payload: { new: { id: string } }) => {
          // Fetch the updated row with profile join
          const { data } = await supabase
            .from('equipment')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setEquipment((prev) =>
              prev.map((e) => (e.id === data.id ? data : e))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="room-layout">
      {/* Room visual */}
      <div className="room-visual">
        <RoomViewer>
          <EquipmentOverlay equipment={equipment} />
        </RoomViewer>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: '#6b6b80' }}>
          {[
            { color: '#22c55e', label: 'Available' },
            { color: '#ef4444', label: 'In Use' },
            { color: '#eab308', label: 'Maintenance' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      <div className="room-panel">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#e8e8f0' }}>
          Equipment
        </h2>
        <EquipmentList equipment={equipment} />
      </div>
    </div>
  );
}
