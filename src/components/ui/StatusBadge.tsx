interface StatusBadgeProps {
  status: 'available' | 'in_use' | 'maintenance';
}

const config = {
  available:   { label: 'Available',    bg: '#14532d', color: '#22c55e' },
  in_use:      { label: 'In Use',       bg: '#7f1d1d', color: '#ef4444' },
  maintenance: { label: 'Maintenance',  bg: '#713f12', color: '#eab308' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, bg, color } = config[status];
  return (
    <span
      style={{ background: bg, color, border: `1px solid ${color}33` }}
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
    >
      {label}
    </span>
  );
}
