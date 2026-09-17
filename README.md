# TERRA — Premium Tile Showroom & 3D Visualizer

A premium marketing website and interactive 3D room visualizer for a luxury tiles company. Built with Next.js, Three.js, and Framer Motion.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-r186-049EF4?logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript)

---

## Overview

**TERRA** is a fully responsive, editorial-style website showcasing premium tile collections — paired with a real-time 3D room visualizer that lets customers preview tiles on floors and walls before purchasing.

### Marketing Website (`/`)

- Dark, moody design palette (charcoal, warm stone, cream, gold accents)
- Editorial typography with DM Serif Display + DM Sans
- Scroll-triggered animations powered by Framer Motion
- Grain texture overlays and custom hover states
- 9 curated sections:
  - **Hero** — full-screen marble background with animated headline
  - **About** — asymmetric grid with company stats
  - **Categories** — horizontal drag-scroll gallery (Marble, Wood, Stone, Concrete, Mosaic, Terracotta)
  - **Product Showcase** — filterable product grid with lightbox detail view
  - **Tile Specifications** — 6-card grid with SVG icons
  - **3D Room Preview** — teaser section linking to the visualizer
  - **Testimonials** — auto-scrolling marquee
  - **Inquiry Forms** — dual-column customer & dealer forms
  - **Footer** — brand links, social icons, contact info

### 3D Room Visualizer (`/visualizer`)

- Interactive 3D room rendered with React Three Fiber
- **5 sample tiles** with PBR materials (roughness, metalness, texture repetition)
- **Surface targeting** — apply tiles to: Entire Room, Floor Only, All Walls, Left/Right/Back Wall
- **360-degree orbit controls** with zoom limits and camera reset
- Procedural room geometry with furniture (sofa, coffee table, plant, wall art, rug)
- Directional lighting with shadows and gold accent lights
- Texture caching for instant tile switching
- Responsive layout: side panel on desktop, bottom overlay on mobile
- Data-driven tile config — add new tiles by extending a single array

---

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)      |
| Language     | TypeScript 7                            |
| Styling      | Tailwind CSS 4 (CSS cascade layers)     |
| Animation    | Framer Motion 13                        |
| 3D Engine    | Three.js r186 + React Three Fiber 9     |
| 3D Utilities | @react-three/drei 10                    |
| Fonts        | Google Fonts (DM Serif Display, DM Sans)|

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/riyan-epk/terra-tiles.git
cd terra-tiles
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site and [http://localhost:3000/visualizer](http://localhost:3000/visualizer) for the 3D room.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
├── layout.tsx                # Root layout with Google Fonts
├── page.tsx                  # Main marketing page
├── globals.css               # Tailwind v4 theme & custom styles
├── components/
│   ├── Navigation.tsx        # Fixed nav with mobile hamburger menu
│   ├── Hero.tsx              # Full-screen hero section
│   ├── About.tsx             # Company story & stats
│   ├── Categories.tsx        # Horizontal drag-scroll gallery
│   ├── ProductShowcase.tsx   # Filterable grid with lightbox
│   ├── TileInfo.tsx          # Specifications card grid
│   ├── RoomPreview.tsx       # 3D visualizer teaser
│   ├── Testimonials.tsx      # Auto-scrolling marquee
│   ├── InquiryForms.tsx      # Customer & dealer forms
│   ├── Footer.tsx            # Site footer
│   └── placeholders.ts       # Inline SVG data URI textures
├── visualizer/
│   ├── page.tsx              # Visualizer page layout
│   ├── Scene.tsx             # Three.js canvas, lighting, controls
│   ├── Room.tsx              # 3D room geometry & materials
│   ├── TileSelector.tsx      # Tile selection panel UI
│   └── tile-data.ts          # Tile product definitions
public/
└── tiles/                    # Procedural SVG tile textures (512×512)
```

---

## Adding New Tiles

Tiles are data-driven. Add a new entry to the `tiles` array in `app/visualizer/tile-data.ts`:

```typescript
{
  id: "new-tile",
  name: "Nero Marquina",
  texture: "/tiles/nero-marquina.svg",
  size: "60×60 cm",
  category: "Marble",
  color: "#1a1a1a",
  roughness: 0.3,
  metalness: 0.1,
  repeatX: 2,
  repeatY: 2,
}
```

Place the tile texture (SVG, PNG, or JPG) in `public/tiles/` and it will appear in the selector panel automatically.

---

## Deployment

### Vercel (Recommended)

```bash
npx vercel --yes
```

### Other Platforms

Any platform that supports Next.js — Netlify, Railway, Docker, etc.

---

## License

MIT
