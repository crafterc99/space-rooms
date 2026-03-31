import { Equipment } from '@/types';
import { EQUIPMENT_POSITIONS } from '@/lib/constants';

interface EquipmentOverlayProps {
  equipment: Equipment[];
}

const statusColor: Record<string, string> = {
  available:   '#22c55e',
  in_use:      '#ef4444',
  maintenance: '#eab308',
};

export default function EquipmentOverlay({ equipment }: EquipmentOverlayProps) {
  return (
    <>
      {equipment.map((item) => {
        const pos = EQUIPMENT_POSITIONS[item.id];
        if (!pos) return null;
        const [left, top] = pos;
        const color = statusColor[item.status] ?? '#6366f1';

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)',
            }}
            title={`${item.name} — ${item.status}`}
          >
            {/* Outer glow */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `${color}22`,
                border: `2px solid ${color}66`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${color}44`,
              }}
            >
              {/* Inner dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
            </div>
            {/* Label */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 4,
                background: '#0f0f14ee',
                color: '#e8e8f0',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                border: '1px solid #2a2a3a',
                pointerEvents: 'none',
              }}
            >
              {item.name}
            </div>
          </div>
        );
      })}
    </>
  );
}
