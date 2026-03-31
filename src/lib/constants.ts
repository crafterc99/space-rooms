// Equipment overlay positions as percentages within the room SVG
export const EQUIPMENT_POSITIONS: Record<string, { x: number; y: number }> = {
  laptop_a: { x: 20, y: 35 },
  laptop_b: { x: 35, y: 35 },
  projector: { x: 50, y: 15 },
  markers: { x: 75, y: 25 },
  camera: { x: 15, y: 60 },
  microphone: { x: 50, y: 50 },
  monitor: { x: 70, y: 55 },
  keyboard: { x: 40, y: 65 },
};

// Presence avatar positions
export const PRESENCE_POSITIONS: { x: number; y: number }[] = [
  { x: 25, y: 40 },
  { x: 45, y: 35 },
  { x: 65, y: 40 },
  { x: 30, y: 60 },
  { x: 55, y: 60 },
];
