# Space Rooms — Setup Guide

## 1. Create a Supabase Project (2 min, free)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `space-rooms`, pick a password and region
3. Wait ~1 minute for it to provision

## 2. Copy Your Credentials

1. In the Supabase dashboard go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key
3. Paste into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 3. Run the SQL Migrations

1. In Supabase dashboard → **SQL Editor → New query**
2. Paste the contents of `supabase/migrations/001_schema.sql` → **Run**
3. Paste the contents of `supabase/migrations/002_seed.sql` → **Run**

## 4. Enable Realtime

1. In Supabase dashboard → **Database → Replication**
2. Under **Realtime**, make sure `equipment` and `presence` tables are enabled
   (The SQL already adds them to the publication, but check the UI to confirm)

## 5. Start the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

- **Select your user** from the dropdown in the top-right navbar
- **Equipment Room** (`/equipment`): check out and return items. Dots on the map go green (available) or red (in use).
- **Presence Room** (`/presence`): check in to appear in the room, check out to leave. Avatar appears on the map.
- **Open two tabs** — changes appear instantly across both via Supabase realtime.
