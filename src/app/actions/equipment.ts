"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function checkOutEquipment(equipmentId: string, userId: string) {
  const supabase = await getSupabaseServerClient();

  const { error: updateError } = await supabase
    .from("equipment")
    .update({ status: "checked_out", checked_out_by: userId })
    .eq("id", equipmentId)
    .eq("status", "available");

  if (updateError) throw new Error(updateError.message);

  await supabase.from("equipment_logs").insert({
    equipment_id: equipmentId,
    user_id: userId,
    action: "check_out",
  });

  revalidatePath("/equipment");
}

export async function returnEquipment(equipmentId: string, userId: string) {
  const supabase = await getSupabaseServerClient();

  const { error: updateError } = await supabase
    .from("equipment")
    .update({ status: "available", checked_out_by: null })
    .eq("id", equipmentId)
    .eq("checked_out_by", userId);

  if (updateError) throw new Error(updateError.message);

  await supabase.from("equipment_logs").insert({
    equipment_id: equipmentId,
    user_id: userId,
    action: "return",
  });

  revalidatePath("/equipment");
}
