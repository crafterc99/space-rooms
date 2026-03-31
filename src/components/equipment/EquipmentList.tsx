"use client";

import { Equipment } from "@/types";
import { useUserStore } from "@/store/userStore";
import { checkOutEquipment, returnEquipment } from "@/app/actions/equipment";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTransition } from "react";

interface EquipmentListProps {
  equipment: Equipment[];
}

export default function EquipmentList({ equipment }: EquipmentListProps) {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [isPending, startTransition] = useTransition();

  const handleCheckOut = (equipmentId: string) => {
    if (!currentUserId) return;
    startTransition(() => checkOutEquipment(equipmentId, currentUserId));
  };

  const handleReturn = (equipmentId: string) => {
    if (!currentUserId) return;
    startTransition(() => returnEquipment(equipmentId, currentUserId));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-zinc-100 mb-4">Equipment</h2>
      <div className="space-y-3">
        {equipment.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-zinc-800 rounded-lg p-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-200">{item.name}</p>
              <StatusBadge status={item.status} />
            </div>
            <div>
              {item.status === "available" && currentUserId && (
                <button
                  onClick={() => handleCheckOut(item.id)}
                  disabled={isPending}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                >
                  Check Out
                </button>
              )}
              {item.status === "checked_out" &&
                item.checked_out_by === currentUserId && (
                  <button
                    onClick={() => handleReturn(item.id)}
                    disabled={isPending}
                    className="text-xs bg-zinc-600 hover:bg-zinc-500 text-white px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                  >
                    Return
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
      {!currentUserId && (
        <p className="text-xs text-zinc-500 mt-3">
          Select a user above to check out equipment.
        </p>
      )}
    </div>
  );
}
