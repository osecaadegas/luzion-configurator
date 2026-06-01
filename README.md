# Luzion Configurator

A production-ready 2D vehicle configurator showroom for the **Luzion** microcar brand. Built with Next.js 15, Supabase, and TailwindCSS v4.

## Features

- **Vehicle catalog** � browsable grid of models with specs and colour previews
- **2D configurator** � four views (front / side / rear / interior), colour swatches, wheel options, interior trims, live price summary
- **Share & QR** � any configuration can be saved and shared via a short URL or QR code
- **Comparison mode** � side-by-side spec table for up to two vehicles
- **Lead capture** � modal form that posts a qualified lead into the database
- **Admin panel** � password-protected dashboard with vehicle CRUD, image upload, and leads management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS v4 + ShadCN UI |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL 15) |
| Storage | Supabase Storage |
| Auth | Supabase Auth (email + password) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Supabase CLI: npm i -g supabase
- A Supabase project (free tier is fine)

### 1. Clone and install

`ash
git clone https://github.com/your-org/luzion-configurator.git
cd luzion-configurator
npm install
`

### 2. Environment variables

`ash
cp .env.local.example .env.local
`

| Variable | Where to find it |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase dashboard -> Settings -> API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase dashboard -> Settings -> API |
| SUPABASE_SERVICE_ROLE_KEY | Supabase dashboard -> Settings -> API |
| NEXT_PUBLIC_SITE_URL | Your production URL |

### 3. Apply migrations

`ash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
`

Or run manually in the Supabase SQL editor:
- supabase/migrations/001_initial_schema.sql
- supabase/migrations/002_rls_policies.sql

### 4. Seed demo data (optional)

Run supabase/seed.sql in the Supabase SQL editor.

### 5. Create the vehicle-images storage bucket

In Supabase dashboard -> Storage, create a **public** bucket named vehicle-images.

### 6. Create the admin user

Create a user in Supabase dashboard -> Authentication -> Users, then run:

`sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
`

### 7. Start dev server

`ash
npm run dev
`

Showroom: http://localhost:3000
Admin: http://localhost:3000/admin (login at /login)

---

## Image Conventions

Upload vehicle images via the admin panel. Each image is linked to:
Vehicle + Colour + Wheel + Interior + View type (front/side/rear/interior/thumbnail)

Recommended: 1920x1080 px, WebP format, < 2 MB.

---

## Deployment

Push to GitHub, import in Vercel, add environment variables, deploy.
The vercel.json configures the cdg1 (Paris) region and disables caching for /api/ routes.

---

## Licence

Proprietary � all rights reserved.
