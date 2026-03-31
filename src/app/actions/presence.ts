"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function checkIn(userId: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from("presence")
    .update({ status: "in" })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/presence");
}

export async function checkOut(userId: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from("presence")
    .update({ status: "out" })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/presence");
}
