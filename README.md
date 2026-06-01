# Competitive Taiko Rating (C-Rating)

**Languages:** [한국어](./docs/ko/README.md) | [日本語](./docs/ja/README.md) | [English](./README.md)

Competitive Taiko Rating (C-Rating) is a system that accurately calculates the relative skill levels of players based on their performance in Taiko no Tatsujin online competitions. This document provides a detailed explanation of the core algorithms and calculation logic behind C-Rating.

This project is a fan-made service and is not affiliated with Bandai Namco Entertainment Inc.

---

## 📋 Project Overview
C-Rating evaluates the relative superiority between users based on actual **rankings and scores** in competitions.

*   **P-Rating (Performance Rating)**: An absolute skill metric calculated based on personal best records for each song.
*   **C-Rating (Competitive Rating)**: A relative skill metric calculated based on actual match results from [Donder Hiroba](https://donderhiroba.jp) online competitions.

---

## 📈 Rating Calculation Algorithm
C-Rating utilizes the **Glicko-2** algorithm—widely used in games like Chess and Go—optimized for the Taiko no Tatsujin environment.

### 1. Processing Match Results (Glicko Score)
Instead of a simple win/loss (1 or 0), match results are quantified using the ratio of the two players' scores.
$$Score = \frac{MyTotalScore}{MyTotalScore + OpponentTotalScore}$$
This method allows for more precise skill reflection by differentiating rating changes based on whether a player lost by a narrow margin or a significant gap.

### 2. Matchmaking and Opponent Selection
While ratings are updated for all participants, each player is matched against **up to 20 opponents** for simulation to ensure both efficiency and accuracy.
*   Priority is given to matching with 10 players ranked immediately above and 10 players ranked immediately below in terms of rating.
*   If the number of participants is small (21 or fewer), matches against all participants are reflected.

### 3. Rating Components
*   **Rating**: The central value representing a player's skill (Initial value: 1500).
*   **RD (Rating Deviation)**: A deviation representing the reliability of the rating. A smaller value indicates higher accuracy. It increases over time if the player does not participate in competitions. (Initial value: 350, Maximum: 350).
*   **Volatility**: A measure of the consistency of a player's performance.

### 4. Handling Non-participants (RD Decay)
To reflect the uncertainty in skill estimation for users who do not participate in a session, the following logic is applied:
*   The RD value increases for unparticipated sessions, leading to larger rating fluctuations upon their next participation.
*   A small rating penalty (currently -10 points) is applied for each unparticipated session to encourage active participation.

---

## 🏆 Session Operations
*   **Session Cycle**: A new session begins every 5 days.
*   **Song Selection**: Competitions consist of songs randomly selected for each session.
*   **Automatic Aggregation**: Once a record is left in a Donder Hiroba competition, the server automatically calculates and updates the ratings after the session ends.

---

## 🔗 Related Links
*   [Service Site](https://crating.taiko.wiki)
*   [Discord](https://discord.gg/HdSX7redAJ)
