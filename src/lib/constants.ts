// Percentage-based overlay positions for equipment dots in the SVG room
// Values are [left%, top%] within the RoomViewer container
export const EQUIPMENT_POSITIONS: Record<string, [number, number]> = {
  'b1000000-0000-0000-0000-000000000001': [20, 30],  // Projector A
  'b1000000-0000-0000-0000-000000000002': [75, 28],  // Projector B
  'b1000000-0000-0000-0000-000000000003': [12, 55],  // Whiteboard 1
  'b1000000-0000-0000-0000-000000000004': [82, 55],  // Whiteboard 2
  'b1000000-0000-0000-0000-000000000005': [50, 65],  // Laptop Cart
  'b1000000-0000-0000-0000-000000000006': [35, 45],  // Camera Rig
  'b1000000-0000-0000-0000-000000000007': [65, 42],  // PA System
  'b1000000-0000-0000-0000-000000000008': [50, 35],  // Video Conference
};

// Avatar grid positions for presence room [left%, top%]
export const PRESENCE_POSITIONS: [number, number][] = [
  [20, 40], [35, 40], [50, 40], [65, 40], [80, 40],
];
