import { QueryBuilder, runQuery } from "@yowza/db-handler";
import { InferDBSchema } from "@yowza/db-handler/types";
import { run } from "node:test";

export const queryBuilder = new QueryBuilder({
    competition: {
        id: ['number'],
        season: ['number'],
        session: ['number'],
        songNo1: ['string'],
        songNo2: ['string'],
        songNo3: ['string'],
        diff1: ['string'],
        diff2: ['string'],
        diff3: ['string'],
        startDate: ['string'],
        endDate: ['string'],
        checkDate: ['string']
    },
    season: {
        season: ['number'],
        startDate: ['string'],
        endDate: ['string']
    },
    rating: {
        taikoNo: ['string'],
        ranking: ['number'],
        rating: ['number'],
        RD: ['number'],
        Vol: ['number']
    },
    rating_history: {
        taikoNo: ['string'],
        season: ['number'],
        session: ['number'],
        rating: ['number'],
        RD: ['number'],
        Vol: ['number']
    },
    season_rating: {
        taikoNo: ['string'],
        season: ['number'],
        rating: ['number'],
        ranking: ['number'],
    },
    hiroba_competition: {
        compeId: ['string'],
        season: ['number'],
        session: ['number']
    },
    hiroba_competition_history: {
        season: ['number'],
        session: ['number'],
        taikoNo: ['string'],
        score: ['number']
    }
});
export type DBSchema = InferDBSchema<typeof queryBuilder.dbSchema>;

export function archiveSeasonRating(season: number) {
    return runQuery(async (run) => {
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
    })
}

export function getCurrentSeason() {
    return runQuery(async (run) => {
        const rows = await queryBuilder
            .select('season', () => ({
                season: 'season'
            }))
            .orderBy('season.season', 'desc')
            .limit(1)
            .execute(run);

        return rows[0]?.season ?? 1;
    })
}

export function getLatestCompetition() {
    return runQuery(async (run) => {

        const rows = await queryBuilder
            .select('competition', '*')
            .orderBy(
                ['competition.season', 'desc'],
                ['competition.session', 'desc']
            )
            .limit(1)
            .execute(run);

        return (rows[0] as any) ?? null;
    })
}

export function getHirobaCompes(season: number, session: number) {
    return runQuery(async (run) => {
        const rows = await queryBuilder
            .select('hiroba_competition', '*')
            .where(({ compare, column, value }) => [
                compare(column('season'), '=', value(season)),
                compare(column('session'), '=', value(session))
            ])
            .execute(run);

        return rows as any[];
    })
}

export function saveRatings(ratings: any[]) {
    return runQuery(async (run) => {
        for (const r of ratings) {
            await queryBuilder
                .insert('rating')
                .set(() => ({
                    taikoNo: r.taikoNo,
                    rating: r.rating,
                    RD: r.RD,
                    Vol: r.Vol,
                    ranking: r.ranking
                }))
                .onDuplicate('replace')
                .execute(run);
        }
    })
}

export function saveRatingHistory(ratings: any[], season: number, session: number) {
    return runQuery(async (run) => {
        for (const r of ratings) {
            await queryBuilder
                .insert('rating_history')
                .set(() => ({
                    taikoNo: r.taikoNo,
                    season: season,
                    session: session,
                    rating: r.rating,
                    RD: r.RD,
                    Vol: r.Vol
                }))
                .execute(run);
        }
    })
}

export function saveHirobaCompetitionHistory(rankings: { entryTaikoNo: string, totalScore: number }[], season: number, session: number) {
    return runQuery(async (run) => {
        for (const r of rankings) {
            await queryBuilder
                .insert('hiroba_competition_history')
                .set(() => ({
                    season: season,
                    session: session,
                    taikoNo: r.entryTaikoNo,
                    score: r.totalScore
                }))
                .onDuplicate('replace')
                .execute(run);
        }
    })
}

export function createSeason(season: number, startDate: string, endDate: string) {
    return runQuery(async (run) => {
        await queryBuilder
            .insert('season')
            .set(() => ({
                season,
                startDate,
                endDate
            }))
            .onDuplicate('replace')
            .execute(run);
    })
}

export function createCompetition(data: any) {
    return runQuery(async (run) => {
        await queryBuilder
            .insert('competition')
            .set(() => ({
                season: data.season,
                session: data.session,
                songNo1: data.songNo1,
                songNo2: data.songNo2,
                songNo3: data.songNo3,
                diff1: data.diff1,
                diff2: data.diff2,
                diff3: data.diff3,
                startDate: data.startDate,
                endDate: data.endDate,
                checkDate: data.checkDate
            }))
            .onDuplicate('replace')
            .execute(run);
    })
}

export function saveHirobaCompeIds(compeIds: string[], season: number, session: number) {
    return runQuery(async (run) => {
        for (const compeId of compeIds) {
            await queryBuilder
                .insert('hiroba_competition')
                .set(() => ({
                    compeId,
                    season,
                    session
                }))
                .onDuplicate('replace')
                .execute(run);
        }
    })
}