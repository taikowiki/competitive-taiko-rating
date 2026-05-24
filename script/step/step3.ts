import { RankingData } from "hiroba-js";
import { Account } from "../module/getAccounts";
import { DBSchema, queryBuilder } from "../module/db";
import { defineDBHandler } from "@yowza/db-handler";
import { updateRating } from "../module/updateRating";
import { RatingData, Setting } from "../module/types";

const getRatings = defineDBHandler(() => {
    return async (run) => {
        return await queryBuilder
            .select('rating', '*')
            .execute(run);
    }
});
const updateRatingDB = defineDBHandler<[newRatings: RatingData[]]>((newRatings) => {
    return async (run) => {
        for (const r of newRatings) {
            await queryBuilder
                .insert('rating')
                .set(() => ({
                    ...r
                }))
                .onDuplicate('update', () => ({
                    ...r
                }))
                .execute(run);
        }
    }
});
const archiveHirobaCompetition = defineDBHandler<[season: number, session: number, rankings: RankingData[]]>((season, session, rankings) => {
    return async (run) => {
        for (const r of rankings) {
            await queryBuilder
                .insert('hiroba_competition_history')
                .set(() => ({
                    season,
                    session,
                    taikoNo: r.entryTaikoNo,
                    score: r.totalScore
                }))
                .execute(run)
        }
    }
})

export async function step3(accounts: Account[], setting: Setting, rankings: RankingData[] | null, currentCompetition: DBSchema['competition'] | null, needToCheck: boolean) {
    console.log("Step 3: Updating ratings and archiving rankings...");
    if (!rankings || !currentCompetition || !needToCheck) {
        console.log("Rankings or competition data missing, or check not required. Skipping rating update.");
        return;
    }
    const ratings = await getRatings();
    console.log(`Calculating updated ratings for ${rankings.length} ranking entries...`);
    const newRatings = updateRating(rankings, ratings, accounts, setting.sessionDurationDays);

    console.log(`Saving ${newRatings.length} updated ratings to database...`);
    await updateRatingDB(newRatings);

    console.log(`Archiving Hiroba competition history for Season ${currentCompetition.season} Session ${currentCompetition.session}...`);
    await archiveHirobaCompetition(currentCompetition.season, currentCompetition.session, rankings.filter((e) => !accounts.map((v) => v.taikoNo).includes(e.entryTaikoNo)));
    console.log("Step 3 completed.");
}