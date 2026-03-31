import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Equipment } from '@/types';
import EquipmentRoom from '@/components/equipment/EquipmentRoom';

export default async function EquipmentPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from('equipment')
    .select('*, profiles(*)')
    .order('name');

  const equipment: Equipment[] = data ?? [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
          Equipment Room
        </h1>
        <p style={{ color: '#6b6b80', marginTop: 4, fontSize: 14 }}>
          Hover a dot on the map to see item info. Check out available equipment.
        </p>
      </div>
      <EquipmentRoom initialEquipment={equipment} />
    </div>
  );
}
