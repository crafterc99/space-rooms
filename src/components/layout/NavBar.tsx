import Link from 'next/link';
import UserPicker from './UserPicker';

const links = [
  { href: '/',          label: 'Dashboard' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/presence',  label: 'Presence'  },
  { href: '/bookings',  label: 'Bookings'  },
];

export default function NavBar() {
  return (
    <nav
      style={{
        background: '#1a1a24',
        borderBottom: '1px solid #2a2a3a',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      {/* Brand */}
      <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#6366f1', letterSpacing: '-0.02em' }}>
        Space Rooms
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#6b6b80',
              transition: 'color 0.15s',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* User picker */}
      <UserPicker />
    </nav>
  );
}
