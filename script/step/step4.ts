import { defineDBHandler } from "@yowza/db-handler";
import { DBSchema, queryBuilder } from "../module/db";
import { Account } from "../module/getAccounts";
import { CompeSong, openHirobaCompe } from "../module/hirobaCompe";
import { DateTime } from "luxon";
import { Setting } from "../module/types";
import { getSongPool } from "../module/getSongPool";

const createNewCompetition = defineDBHandler<[season: number, session: number, songs: [CompeSong, CompeSong, CompeSong], now: DateTime, days: number]>((season, session, songs, now, days) => {
    return async (run) => {
        const endDate = now.plus({ days: days - 1 });
        const checkDate = now.plus({ days: days });

        await queryBuilder
            .insert('competition')
            .set(() => ({
                season,
                session,
                songNo1: songs[0].songNo,
                songNo2: songs[1].songNo,
                songNo3: songs[2].songNo,
                diff1: songs[0].difficulty.toString(),
                diff2: songs[1].difficulty.toString(),
                diff3: songs[2].difficulty.toString(),
                startDate: now.toFormat('yyyy-MM-dd'),
                endDate: endDate.toFormat('yyyy-MM-dd'),
                checkDate: checkDate.toFormat('yyyy-MM-dd')
            }))
            .execute(run);
    }
});
const insertHirobaCompetition = defineDBHandler<[season: number, session: number, compeId: string]>((season, session, compeId) => {
    return async (run) => {
        await queryBuilder
            .insert('hiroba_competition')
            .set(() => ({
                season,
                session,
                compeId
            }))
            .execute(run);
    }
})

export async function step4(accounts: Account[], setting: Setting, currentSeason: DBSchema['season'], currentCompetition: DBSchema['competition'] | null, now: DateTime, needToCheck: boolean) {
    console.log("Step 4: Creating new competition and Hiroba competitions...");
    if (needToCheck || !currentCompetition) {
        const seasonEndDate = DateTime.fromFormat(currentSeason.endDate, 'yyyy-MM-dd', { zone: '+09:00' }).startOf('day');
        if (now.plus({ days: setting.sessionDurationDays - 1 }).startOf('day').diff(seasonEndDate).toMillis() > 0) {
            console.log('No more session for this season.')
            return;
        }

        const season = currentSeason.season;
        const session = currentSeason.season === currentCompetition?.season ? currentCompetition.session + 1 : 1;

        console.log(`Starting Season ${season} Session ${session}...`);

        const songPool = await getSongPool();
        const songs = songPool.map((group) => group[Math.floor(Math.random() * group.length)]) as [CompeSong, CompeSong, CompeSong];

        console.log(`Creating competition record in database...`);
        await createNewCompetition(season, session, songs, now, setting.sessionDurationDays);

        for (const account of accounts) {
            console.log(`Opening Hiroba Competition for account ${account.taikoNo}...`);
            try {
                const compeId = await openHirobaCompe(account, `C-Rating S${season} #${session}`, songs, setting.sessionDurationDays);
                if (compeId) {
                    console.log(`Hiroba Competition created: ${compeId}`);
                    await insertHirobaCompetition(season, session, compeId);
                } else {
                    console.error(`Failed to create Hiroba Competition for account ${account.taikoNo}`);
                }
            }
            catch (err) {
                console.error(`Failed to create Hiroba Competition for account ${account.taikoNo}`, err);
            }
        }
    } else {
        console.log("Competition check not required yet. Skipping new competition creation.");
    }
    console.log("Step 4 completed.");
}