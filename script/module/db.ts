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
