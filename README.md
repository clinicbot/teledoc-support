# Tele-Derm Support Desk

A simple, friendly web app where doctors can report problems with the
tele-dermatology platform, and the support team can triage and resolve them.

- Doctors fill in a short form and get a ticket number.
- Anyone with the ticket number can check its status at `/ticket/<number>`.
- The support team works through tickets at `/support`, updating status and
  leaving notes for the doctor.

No login required. Anyone with the link can submit or read tickets.

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- Deploys to Vercel; database via Neon (free tier).

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Get a Postgres database

The easiest path is a free [Neon](https://neon.tech) database (no install
required). Create a project, copy the connection string, and paste it into
`.env`:

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL=postgresql://...
```

Alternatively run Postgres locally with Docker:

```bash
docker run --name teledoc-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
# Then in .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/teledoc?schema=public"
```

### 3. Apply migrations

```bash
npx prisma migrate dev --name init
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), **New Project → Import** the repo.
3. In the Vercel project, open **Storage → Create Database → Neon Postgres**
   and attach it. Vercel will inject `DATABASE_URL` automatically.
4. Click **Deploy**. The build runs `prisma migrate deploy` automatically, so
   the database schema will be created on first deploy.

That's it — the site will be live at `https://<your-project>.vercel.app`.

## Routes

| Path | Who | Purpose |
| --- | --- | --- |
| `/` | Everyone | Landing page |
| `/new` | Doctors | Submit a new ticket |
| `/submitted/<id>` | Doctors | Confirmation after submitting |
| `/ticket/<id>` | Doctors | Read-only view of a ticket's status |
| `/support` | Support team | Dashboard of all tickets, with filters |
| `/support/<id>` | Support team | View a ticket and update status / notes |

## Ticket fields

- Auto-incrementing ID (shown as `#0001`, `#0002`, …)
- Short description, detailed description
- Doctor's name (required), email, phone (optional)
- Priority: *Suggestion for improvement* / *Not urgent* / *Very urgent*
- Status: *New* / *Acknowledged* / *Under investigation* / *Planned for future*
  / *Completed and corrected*
- Free-text notes from the support team (visible to the doctor)
- Created / updated timestamps

## Notes on access control

The support dashboard is currently open to anyone with the link, matching the
"no login" requirement. If you want to lock it down later, the simplest paths
are: enable Vercel password-protected deployments, or add a small middleware
that checks a passcode cookie before allowing access to `/support`.
