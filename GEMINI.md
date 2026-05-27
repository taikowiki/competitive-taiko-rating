# Competitive Taiko Rating Website - Project Documentation

## Project Overview
This project provides a web interface for the Competitive Taiko Rating system. It allows users to view current competitions, player rankings, individual player rating history, and session-specific score rankings.

## Technical Stack
- **Backend**: Go with [Gin Web Framework](https://github.com/gin-gonic/gin)
- **Database**: MySQL (connecting to the existing database used by the script modules)
- **Frontend**: Server-Side Rendering (SSR) using Go `html/template`
- **Styling**: Vanilla CSS (modern and responsive)
- **Environment Management**: `godotenv` for managing DB credentials and server port.

## Directory Structure
```text
site/
├── db/                 # Database connection and query logic
│   ├── db.go           # DB initialization and connection pool
│   └── queries.go      # SQL queries for all features
├── handlers/           # Request handlers for routes
│   └── handlers.go     # Page rendering logic
├── models/             # Go structs mapping to DB tables
│   └── models.go       # Data models
├── static/             # Static assets
│   └── style.css       # Global stylesheet
├── templates/          # HTML templates (SSR)
│   ├── header.html     # Common header/nav
│   ├── footer.html     # Common footer
│   ├── index.html      # Home page (Current Session & Hiroba links)
│   ├── rankings.html   # Overall rating rankings
│   ├── seasons.html    # Season selection for history
│   ├── sessions.html   # Session selection within a season
│   ├── scores.html     # Session-specific score rankings
│   ├── player.html     # Player profile and rating history
│   └── error.html      # Error fallback page
├── .env.sample         # Sample environment configuration
├── go.mod / go.sum     # Go module definitions
├── main.go             # Entry point and route definitions
└── plan.md             # Initial implementation plan
```

## Key Features & URL Structure
1. **Home (`/`)**: Displays the latest competition info (S# #) and active Donderhiroba competition links.
2. **Ranking (`/ranking`)**: Shows the overall rating leaderboard.
    - **Ranking Seasons (`/ranking/season`)**: List of all seasons for ranking selection.
    - **Season Ranking Detail (`/ranking/season/:season`)**: Shows the final leaderboard for a specific season.
3. **History Drill-down**:
    - **Seasons (`/history`)**: List of all seasons that have recorded data.
    - **Sessions (`/history/:season`)**: List of sessions within the selected season.
    - **Scores (`/history/:season/:session`)**: Final score rankings for that specific session.
4. **Player Profile (`/player/:taikoNo`)**: Shows a player's season-end ratings and session-by-session rating changes.

## Configuration
The application reads settings from a `.env` file in the `site/` directory (or falls back to `../script/.env`).
Required variables:
- `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_NAME`
- `PORT` (Optional, defaults to 8080)

## How to Run
1. Ensure a MySQL server is running with the required schema.
2. Configure the `.env` file (refer to `.env.sample`).
3. Navigate to the `site/` directory.
4. Run the server:
   ```bash
   go run main.go
   ```

## Design Notes
- **Template Architecture**: Uses a header/footer include pattern to avoid block name collisions and ensure clean separation of concerns.
- **Robustness**: Queries use explicit column names to be resilient against DB schema order changes.
- **Fallback Logic**: The home page automatically finds the latest available Hiroba links if the current session doesn't have any yet.
