"use client";

import { useEffect, useState } from "react";
import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Equipment } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import RoomViewer from "@/components/room/RoomViewer";
import EquipmentOverlay from "@/components/room/EquipmentOverlay";
import EquipmentList from "./EquipmentList";

interface EquipmentRoomProps {
  initialEquipment: Equipment[];
}

export default function EquipmentRoom({ initialEquipment }: EquipmentRoomProps) {
  const [equipment, setEquipment] = useState(initialEquipment);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("equipment-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "equipment" },
        (payload: RealtimePostgresUpdatePayload<{ [key: string]: string }>) => {
          setEquipment((prev) =>
            prev.map((item) =>
              item.id === payload.new.id ? (payload.new as unknown as Equipment) : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RoomViewer label="Equipment Room">
          <EquipmentOverlay equipment={equipment} />
        </RoomViewer>
      </div>
      <div>
        <EquipmentList equipment={equipment} />
      </div>
    </div>
  );
}
