# About Service

## Introduction
This service provides rating information for Taiko no Tatsujin players by quantifying their skill levels based on competition records from [Donder Hiroba](https://donderhiroba.jp). This project is a fan-made service and is not affiliated with Bandai Namco Entertainment Inc.

## How to Participate
1. Check the currently active Donder Hiroba competitions on the [Main Page](https://crating.taiko.wiki).
2. Participate in the competition and leave a record.
3. After the session ends, your rating will be automatically calculated and updated based on your records.

## Rules
- **Season & Session**: A single season consists of multiple sessions.
- **Session Duration**: Each session lasts for 5 days, and the next session begins immediately after one ends.
- **Participation**: You are considered a participant in a session if you participate in at least one Donder Hiroba competition held during that session.
- **Rating Update**: All competition results are aggregated at the end of each session. Ratings are calculated by comparing scores with up to 20 users of similar rating levels, utilizing the **Glicko-2** algorithm.
- **Rating Decay**: If you do not participate in a session, your rating will slightly decrease, and the **Rating Deviation (RD)**, which represents the uncertainty of your skill estimation, may increase.
- **Song Selection**: Songs are randomly selected for each session. The song pool may change on a seasonal basis.

## Community & Announcements
Announcements and detailed information can be found on our [Discord](https://discord.gg/HdSX7redAJ).
