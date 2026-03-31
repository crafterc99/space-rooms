"use client";

import { Equipment } from "@/types";
import { EQUIPMENT_POSITIONS } from "@/lib/constants";

interface EquipmentOverlayProps {
  equipment: Equipment[];
}

const statusColors: Record<string, string> = {
  available: "#22c55e",
  checked_out: "#ef4444",
  maintenance: "#eab308",
};

export default function EquipmentOverlay({ equipment }: EquipmentOverlayProps) {
  return (
    <>
      {equipment.map((item) => {
        const pos = EQUIPMENT_POSITIONS[item.overlay_key];
        if (!pos) return null;
        const color = statusColors[item.status] ?? "#6b7280";
        return (
          <div
            key={item.id}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {/* Glow */}
            <div
              className="w-5 h-5 rounded-full blur-sm absolute"
              style={{ backgroundColor: color, opacity: 0.5 }}
            />
            {/* Dot */}
            <div
              className="w-3 h-3 rounded-full relative z-10 border border-white/30"
              style={{ backgroundColor: color }}
            />
            {/* Label */}
            <span className="text-[10px] text-zinc-400 mt-1 whitespace-nowrap bg-black/50 px-1 rounded">
              {item.name}
            </span>
          </div>
        );
      })}
    </>
  );
}
