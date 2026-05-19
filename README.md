# Competitive Taiko Rating

**Languages:** [한국어](./docs/ko/README.md) | [日本語](./docs/ja/README.md) | [English](./README.md)

This is the **C-Rating (Competitive Rating)** system, designed to evaluate a player's skill level based on their performance in Taiko no Tatsujin online competitions.

---

## 📋 Project Overview
Departing from traditional performance-based rating systems, this model focuses specifically on **online competition results**.

*   **[P-Rating (Performance Rating)](https://rating.taiko.wiki)**: A skill metric calculated based on historical play data.
*   **C-Rating (Competitive Rating)**: A skill metric calculated based on online competition results from [Donderhiroba](https://donderhiroba.jp). Higher competition rankings yield a higher rating.

## 🏆 How It Works: Online Competitions
Online competitions are held on a short, recurring cycle to ensure fair and accurate skill measurement.

*   **Competition Operation**: Multiple online competitions are hosted to gather and integrate performance data.
*   **Song Selection**: To maintain fairness, songs are randomly drawn from three distinct groups (A, B, and C) that reset every cycle.

## 📈 Rating Calculation Logic
C-Rating is calculated through a combination of player grouping and the Glicko algorithm.

### 1. Player Grouping
To ensure meaningful competition and rating distinction, players are grouped according to the following rules:
*   **Criterion**: Players are sorted by their current rating and then grouped.
*   **Maintaining Balance**: The difference between the highest and lowest rating within a single group is kept within a specific threshold.
*   **Group Limits**: Each group must contain a minimum of 2 players and a maximum of 8 players.
*   **Exception Handling**: Any players left without a group are merged into the group with the smallest rating gap (in this specific case, a group may exceed the 8-player limit).

### 2. Rating Updates (Glicko Algorithm)
Ratings are updated using the **Glicko algorithm** based on the structured group data.
*   **Relative Evaluation**: Rating updates are calculated by simulating match outcomes against every other player within the same group.
*   **Match Outcome Determination**: A player is considered to have lost to anyone ranked higher than them in the competition leaderboard, and won against anyone ranked lower, establishing their relative skill level.