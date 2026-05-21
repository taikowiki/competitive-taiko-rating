import { getLatestCompetition, getCurrentSeason } from "../module/db";
import { DateTime } from "luxon";
import { WorkflowState } from "./types";

export async function step1(state: WorkflowState) {
    console.log("Step 1: Initializing context...");
    state.latestCompetition = await getLatestCompetition();
    state.season = await getCurrentSeason();
    state.now = DateTime.now().setZone('Asia/Seoul');
}
