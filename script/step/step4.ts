import { queryBuilder, saveRatings, saveRatingHistory } from "../module/db";
import { updateRating } from "../module/updateRating";
import { runQuery } from "@yowza/db-handler";
import { WorkflowState } from "./types";

export async function step4(state: WorkflowState) {
    console.log("Step 4: Updating ratings...");

    const { rankings, latestCompetition } = state;

    if (!rankings || rankings.length === 0|| !latestCompetition) {
        console.log("No rankings to update.");
        return;
    }

    const currentRatings = await runQuery(async (run) => {
        return await queryBuilder
            .select('rating', '*')
            .execute(run);
    });

    console.log("Updating ratings via glicko2-lite...");
    const updatedRatings = updateRating(rankings, currentRatings, state.accounts).map(e => ({
        taikoNo: e.taikoNo,
        rating: e.rating,
        RD: e.RD,
        Vol: e.Vol,
        ranking: e.ranking
    }));

    await saveRatings(updatedRatings);
    await saveRatingHistory(updatedRatings, latestCompetition.season, latestCompetition.session);
    
    state.ratingsUpdated = true;
    console.log("Ratings updated successfully.");
}
