# Competitive Taiko Rating

**Languages:** [한국어](./docs/ko/README.md) | [日本語](./docs/ja/README.md) | [English](./README.md)

This is the **C-Rating (Competitive Rating)** system, designed to calculate player skill levels based on tournament and match performance within Taiko no Tatsujin.

---

## 📋 Project Overview
Unlike traditional performance-based rating systems, this model specifically focuses on **online tournament results**.

*   **[P-Rating (Performance Rating)](https://rating.taiko.wiki)**: A skill metric calculated based on existing, historical play data.
*   **C-Rating (Competitive Rating)**: A skill metric calculated based on online tournament results from [Donderhiroba](https://donderhiroba.jp). Higher tournament placements yield a higher rating.

## 🏆 How It Works: Online Tournaments
To ensure fair and accurate skill assessment, online tournaments are run in short, frequent cycles.

*   **Tournament Operation**: Multiple online tournaments are held to aggregate and collect performance data comprehensively.
*   **Song Selection**: Fair play is maintained by randomly selecting songs from three separate groups (A, B, and C) that reset every cycle.

## 📈 Rating Calculation Logic
C-Rating is calculated using player grouping and the Glicko rating system.

### 1. Player Grouping
To maintain distinct rating differentiation, players are grouped according to the following rules:
*   **Criteria**: Players are sorted and grouped by their pre-existing ratings.
*   **Balance Maintenance**: The gap between the highest and lowest rating within a single group is kept within a specific threshold.
*   **Limitations**: Each group is strictly limited to a minimum of 2 players and a maximum of 8 players.
*   **Exception Handling**: Any player who cannot fit into a standard group is merged into the group with the smallest rating difference. (In this case, the 8-player maximum may be exceeded.)

### 2. Rating Updates (Glicko Algorithm)
Ratings are updated using the **Glicko algorithm** based on the organized group data.
*   **Relative Evaluation**: Updates are simulated by matching the player against every other opponent within their group.
*   **Match Outcome Determination**: Relative skill is calculated by treating matches against higher-ranked players as losses, and matches against lower-ranked players as wins.