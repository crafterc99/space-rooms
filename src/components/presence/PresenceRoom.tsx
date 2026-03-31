"use client";

import { useEffect, useState } from "react";
import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Presence, Profile } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import RoomViewer from "@/components/room/RoomViewer";
import PresenceOverlay from "@/components/room/PresenceOverlay";
import CheckInOutPanel from "./CheckInOutPanel";

interface PresenceRoomProps {
  initialPresence: (Presence & { profile?: Profile })[];
  profiles: Profile[];
}

export default function PresenceRoom({ initialPresence, profiles }: PresenceRoomProps) {
  const [presence, setPresence] = useState(initialPresence);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("presence-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "presence" },
        (payload: RealtimePostgresUpdatePayload<{ [key: string]: string }>) => {
          setPresence((prev) =>
            prev.map((p) => {
              if (p.id === payload.new.id) {
                const updated = payload.new as unknown as Presence;
                const profile = profiles.find((pr) => pr.id === updated.user_id);
                return { ...updated, profile };
              }
              return p;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profiles]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RoomViewer label="Presence Room">
          <PresenceOverlay presence={presence} />
        </RoomViewer>
      </div>
      <div>
        <CheckInOutPanel presence={presence} />
      </div>
    </div>
  );
}
