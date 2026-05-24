import { DateTime } from "luxon";
import { DBSchema, queryBuilder } from "../module/db";
import { Account } from "../module/getAccounts";
import { DonderHiroba, RankingData } from "hiroba-js";
import { defineDBHandler } from "@yowza/db-handler";
import { renewToken } from "../module/tokenManager";

const getHirobaCompetitions = defineDBHandler<[season: number, session: number], DBSchema['hiroba_competition'][]>((season, session) => {
    return async (run) => {
        const rows = await queryBuilder
            .select('hiroba_competition', '*')
            .where(({ compare, column, value }) => [
                compare(column('hiroba_competition.season'), '=', value(season)),
                compare(column('hiroba_competition.session'), '=', value(session))
            ])
            .execute(run);
        return rows;
    }
});

// 크롤링
export async function step2(account: Account, currentCompetition: DBSchema['competition'] | null, needToCheck: boolean) {
    console.log("Step 2: Crawling Hiroba rankings...");
    if (!currentCompetition || !needToCheck) {
        console.log("No current competition or check not required. Skipping crawl.");
        return null;
    }

    const hirobaCompetitions = await getHirobaCompetitions(currentCompetition.season, currentCompetition.session);
    console.log(`Found ${hirobaCompetitions.length} Hiroba competitions to crawl.`);
    const rankings: RankingData[] = [];

    let token = await renewToken(account);
    for (const c of hirobaCompetitions) {
        console.log(`Crawling ranking for Hiroba Competition: ${c.compeId}...`);
        async function crawl() {
            const data = await DonderHiroba.func.getCompeRanking({ token, compeId: c.compeId });
            if (data) {
                rankings.push(...data);
                console.log(`Successfully crawled ${data.length} entries from ${c.compeId}.`);
            }
        }

        try {
            await crawl();
        }
        catch {
            console.log(`Token might be expired. Renewing token and retrying for ${c.compeId}...`);
            token = await renewToken(account);
            try {
                await crawl();
            }
            catch (err) {
                console.error('Crawling error after retry:', c.compeId, '\n', err);
            }
        }
    }

    return rankings;
}