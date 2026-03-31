'use client';

import { Equipment } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { checkOutEquipment, returnEquipment } from '@/app/actions/equipment';
import { useUserStore } from '@/store/userStore';
import { useTransition } from 'react';

interface EquipmentListProps {
  equipment: Equipment[];
}

export default function EquipmentList({ equipment }: EquipmentListProps) {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [isPending, startTransition] = useTransition();

  function handleCheckOut(id: string) {
    if (!currentUserId) return;
    startTransition(() => checkOutEquipment(id, currentUserId));
  }

  function handleReturn(id: string) {
    if (!currentUserId) return;
    startTransition(() => returnEquipment(id, currentUserId));
  }

  return (
    <div className="flex flex-col gap-2">
      {equipment.map((item) => (
        <div
          key={item.id}
          style={{
            background: '#1a1a24',
            border: '1px solid #2a2a3a',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
            {item.profiles && (
              <div style={{ fontSize: 12, color: '#6b6b80', marginTop: 2 }}>
                Checked out by {item.profiles.name}
              </div>
            )}
          </div>

          <StatusBadge status={item.status} />

          {currentUserId && (
            <>
              {item.status === 'available' && (
                <button
                  onClick={() => handleCheckOut(item.id)}
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
                  }}
                >
                  Check Out
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
                  }}
                >
                  Return
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
