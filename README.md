# Competitive Taiko Rating

**Languages:** [한국어](./docs/ko/README.md) | [日本語](./docs/ja/README.md) | [English](./README.md)

The **C-Rating (Competitive Rating)** system evaluates skill levels based on performance in Taiko no Tatsujin online competitions.

---

## 📋 Project Overview
This project aims for a **rating model centered on online competition results**, distinguishing itself from traditional performance-based rating systems.

*   **[P-Rating (Performance Rating)](https://rating.taiko.wiki)**: A skill metric calculated based on existing play data.
*   **C-Rating (Competitive Rating)**: A skill metric calculated based on [Donderhiroba](https://donderhiroba.jp) online competition results. Higher competition rankings result in a higher rating.

## 🏆 How It Works: Online Competitions
Online competitions are held in short cycles to ensure fair skill measurement.

*   **Competition Progress**: Multiple online competitions are held to collect results comprehensively.
*   **Song Selection**: Songs are randomly selected from three groups (A, B, and C) that are reset each cycle.

## 📈 Rating Calculation Logic
C-Rating is calculated using grouping and the Glicko algorithm.
*   **Relative Evaluation**: Ratings are updated by simulating match results with all players in the group.
*   **Win/Loss Determination**: A player is considered to have lost to those ranked higher and won against those ranked lower to calculate relative skill.
