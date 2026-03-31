import Link from 'next/link';

const rooms = [
  {
    href: '/equipment',
    title: 'Equipment Room',
    description: 'Check out and return shared equipment. See live availability on the room map.',
    icon: '🔧',
    color: '#6366f1',
  },
  {
    href: '/presence',
    title: 'Presence Room',
    description: 'See who\'s currently in the space. Check in when you arrive, check out when you leave.',
    icon: '👥',
    color: '#22c55e',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
          Space Rooms
        </h1>
        <p style={{ color: '#6b6b80', marginTop: 6, fontSize: 15 }}>
          Real-time equipment and presence for your physical space
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700 }}>
        {rooms.map((room) => (
          <Link
            key={room.href}
            href={room.href}
            style={{
              background: '#1a1a24',
              border: `1px solid ${room.color}33`,
              borderRadius: 12,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              transition: 'border-color 0.15s, box-shadow 0.15s',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: 36 }}>{room.icon}</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: room.color }}>{room.title}</h2>
              <p style={{ fontSize: 13, color: '#6b6b80', marginTop: 6, lineHeight: 1.5 }}>
                {room.description}
              </p>
            </div>
            <div
              style={{
                marginTop: 'auto',
                fontSize: 12,
                fontWeight: 600,
                color: room.color,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Open room →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
