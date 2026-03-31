'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function checkOutEquipment(equipmentId: string, userId: string) {
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('equipment')
    .update({
      status: 'in_use',
      checked_out_by: userId,
      checked_out_at: new Date().toISOString(),
    })
    .eq('id', equipmentId);

  await supabase.from('equipment_logs').insert({
    equipment_id: equipmentId,
    user_id: userId,
    action: 'checkout',
  });

  revalidatePath('/equipment');
}

export async function returnEquipment(equipmentId: string, userId: string) {
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('equipment')
    .update({
      status: 'available',
      checked_out_by: null,
      checked_out_at: null,
    })
    .eq('id', equipmentId);

  await supabase.from('equipment_logs').insert({
    equipment_id: equipmentId,
    user_id: userId,
    action: 'return',
  });

  revalidatePath('/equipment');
}
