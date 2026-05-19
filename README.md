# Competitive Taiko Rating

**Languages:** [한국어](./README.ko.md) | [日本語](./docs/ja/README.md) | [English](./README.md)

A **C-Rating (Competitive Rating)** system based on the results of Taiko community tournaments and matches.

---

## 📋 Project Overview
We aim for a **tournament-performance-centered rating model** that differentiates itself from conventional performance-based rating systems.

*   **P-Rating (Performance Rating)**: Skill indicator calculated based on existing individual play data.
*   **C-Rating (Competitive Rating)**: Skill indicator calculated based on online tournament results from [Donderhiroba](https://donderhiroba.jp). Higher tournament performance leads to a higher rating.

## 🏆 How It Works: Online Tournaments
We operate online tournaments in short cycles to measure skill fairly.

*   **Tournament Execution**: We collect results from multiple online tournaments to aggregate performance data.
*   **Song Selection**: To maintain fairness, songs are randomly selected from three rotating groups (A, B, and C).

## 📈 Rating Calculation Logic
C-Rating is calculated through systematic grouping and statistical algorithms.

### 1. Player Grouping
To ensure high discrimination in ratings, players are grouped based on the following rules:
*   **Standard**: Grouped after sorting by P-Rating.
*   **Balance**: The difference between the highest and lowest rating in a group is managed within a specific threshold.
*   **Constraints**: Each group must have between 2 and 8 players.
*   **Edge Cases**: Players who do not fit into a group are merged into the group with the smallest rating difference.

### 2. Rating Updates (Glicko Algorithm)
Ratings are updated based on the grouped data using the **Glicko algorithm**.
*   **Relative Evaluation**: Updates are made by simulating match results against all other players in the group.
*   **Win/Loss Determination**: A player is considered to have lost against higher-ranked players and won against lower-ranked players, calculating relative skill accordingly.

