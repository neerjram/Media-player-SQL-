# MusicStream (Frontend + Backend + SQL Database)

This repository contains a full-stack music streaming frontend (React + Tailwind) and backend (Express + Prisma) with an SQL database. It supports browsing/searching music, managing playlists, and basic admin CRUD for songs and artists. The database layer is the core focus and all critical mutations satisfy ACID using SQL transactions via Prisma.

## Contents
- Overview and Features
- Tech Stack
- App Architecture and Data Flow
- Database Design (SQL) and ACID Guarantees
- REST API (Endpoints and Contracts)
- Frontend (Pages and Components)
- How to Run (Dev)
- Switching SQLite → Postgres/MySQL
- Notes on Audio Playback

---

## Overview and Features

- Browse trending songs, artists, and playlists
- Search songs/artists (with fallback to mock data)
- Player with play/pause, next/previous, queue and progress/volume
- User playlists (create playlist, add/remove songs)
- Admin CRUD:
  - Add Artist
  - Add Song (auto upsert artist)
  - (Endpoints exist for Update/Delete too)
- All write operations persist to the SQL database and reflect in the UI

---

## Tech Stack

- Frontend: React (Vite), React Router, TailwindCSS
- Backend: Node.js (Express), Prisma ORM
- Database (Dev): SQLite (single file)
- Database (Prod-ready option): Postgres/MySQL (via Prisma switch)

---

## App Architecture and Data Flow

1) UI (React) triggers actions (e.g., Add Song).
2) MusicContext calls the API via Axios (`src/services/http.js`).
3) API (Express) validates and executes SQL operations with Prisma.
4) SQL changes are committed transactionally. Responses return normalized JSON.
5) UI updates state and re-renders with latest server data.

---

## Database Design (SQL) and ACID Guarantees

Prisma schema: `backend/prisma/schema.prisma`

Tables:
- `Artist` (id, name, genre?, country?)
- `Song` (id, title, duration seconds, plays, likes, artistId FK -> Artist)
- `Playlist` (id, name, user)
- `PlaylistSong` (playlistId, songId) composite PK for M:N

Relationships:
- Artist 1—N Song
- Playlist N—M Song via PlaylistSong

ACID (Atomicity, Consistency, Isolation, Durability):
- Atomicity: All multi-step mutations are wrapped in `prisma.$transaction(...)`
  - Create Song + (Upsert Artist)
  - Add/Remove Song in Playlist
  - Delete Artist (cascades: delete songs + playlist-song links)
- Consistency: FKs and composite PKs ensure valid states only
- Isolation: Each request uses a distinct DB transaction to avoid partial conflicts
- Durability: Changes are on-disk (SQLite); on Postgres/MySQL, logs and WALs ensure durability

---

## REST API (Endpoints and Contracts)

Base URL (Dev): `http://localhost:4000`

Songs:
- GET `/songs/new` → `[ { id, title, artist, duration, plays, likes } ]`
- POST `/songs` body `{ title, artist, duration }` → creates artist if needed (transaction)
- PUT `/songs/:id` body `{ title?, artist?, duration? }` → updates song (transaction when artist changes)
- DELETE `/songs/:id` → removes song and related playlist links (transaction)

Artists:
- GET `/artists` → `[ { id, name, genre, country } ]`
- POST `/artists` body `{ name, genre?, country? }` → creates artist
- PUT `/artists/:id` body `{ name?, genre?, country? }` → updates artist
- DELETE `/artists/:id` → deletes artist, all their songs, and related playlist links (transaction)

Playlists:
- GET `/playlists` → `[ { id, name, user } ]`
- POST `/playlists` body `{ name, user? }` → `{ id, name, user }`
- GET `/playlists/:id` → `{ id, name, user, songs: [songDTO] }`
- POST `/playlists/:id/songs` body `{ songId }` → add song to playlist (transaction)
- DELETE `/playlists/:id/songs/:songId` → remove song from playlist (transaction)

Search:
- GET `/search?q=...` → `{ songs: [songDTO], artists: [artist] }`

---

## Frontend (Pages and Components)

Pages (`src/pages`):
- Home: Trending songs, top artists, playlists
- Search: Query songs/artists; live filter + backend search
- Song: Song details, Like, Add to Playlist, Play
- Artist: Artist details with their songs
- Playlist: Songs in the playlist, Play All, remove items
- Profile: Create playlist (modal) with song selection
- Admin: Add Song/Artist (creates and persists to DB)
- Login/Register: UI scaffolding (no auth backend yet)

Components (`src/components`):
- Navbar, Footer, SearchBar, SongCard, ArtistCard, PlaylistCard, Modal
- Player (bottom sticky player) driven by `PlayerContext`

State:
- `MusicContext` handles data fetching and invoking API mutations (CRUD)
- `PlayerContext` handles audio control (play/pause/next/prev/seek/volume)

---

## How to Run (Dev)

1) Backend
```
cd backend
npm install
npx prisma generate
npx prisma migrate dev
node scripts/seed.js
npm run dev
```
Runs on `http://localhost:4000`, CORS is enabled for `http://localhost:5173`

2) Frontend
Create `.env` in project root:
```
VITE_API_BASE_URL=http://localhost:4000
```
Then:
```
npm install
npm run dev
```
Open `http://localhost:5173`

Verification checklist:
- Admin → Add Artist/Song → see updates in Home/Search (DB persisted)
- Profile → Create Playlist → Song page → Add to Playlist → verify in Playlist

---

## Switching SQLite → Postgres/MySQL

1) Change datasource in `backend/prisma/schema.prisma`:
```
datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}
```
2) Set `backend/.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
```
3) Update DB:
```
cd backend
npx prisma generate
npx prisma migrate dev
node scripts/seed.js
```
(Frontend does not change; it reads `VITE_API_BASE_URL`.)

---

## Notes on Audio Playback

- Songs fetched from the DB (seed/admin-created) don’t include audio stream URLs by default.
- JioSaavn integration (optional) adds playable URLs for search results from that API.
- To make DB songs playable, add your own audio hosting URLs to the DB and extend the DTO to include `downloadUrl` or `url` per song.

---

## Folder Structure (Key Paths)

- Frontend:
  - `src/` pages, components, contexts, services
  - `src/context/MusicContext.jsx` (API integration)
  - `src/context/PlayerContext.jsx` (audio player)
  - `src/services/http.js` (axios instance using `VITE_API_BASE_URL`)
- Backend:
  - `backend/prisma/schema.prisma` (SQL schema)
  - `backend/src/index.js` (Express routes + transactions)
  - `backend/scripts/seed.js` (seed data)

