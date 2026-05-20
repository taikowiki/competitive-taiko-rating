# Competitive Taiko Rating - Project Memory

## Project Overview
- **Goal**: Rating system based on Donderhiroba online competition results.
- **Key Algorithm**: Glicko Algorithm for rating calculation.
- **Core Workflow**:
    1. Group players with similar ratings (2-8 players per group).
    2. Simulate matches within the group.
    3. Update ratings based on win/loss (higher rank = win, lower rank = loss).

## Technical Stack
- **Language**: TypeScript
- **Runtime**: Bun (implied by \un.lock\)
- **Database**: Custom DB handler (\@yowza/db-handler\)
- **External API**: \hiroba-js\ for interacting with Donderhiroba.

## Important Files
- \script/module/db.ts\: Database schema and queries.
- \script/module/hirobaCompe.ts\: Hiroba competition management and crawling logic.
- \script/index.ts\: Main entry point for crawling and checking latest competitions.

## Notes
- Player grouping has specific constraints: 2-8 members, with exception handling for merging outliers.
- Glicko updates are relative within the group.
