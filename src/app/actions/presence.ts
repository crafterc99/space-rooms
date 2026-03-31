'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function checkIn(userId: string) {
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('presence')
    .update({
      status: 'in',
      checked_in_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  revalidatePath('/presence');
}

export async function checkOut(userId: string) {
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('presence')
    .update({
      status: 'out',
      checked_in_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  revalidatePath('/presence');
}
