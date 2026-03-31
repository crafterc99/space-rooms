import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Equipment } from "@/types";
import EquipmentRoom from "@/components/equipment/EquipmentRoom";

export default async function EquipmentPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("equipment")
    .select("*")
    .order("name");

  const equipment = (data ?? []) as Equipment[];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Equipment Room</h1>
      <EquipmentRoom initialEquipment={equipment} />
    </div>
  );
}
