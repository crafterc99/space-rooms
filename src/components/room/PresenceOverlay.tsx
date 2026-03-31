"use client";

import { Presence, Profile } from "@/types";
import { PRESENCE_POSITIONS } from "@/lib/constants";

interface PresenceOverlayProps {
  presence: (Presence & { profile?: Profile })[];
}

export default function PresenceOverlay({ presence }: PresenceOverlayProps) {
  const activeUsers = presence.filter((p) => p.status === "in");

  return (
    <>
      {activeUsers.map((p, i) => {
        const pos = PRESENCE_POSITIONS[i % PRESENCE_POSITIONS.length];
        return (
          <div
            key={p.id}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {/* Avatar circle */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white/30"
              style={{ backgroundColor: p.profile?.avatar_color ?? "#6366f1" }}
            >
              {p.profile?.name?.charAt(0) ?? "?"}
            </div>
            {/* Name label */}
            <span className="text-[10px] text-zinc-300 mt-0.5 bg-black/50 px-1 rounded whitespace-nowrap">
              {p.profile?.name ?? "Unknown"}
            </span>
          </div>
        );
      })}
    </>
  );
}
