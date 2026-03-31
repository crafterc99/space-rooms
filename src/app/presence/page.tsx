import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Presence, Profile } from "@/types";
import PresenceRoom from "@/components/presence/PresenceRoom";

export default async function PresencePage() {
  const supabase = await getSupabaseServerClient();

  const [{ data: presenceData }, { data: profilesData }] = await Promise.all([
    supabase.from("presence").select("*").order("user_id"),
    supabase.from("profiles").select("*").order("name"),
  ]);

  const profiles = (profilesData ?? []) as Profile[];
  const presence = ((presenceData ?? []) as Presence[]).map((p) => ({
    ...p,
    profile: profiles.find((pr) => pr.id === p.user_id),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Presence Room</h1>
      <PresenceRoom initialPresence={presence} profiles={profiles} />
    </div>
  );
}
