# Migration Plan: Competitive Taiko Rating Website (Svelte + Go)

This document outlines the migration from the template-based `site-old` to a modern SPA architecture in `site/`.

## Architecture
- **Frontend**: Svelte 5 (SPA), Vite, TypeScript, `svelte5-router-spa`.
- **Backend**: Go (Gin), MySQL, RESTful API.
- **Design**: Aligning with `taiko.wiki` and `rating.taiko.wiki` (Light Mode).
- **i18n**: Multilingual support (en, ja, ko) using existing JSON files.

## Phase 1: Backend Development (API)
1. **Setup**: Initialize `site/backend` with Gin and DB connections.
2. **API Endpoints**:
   - `GET /api/v1/competition/latest`: Latest session info + songs + hiroba links.
   - `GET /api/v1/ranking/current`: Current overall rankings.
   - `GET /api/v1/ranking/season/:season`: Rankings for a specific season.
   - `GET /api/v1/history/seasons`: List of all seasons.
   - `GET /api/v1/history/seasons/:season/sessions`: List of sessions in a season.
   - `GET /api/v1/history/seasons/:season/sessions/:session/scores`: Score rankings for a session.
   - `GET /api/v1/player/:taikoNo`: Player details and rating history.
3. **CORS**: Configure CORS to allow `localhost:5173` (dev) and production domain.

## Phase 2: Frontend Development (Svelte)
1. **I18n Store**:
   - Move `site-old/static/lang/*.json` to `site/frontend/src/lib/i18n/`.
   - Implement a simple Svelte store to manage language state and translations.
2. **Global Styling**:
   - Create `src/app.css` based on `taiko.wiki` aesthetics.
   - Use CSS variables for colors (Taiko red, orange, neutral grays).
   - Implement a clean, card-based layout.
3. **Components**:
   - `Layout`: Header (nav), Footer, Language Switcher.
   - `DataTable`: Generic sortable/searchable table for rankings and scores.
   - `CompetitionCard`: Visual display for current competition info.
4. **Routing**:
   - `/`: Index (Current competition)
   - `/ranking`: Overall Ranking
   - `/ranking/season`: Season selection for ranking
   - `/ranking/season/:season`: Specific season ranking
   - `/history`: Season list
   - `/history/:season`: Session list
   - `/history/:season/:session`: Score rankings
   - `/player/:taikoNo`: Player Profile
   - `/about`: Project info

## Phase 3: Migration & Polishing
1. **Data Fetching**: Use `fetch` API or a simple wrapper in Svelte.
2. **SEO & UX**: Ensure page titles update on route change, add loading states.
3. **Testing**: Verify data consistency between `site-old` and the new SPA.

## UI/UX Guidelines (Taiko Wiki Style)
- **Primary Color**: `#e50012` (Taiko Red)
- **Secondary Color**: `#ff9900` (Taiko Orange)
- **Background**: `#ffffff` (White) / `#f8f9fa` (Light Gray)
- **Typography**: Sans-serif (Noto Sans KR/JP/EN).
- **Tables**: Borderless or very subtle borders, zebra striping, highlighting current player if possible.
