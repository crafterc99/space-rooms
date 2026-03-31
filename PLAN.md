# Space Rooms — Implementation Plan

## Context
Build a real-time visual dashboard ("Space Rooms") showing equipment availability and people presence in a physical space. Two visual rooms with overlays that update live via Supabase realtime. New standalone project at `/Users/crafterc/Claude Test/space-rooms/`, published to GitHub as `crafterc99/space-rooms`.

---

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (postcss plugin, no config file)
- Supabase (database + realtime subscriptions)
- Zustand (user picker state with localStorage persist)
- No auth — simple user picker dropdown

---

## Project Structure

```
space-rooms/
├── supabase/migrations/
│   ├── 001_schema.sql          # Tables + triggers + realtime
│   └── 002_seed.sql            # 5 users, 8 equipment items
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with NavBar + UserPicker
│   │   ├── page.tsx            # Dashboard — two room cards
│   │   ├── globals.css
│   │   ├── equipment/page.tsx  # Equipment Room (SSR + client realtime)
│   │   ├── presence/page.tsx   # Presence Room (SSR + client realtime)
│   │   └── actions/
│   │       ├── equipment.ts    # checkOutEquipment(), returnEquipment()
│   │       └── presence.ts     # checkIn(), checkOut()
│   ├── components/
│   │   ├── ui/StatusBadge.tsx
│   │   ├── room/
│   │   │   ├── RoomViewer.tsx         # SVG room visual + overlay children
│   │   │   ├── EquipmentOverlay.tsx   # Colored dots per equipment item
│   │   │   └── PresenceOverlay.tsx    # Avatar dots for people
│   │   ├── equipment/
│   │   │   ├── EquipmentRoom.tsx      # Client component w/ realtime sub
│   │   │   └── EquipmentList.tsx      # Side panel list + buttons
│   │   ├── presence/
│   │   │   ├── PresenceRoom.tsx       # Client component w/ realtime sub
│   │   │   └── CheckInOutPanel.tsx    # Check in/out buttons
│   │   └── layout/
│   │       ├── UserPicker.tsx         # "You are: [dropdown]"
│   │       └── NavBar.tsx
│   ├── lib/
│   │   ├── supabase/client.ts   # createBrowserClient (realtime + client mutations)
│   │   ├── supabase/server.ts   # createServerClient (SSR + server actions)
│   │   └── constants.ts         # Equipment overlay positions (% based)
│   ├── store/userStore.ts       # Zustand: currentUserId with persist
│   └── types/index.ts           # Profile, Equipment, Presence types
├── .env.local                   # NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
├── next.config.ts
├── package.json
└── CLAUDE.md
```

---

## Implementation Phases

### Phase 1: Scaffold
- `npx create-next-app@latest space-rooms --typescript --eslint --app --src-dir`
- Install deps: `@supabase/supabase-js`, `@supabase/ssr`, `zustand`, `tailwindcss`, `@tailwindcss/postcss`
- Configure postcss, globals.css, .env.local placeholder, .gitignore

### Phase 2: Database Schema + Seed
- Write SQL migrations for 4 tables: `profiles`, `equipment`, `equipment_logs`, `presence`
- Seed 5 users + 8 equipment items
- Include `REPLICA IDENTITY FULL` + realtime publication for `equipment` and `presence`

### Phase 3: Types + Supabase Clients
- TypeScript types for all tables
- Browser client (singleton via `createBrowserClient`)
- Server client (per-request via `createServerClient` with cookies)
- Equipment position constants for overlay placement

### Phase 4: Zustand Store
- `userStore.ts` — `currentUserId` with `persist` middleware to localStorage

### Phase 5: Server Actions
- `checkOutEquipment(equipmentId, userId)` — update status + insert log
- `returnEquipment(equipmentId, userId)` — update status + insert log
- `checkIn(userId)` — update presence to 'in'
- `checkOut(userId)` — update presence to 'out'
- All call `revalidatePath` after mutation

### Phase 6: Components
- **StatusBadge** — green/yellow/red badge based on status
- **RoomViewer** — pure SVG room illustration (dark room with perspective floor/walls), children rendered as absolute overlays
- **EquipmentOverlay** — glowing colored dots positioned via constants map
- **PresenceOverlay** — avatar circles with name labels
- **EquipmentRoom** — fetches initial data via props, subscribes to `postgres_changes` on `equipment` table
- **EquipmentList** — side panel with status + check-out/return buttons
- **PresenceRoom** — same pattern, subscribes to `presence` table
- **CheckInOutPanel** — check-in/out buttons + list of people currently in
- **UserPicker** — dropdown of all profiles, persists selection
- **NavBar** — links to /, /equipment, /presence

### Phase 7: Pages + Layout
- Root layout with NavBar + UserPicker
- Dashboard (`/`) — two cards linking to each room
- Equipment Room (`/equipment`) — server-fetch initial data, render EquipmentRoom client component
- Presence Room (`/presence`) — server-fetch initial data, render PresenceRoom client component

### Phase 8: GitHub
- `git init`, initial commit
- Create repo `crafterc99/space-rooms` via `gh repo create`
- Push

---

## Key Design Decisions
| Decision | Choice | Why |
|---|---|---|
| Mutations | Server Actions | Clean, no API routes needed |
| Room visual | Pure SVG in code | Zero external assets |
| User identity | Zustand + localStorage | No auth complexity |
| Realtime | `postgres_changes` on UPDATE | All rows seeded upfront, only updates happen |
| Overlay positioning | Percentage-based constants map | Simple, easy to tweak |

---

## Supabase Setup (only manual step — free, 2 min)
Everything is automated except the Supabase cloud project. User needs to:
1. Go to supabase.com → New Project (free tier)
2. Copy the URL + anon key into `.env.local` (file created with placeholders)
3. Run the SQL migrations in the Supabase SQL editor (copy-paste)

A `setup.md` will be included with exact steps.

---

## Verification
1. `npm run dev` — app starts on localhost:3000
2. Dashboard shows two room cards
3. Equipment Room: SVG room with colored dots, side panel with equipment list
4. Click "Check Out" on an item → dot turns red, status updates, appears live
5. Presence Room: check in → avatar appears, count updates
6. Open two browser tabs — changes in one appear instantly in the other (realtime)
7. `npm run build` — no TypeScript or build errors
