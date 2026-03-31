import { ReactNode } from 'react';

interface RoomViewerProps {
  children?: ReactNode;
}

export default function RoomViewer({ children }: RoomViewerProps) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      {/* SVG room illustration */}
      <svg
        viewBox="0 0 800 450"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        {/* Back wall */}
        <rect x="0" y="0" width="800" height="450" fill="#0c0c12" />

        {/* Floor in perspective */}
        <polygon points="0,450 800,450 620,250 180,250" fill="#141420" />

        {/* Left wall */}
        <polygon points="0,0 0,450 180,250 180,0" fill="#111118" />

        {/* Right wall */}
        <polygon points="800,0 800,450 620,250 620,0" fill="#0e0e16" />

        {/* Ceiling */}
        <polygon points="0,0 800,0 620,0 180,0" fill="#0a0a10" />

        {/* Floor grid lines */}
        <g stroke="#1e1e2e" strokeWidth="1" opacity="0.5">
          {/* Horizontal lines */}
          <line x1="0" y1="350" x2="800" y2="350" />
          <line x1="0" y1="400" x2="800" y2="400" />
          {/* Converging lines */}
          <line x1="0" y1="450" x2="400" y2="250" />
          <line x1="200" y1="450" x2="450" y2="250" />
          <line x1="400" y1="450" x2="500" y2="250" />
          <line x1="600" y1="450" x2="550" y2="250" />
          <line x1="800" y1="450" x2="600" y2="250" />
        </g>

        {/* Back wall horizontal lines */}
        <g stroke="#1e1e2e" strokeWidth="1" opacity="0.3">
          <line x1="180" y1="150" x2="620" y2="150" />
          <line x1="180" y1="200" x2="620" y2="200" />
        </g>

        {/* Corner lines */}
        <line x1="180" y1="0" x2="180" y2="250" stroke="#2a2a3a" strokeWidth="1.5" />
        <line x1="620" y1="0" x2="620" y2="250" stroke="#2a2a3a" strokeWidth="1.5" />
        <line x1="180" y1="250" x2="620" y2="250" stroke="#2a2a3a" strokeWidth="1.5" />

        {/* Subtle ambient light from ceiling */}
        <ellipse cx="400" cy="0" rx="200" ry="60" fill="#6366f1" opacity="0.04" />

        {/* Floor ambient reflection */}
        <ellipse cx="400" cy="390" rx="250" ry="40" fill="#6366f1" opacity="0.03" />
      </svg>

      {/* Overlay children (dots, avatars, etc) */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
