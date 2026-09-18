# Connecting the database

The app runs on in-memory demo data until you set `DATABASE_URL`. Once set, it
uses a real Postgres database and everything persists.

## 1. Get a free Postgres connection string (Neon — ~2 minutes)

1. Go to **https://neon.tech** and sign up (GitHub/Google login is fine).
2. Click **Create project** (any name, e.g. `terra-saas`). Pick the region
   closest to you.
3. On the project dashboard, find **Connection string** and copy it. It looks
   like:
   `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

> Alternative: in your Vercel project → **Storage → Create → Postgres**, then
> copy the `DATABASE_URL` it gives you. Same result.

## 2. Add it locally

1. Copy `.env.example` to `.env`.
2. Paste your string as `DATABASE_URL=...`.

## 3. Create the tables and seed the demo brands

```bash
npm run db:setup
```

This creates the schema and loads the TERRA + LUMEN demo tenants. (It runs
`prisma db push` then `prisma db seed`.)

## 4. Run it

```bash
npm run dev
```

Everything you do in the admin now persists across restarts. Use
`npm run db:studio` to browse the data in a table UI.

## Deploying to Vercel

Add `DATABASE_URL` (and optionally `ADMIN_PASSCODE`, `NEXT_PUBLIC_ROOT_DOMAIN`)
in **Vercel → Project → Settings → Environment Variables**, then redeploy. Run
`npm run db:setup` once against the production database to create/seed tables.
