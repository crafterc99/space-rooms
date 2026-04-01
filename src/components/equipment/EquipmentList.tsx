'use client';

import { useState, useTransition } from 'react';
import { Equipment } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { checkOutEquipment, returnEquipment } from '@/app/actions/equipment';
import { useUserStore } from '@/store/userStore';

interface EquipmentListProps {
  equipment: Equipment[];
}

function getDueInfo(dueBackAt: string | null): { text: string; color: string } | null {
  if (!dueBackAt) return null;
  const now = new Date();
  const due = new Date(dueBackAt);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    const h = Math.floor(Math.abs(diffHours));
    return {
      text: h < 1 ? 'Overdue — less than 1h ago' : `Overdue by ${h}h`,
      color: '#ef4444',
    };
  }
  if (diffHours < 1) return { text: 'Due back in < 1h', color: '#eab308' };
  if (diffHours < 24) return { text: `Due back in ${Math.floor(diffHours)}h`, color: '#eab308' };
  return {
    text: `Due back ${due.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
    color: '#6b6b80',
  };
}

export default function EquipmentList({ equipment }: EquipmentListProps) {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [isPending, startTransition] = useTransition();
  const [checkoutItemId, setCheckoutItemId] = useState<string | null>(null);
  const [dueBackValue, setDueBackValue] = useState('');

  function handleCheckOut(id: string) {
    if (!currentUserId) return;
    const dueBackAt = dueBackValue ? new Date(dueBackValue).toISOString() : undefined;
    startTransition(() => checkOutEquipment(id, currentUserId, dueBackAt));
    setCheckoutItemId(null);
    setDueBackValue('');
  }

  function handleReturn(id: string) {
    if (!currentUserId) return;
    startTransition(() => returnEquipment(id, currentUserId));
  }

  const nowIso = new Date().toISOString().slice(0, 16);

  return (
    <div className="flex flex-col gap-2">
      {equipment.map((item) => {
        const dueInfo = getDueInfo(item.due_back_at);
        const isOverdue = dueInfo?.color === '#ef4444';
        const isCheckingOut = checkoutItemId === item.id;

        return (
          <div key={item.id}>
            <div
              style={{
                background: '#1a1a24',
                border: `1px solid ${isOverdue ? '#ef444433' : '#2a2a3a'}`,
                borderRadius: isCheckingOut ? '8px 8px 0 0' : 8,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                {item.profiles && (
                  <div style={{ fontSize: 12, color: '#6b6b80', marginTop: 2 }}>
                    Checked out by{' '}
                    <span style={{ color: item.profiles.avatar_color, fontWeight: 600 }}>
                      {item.profiles.name}
                    </span>
                    {dueInfo && (
                      <span style={{ color: dueInfo.color, marginLeft: 8, fontWeight: 600 }}>
                        · {dueInfo.text}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <StatusBadge status={item.status} />

              {currentUserId && (
                <>
                  {item.status === 'available' && !isCheckingOut && (
                    <button
                      onClick={() => {
                        setCheckoutItemId(item.id);
                        setDueBackValue('');
                      }}
                      disabled={isPending}
                      style={{
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        opacity: isPending ? 0.6 : 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Check Out
                    </button>
                  )}
                  {item.status === 'available' && isCheckingOut && (
                    <button
                      onClick={() => {
                        setCheckoutItemId(null);
                        setDueBackValue('');
                      }}
                      style={{
                        background: 'transparent',
                        color: '#6b6b80',
                        border: '1px solid #2a2a3a',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  {item.status === 'in_use' && item.checked_out_by === currentUserId && (
                    <button
                      onClick={() => handleReturn(item.id)}
                      disabled={isPending}
                      style={{
                        background: '#374151',
                        color: '#e8e8f0',
                        border: '1px solid #4b5563',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        opacity: isPending ? 0.6 : 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Return
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Inline due-date form */}
            {isCheckingOut && (
              <div
                style={{
                  background: '#111118',
                  border: '1px solid #6366f133',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#6b6b80',
                    flex: 1,
                  }}
                >
                  Due back (optional):
                  <input
                    type="datetime-local"
                    value={dueBackValue}
                    min={nowIso}
                    onChange={(e) => setDueBackValue(e.target.value)}
                    style={{
                      background: '#1a1a24',
                      border: '1px solid #2a2a3a',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 12,
                      color: '#e8e8f0',
                      outline: 'none',
                    }}
                  />
                </label>
                <button
                  onClick={() => handleCheckOut(item.id)}
                  disabled={isPending}
                  style={{
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    opacity: isPending ? 0.6 : 1,
                  }}
                >
                  {isPending ? 'Checking out…' : 'Confirm'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
