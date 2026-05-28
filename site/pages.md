# Page Migration Checklist

This document tracks the migration of all pages from `site-old` (Go templates) to `site/` (Svelte 5 SPA).

## Existing Pages in `site-old`
Based on `site-old/templates/`, these are the pages that need to be accounted for:

1.  **Home**: `/` -> `site-old/templates/index.html`
2.  **About**: `/about` -> `site-old/templates/about.html`
3.  **Ranking (Current)**: `/ranking` -> `site-old/templates/ranking.html`
4.  **Ranking Seasons List**: `/ranking/season` -> `site-old/templates/ranking_seasons.html`
5.  **Ranking Season Detail**: `/ranking/season/:season` -> `site-old/templates/ranking_season_detail.html`
6.  **History Seasons List**: `/history` -> `site-old/templates/seasons.html`
7.  **History Sessions List**: `/history/:season` -> `site-old/templates/sessions.html`
8.  **History Score Detail**: `/history/:season/:session` -> `site-old/templates/scores.html`
9.  **Player Profile**: `/player/:taikoNo` -> `site-old/templates/player.html`
10. **Error Page**: (Generic) -> `site-old/templates/error.html`

## Migration Status
- [x] Home (`/`)
- [x] About (`/about`)
- [x] Ranking (`/ranking`)
- [x] Ranking Seasons List (`/ranking/season`)
- [x] Ranking Season Detail (`/ranking/season/:season`)
- [ ] History Seasons List (`/history`)
- [ ] History Sessions List (`/history/:season`)
- [ ] History Score Detail (`/history/:season/:session`)
- [ ] Player Profile (`/player/:taikoNo`)
- [ ] Error Page
