import { QueryBuilder, runQuery } from "@yowza/db-handler";

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
        season: ['string'],
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

export function getCurrentSeason() {
    return runQuery(async (run) => {
        const rows = await queryBuilder
            .select('season', () => ({
                season: 'season'
            }))
            .orderBy('season.season', 'desc')
            .limit(1)
            .execute(run);

        return rows[0].season ?? 1;
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

        return rows[0] ?? null;
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

        return rows;
    })
}