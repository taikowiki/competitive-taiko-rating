import { getAccounts } from "../module/getAccounts";
import { DBSchema, queryBuilder } from "../module/db";
import { defineDBHandler, runQuery } from "@yowza/db-handler";
import { getSetting } from "../module/getSetting";
import { Setting } from "../module/types";
import { DateTime } from 'luxon';

const getCurrentSeason = defineDBHandler<[], DBSchema['season'] | null>(() => {
    return async (run) => {
        const rows = await queryBuilder
            .select('season', '*')
            .orderBy('season.season', 'desc')
            .limit(1)
            .execute(run);

        return rows[0] ?? null;
    }
});

const makeNewSeason = defineDBHandler<[setting: Setting, now: DateTime, season: number], DBSchema['season'] | null>((setting, now, season) => {
    return async (run) => {
        await queryBuilder
            .insert('season')
            .set(() => ({
                season,
                startDate: now.toFormat('yyyy-MM-dd'),
                endDate: now.plus({ months: setting.seasonDurationMonth - 1 }).endOf('month').toFormat('yyyy-MM-dd')
            }))
            .execute(run);
        return await getCurrentSeason.getCallback()(run);
    }
});

const archiveSeason = defineDBHandler<[season: number], void>((season: number) => {
    return async (run) => {
        const ratings = await queryBuilder
            .select('rating', '*')
            .execute(run);

        for (const r of ratings as any[]) {
            await queryBuilder
                .insert('season_rating')
                .set(() => ({
                    taikoNo: r.taikoNo,
                    season: season,
                    rating: r.rating,
                    ranking: r.ranking
                }))
                .execute(run);
        }
    }
});

const resetRating = defineDBHandler(() => {
    return async(run) => {
        await queryBuilder.delete('rating').execute(run);
    }
})

const getCurrentCompetition = defineDBHandler<[], DBSchema['competition'] | null>(() => {
    return async (run) => {
        const rows = await queryBuilder
            .select('competition', '*')
            .orderBy('competition.id', 'desc')
            .limit(1)
            .execute(run);

        return rows[0] ?? null;
    }
})

export async function step1() {
    console.log("Step 1: Initializing context...");
    const accounts = await getAccounts();
    const setting = await getSetting();
    const now = DateTime.now().setZone('+09:00').startOf('day');

    let currentSeason = await getCurrentSeason();
    if (!currentSeason) { //season이 없는 경우
        console.log("No season found. Initializing first season...");
        currentSeason = await makeNewSeason(setting, now, 1) as DBSchema['season'];
    }

    const seasonEndTime = DateTime.fromFormat(currentSeason.endDate, 'yyyy-MM-dd', { zone: '+09:00' }).startOf('day');
    if (now.diff(seasonEndTime).toMillis() > 0) { // 시즌 끝남
        console.log(`Season ${currentSeason.season} ended. Archiving and creating new season...`);
        await archiveSeason(currentSeason.season);
        await resetRating();
        currentSeason = await makeNewSeason(setting, now, currentSeason.season + 1) as DBSchema['season'];
    }

    const currentCompetition = await getCurrentCompetition();
    let needToCheck = false;
    if(currentCompetition){
        const competitionCheckTime = DateTime.fromFormat(currentCompetition.checkDate, 'yyyy-MM-dd', { zone: '+09:00' }).startOf('day');
        needToCheck = now.diff(competitionCheckTime).toMillis() >= 0
    }
    console.log(`Context initialized. Current Season: ${currentSeason.season}, Need to check competition: ${needToCheck}`);

    return { accounts, setting, now, currentSeason, currentCompetition, needToCheck};
}