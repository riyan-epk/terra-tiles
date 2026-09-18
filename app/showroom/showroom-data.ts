import type { Pt } from "./homography";

export type RoomId = "bedroom" | "living" | "kitchen" | "bathroom";

/**
 * A photographic room scene the tile is composited onto (client-supplied
 * renders in public/rooms).
 *
 * `floor` is the floor plane's quad as fractions (0..1) of the image, ordered
 * [farLeft, farRight, nearRight, nearLeft] — it sets perspective + tile scale.
 * `clip` is the visible-floor polygon (fractions) the new tile is shown within,
 * traced to exclude rugs/furniture. `floorWidthM`/`floorDepthM` give the plane's
 * real size so a 600×1200 tile reads true. `overlay` blends the photo's own
 * light, shadow and reflections back over the new tile.
 */
export interface RoomScene {
  id: RoomId;
  label: string;
  image: string;
  width: number;
  height: number;
  floor: Pt[];
  clip?: Pt[];
  floorWidthM: number;
  floorDepthM: number;
  overlay: number;
}

const W = 1536;
const H = 1024;

export const ROOM_SCENES: RoomScene[] = [
  {
    id: "bedroom",
    label: "Bedroom",
    image: "/rooms/bedroom.png",
    width: W,
    height: H,
    floor: [
      { x: 0.0, y: 0.52 },
      { x: 1.0, y: 0.52 },
      { x: 1.2, y: 1.08 },
      { x: -0.2, y: 1.08 },
    ],
    clip: [
      { x: -0.05, y: 1.08 },
      { x: 1.05, y: 1.08 },
      { x: 0.95, y: 0.73 },
      { x: 0.72, y: 0.73 },
      { x: 0.62, y: 0.81 },
      { x: 0.4, y: 0.81 },
      { x: 0.3, y: 0.73 },
      { x: 0.05, y: 0.73 },
    ],
    floorWidthM: 5.5,
    floorDepthM: 5.5,
    overlay: 0.85,
  },
  {
    id: "living",
    label: "Living Room",
    image: "/rooms/livingroom.png",
    width: W,
    height: H,
    floor: [
      { x: 0.0, y: 0.5 },
      { x: 1.0, y: 0.5 },
      { x: 1.2, y: 1.08 },
      { x: -0.2, y: 1.08 },
    ],
    clip: [
      { x: -0.2, y: 1.08 },
      { x: 1.2, y: 1.08 },
      { x: 1.0, y: 0.5 },
      { x: 0.72, y: 0.5 },
      { x: 0.62, y: 0.76 },
      { x: 0.3, y: 0.78 },
      { x: 0.26, y: 0.84 },
      { x: 0.0, y: 0.84 },
    ],
    floorWidthM: 6,
    floorDepthM: 6,
    overlay: 0.85,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    image: "/rooms/kitchen.png",
    width: W,
    height: H,
    floor: [
      { x: 0.05, y: 0.62 },
      { x: 0.95, y: 0.62 },
      { x: 1.15, y: 1.08 },
      { x: -0.15, y: 1.08 },
    ],
    clip: [
      { x: -0.15, y: 1.08 },
      { x: 1.15, y: 1.08 },
      { x: 1.0, y: 0.7 },
      { x: 0.66, y: 0.7 },
      { x: 0.62, y: 0.78 },
      { x: 0.34, y: 0.78 },
      { x: 0.3, y: 0.7 },
      { x: 0.0, y: 0.7 },
    ],
    floorWidthM: 5,
    floorDepthM: 4.5,
    overlay: 0.82,
  },
  {
    id: "bathroom",
    label: "Bathroom",
    image: "/rooms/bathroom.png",
    width: W,
    height: H,
    floor: [
      { x: 0.02, y: 0.6 },
      { x: 0.98, y: 0.6 },
      { x: 1.1, y: 1.08 },
      { x: -0.1, y: 1.08 },
    ],
    clip: [
      { x: -0.05, y: 1.08 },
      { x: 1.05, y: 1.08 },
      { x: 1.0, y: 0.75 },
      { x: 0.62, y: 0.75 },
      { x: 0.6, y: 0.84 },
      { x: 0.4, y: 0.84 },
      { x: 0.38, y: 0.75 },
      { x: 0.0, y: 0.75 },
    ],
    floorWidthM: 4.5,
    floorDepthM: 4,
    overlay: 0.85,
  },
];
