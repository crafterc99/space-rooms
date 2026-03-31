import { ReactNode } from "react";

interface RoomViewerProps {
  children?: ReactNode;
  label: string;
}

export default function RoomViewer({ children, label }: RoomViewerProps) {
  return (
    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700">
      {/* SVG Room Illustration */}
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back wall */}
        <rect x="50" y="30" width="700" height="280" fill="#1e1e2e" />
        {/* Wall accent line */}
        <line x1="50" y1="310" x2="750" y2="310" stroke="#313244" strokeWidth="2" />
        {/* Floor */}
        <polygon points="0,500 800,500 750,310 50,310" fill="#181825" />
        {/* Floor grid lines for perspective */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`floor-h-${i}`}
            x1="50"
            y1={310 + i * 40}
            x2="750"
            y2={310 + i * 40}
            stroke="#1e1e2e"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={`floor-v-${i}`}
            x1={50 + i * 100}
            y1="310"
            x2={i * 100}
            y2="500"
            stroke="#1e1e2e"
            strokeWidth="1"
          />
        ))}
        {/* Left wall shadow */}
        <polygon points="0,500 50,310 50,30 0,60" fill="#11111b" />
        {/* Right wall shadow */}
        <polygon points="800,500 750,310 750,30 800,60" fill="#11111b" />
        {/* Window on back wall */}
        <rect x="300" y="60" width="200" height="150" rx="4" fill="#313244" />
        <rect x="310" y="70" width="85" height="130" rx="2" fill="#1a1a2e" />
        <rect x="405" y="70" width="85" height="130" rx="2" fill="#1a1a2e" />
        {/* Window glow */}
        <rect x="310" y="70" width="85" height="130" rx="2" fill="#6366f1" opacity="0.05" />
        <rect x="405" y="70" width="85" height="130" rx="2" fill="#6366f1" opacity="0.05" />
        {/* Table */}
        <rect x="150" y="220" width="500" height="15" rx="3" fill="#45475a" />
        <rect x="180" y="235" width="8" height="75" fill="#313244" />
        <rect x="612" y="235" width="8" height="75" fill="#313244" />
      </svg>
      {/* Overlay children (equipment dots, avatars) */}
      <div className="absolute inset-0">{children}</div>
      {/* Room label */}
      <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg text-sm text-zinc-300 backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}
