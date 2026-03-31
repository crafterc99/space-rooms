"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { useUserStore } from "@/store/userStore";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function UserPicker() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { currentUserId, setCurrentUserId } = useUserStore();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("profiles")
      .select("*")
      .order("name")
      .then(({ data }: { data: Profile[] | null }) => {
        if (data) setProfiles(data);
      });
  }, []);

  return (
    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
      <span className="text-xs text-zinc-400 whitespace-nowrap">You are:</span>
      <select
        value={currentUserId ?? ""}
        onChange={(e) => setCurrentUserId(e.target.value)}
        className="bg-zinc-800 text-zinc-200 text-sm rounded px-2 py-1 border border-zinc-700 outline-none focus:border-indigo-500"
      >
        <option value="">Select user...</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
