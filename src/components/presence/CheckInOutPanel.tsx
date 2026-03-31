"use client";

import { Presence, Profile } from "@/types";
import { useUserStore } from "@/store/userStore";
import { checkIn, checkOut } from "@/app/actions/presence";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTransition } from "react";

interface CheckInOutPanelProps {
  presence: (Presence & { profile?: Profile })[];
}

export default function CheckInOutPanel({ presence }: CheckInOutPanelProps) {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [isPending, startTransition] = useTransition();

  const currentUserPresence = presence.find((p) => p.user_id === currentUserId);
  const activeUsers = presence.filter((p) => p.status === "in");

  const handleCheckIn = () => {
    if (!currentUserId) return;
    startTransition(() => checkIn(currentUserId));
  };

  const handleCheckOut = () => {
    if (!currentUserId) return;
    startTransition(() => checkOut(currentUserId));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-zinc-100 mb-4">Presence</h2>

      {currentUserId && currentUserPresence && (
        <div className="mb-4">
          {currentUserPresence.status === "out" ? (
            <button
              onClick={handleCheckIn}
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={isPending}
              className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              Check Out
            </button>
          )}
        </div>
      )}

      {!currentUserId && (
        <p className="text-xs text-zinc-500 mb-4">
          Select a user above to check in/out.
        </p>
      )}

      <h3 className="text-sm font-medium text-zinc-400 mb-2">
        People in room ({activeUsers.length})
      </h3>
      <div className="space-y-2">
        {presence.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-zinc-800 rounded-lg p-2.5"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: p.profile?.avatar_color ?? "#6366f1" }}
              >
                {p.profile?.name?.charAt(0) ?? "?"}
              </div>
              <span className="text-sm text-zinc-200">{p.profile?.name ?? "Unknown"}</span>
            </div>
            <StatusBadge status={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
