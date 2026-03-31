import Link from "next/link";

const rooms = [
  {
    href: "/equipment",
    title: "Equipment Room",
    description: "Track and manage equipment availability in real-time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    href: "/presence",
    title: "Presence Room",
    description: "See who's currently in the space and check in or out.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <circle cx="18" cy="9" r="3" />
        <path d="M21 21v-1.5a3 3 0 00-3-3" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <Link
            key={room.href}
            href={room.href}
            className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all"
          >
            <div className="text-indigo-400 mb-3">{room.icon}</div>
            <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
              {room.title}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">{room.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
