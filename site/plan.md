# Plan: Competitive Taiko Rating Website

Build a web interface for the competitive taiko rating system using Go, Gin, and Go Templates.

## Objective
Provide a user-friendly interface to view current competitions, rankings, rating history, and session scores.

## Key Files & Context
- **Database**: MySQL (referenced in `script/bun.lock`).
- **Schema**: Defined in `script/module/db.ts`.
- **Backend**: Go with Gin framework.
- **Frontend**: Go Templates (SSR) with Vanilla CSS.

## Implementation Steps

### Phase 1: Go Project Setup
1. Initialize Go module in `site/`.
2. Install dependencies: `gin`, `go-sql-driver/mysql`, `godotenv`.
3. Set up project structure:
   - `main.go`: Entry point and route definitions.
   - `models/`: Database models.
   - `handlers/`: Request handlers.
   - `templates/`: HTML templates.
   - `static/`: CSS and assets.

### Phase 2: Database Layer
1. Define Go structs matching the database tables.
2. Implement functions to fetch data:
   - `GetLatestCompetition()`
   - `GetHirobaCompetitions(season, session)`
   - `GetRankings()`
   - `GetPlayerRatingHistory(taikoNo)`
   - `GetPlayerSeasonRatings(taikoNo)`
   - `GetSessionScores(season, session)`

### Phase 3: Handlers & Templates
1. **Home Page (`/`)**: 
   - Show latest competition details.
   - List Hiroba competition links (constructed from `compeId`).
2. **Rankings Page (`/rankings`)**: 
   - Table showing player rankings.
3. **Player History Page (`/player/:taikoNo`)**: 
   - Rating history over seasons and sessions.
4. **Session Scores Page (`/scores/:season/:session`)**: 
   - Scores for the specific session.

### Phase 4: Styling
1. Create `static/style.css` with Vanilla CSS.

## Verification & Testing
1. Run the Go server.
2. Verify all routes load with correct data.
