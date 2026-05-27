import { Account } from "./getAccounts";
import { RatingData } from "./types";
import glicko2 from 'glicko2-lite';

export function updateRating(rankings: { entryTaikoNo: string, totalScore: number }[], ratings: RatingData[], accounts: Account[], days: number) {
    const oldRatingMap = new RatingDataMap(ratings.map(e => [e.taikoNo, e]));

    // 정렬 후 대회 계정 제거
    rankings = rankings
        .toSorted((a, b) => {
            const aRating = oldRatingMap.get(a.entryTaikoNo);
            const bRating = oldRatingMap.get(b.entryTaikoNo);

            return bRating.rating - aRating.rating;
        })
        .filter((e) => !accounts.map((v) => v.taikoNo).includes(e.entryTaikoNo))
        .filter((e) => e.totalScore !== 0);

    const newRatingMap = update(rankings, oldRatingMap);

    //scopeNewRating(oldRatingMap, newRatingMap, newRatingMap.size);
    decreaseUnparticipatedRD(ratings, newRatingMap);

    const updatedRating = sortNewRating(newRatingMap);

    return updatedRating;
}

function update(rankings: { entryTaikoNo: string, totalScore: number }[], map: RatingDataMap) {
    const updatedRatingMap = new Map<string, RatingData>();

    for (let i = 0; i < rankings.length; i++) {
        const matches = getMatches(i);
        const myRating = map.get(rankings[i].entryTaikoNo);
        console.log(`index: ${i}, matches: ${matches.length}`)
        const updated = glicko2(myRating.rating, myRating.RD, myRating.Vol, matches);
        updatedRatingMap.set(rankings[i].entryTaikoNo, {
            taikoNo: rankings[i].entryTaikoNo,
            rating: updated.rating,
            RD: updated.rd,
            Vol: updated.vol,
            ranking: 0
        });
    }

    function getGlickoScore(myTotalScore: number, opponentRatingScore: number) {
        /*
        if (myTotalScore > opponentRatingScore) {
            return 1;
        } else if (myTotalScore === opponentRatingScore) {
            return 0.5;
        } else {
            return 0;
        }
        */
        return (myTotalScore) / (myTotalScore + opponentRatingScore);
    }

    function getMatches(i: number) {
        if (rankings.length <= 21) {
            const matches: [number, number, number][] = [];
            for (let j = 0; j < rankings.length; j++) {
                if(j === i)continue;
                const opponentRating = map.get(rankings[j].entryTaikoNo);
                matches.push([
                    opponentRating.rating,
                    opponentRating.RD,
                    getGlickoScore(rankings[i].totalScore, rankings[j].totalScore)
                ]);
            }
            return matches;
        }

        const upperMatches: [number, number, number][] = [], lowerMatches: [number, number, number][] = [];
        if (i < rankings.length - 10) {
            const upperLimit = Math.max(i - 10, 0);
            for (let j = upperLimit; j < i; j++) {
                const opponentRating = map.get(rankings[j].entryTaikoNo);
                upperMatches.push([
                    opponentRating.rating,
                    opponentRating.RD,
                    getGlickoScore(rankings[i].totalScore, rankings[j].totalScore)
                ]);
            }

            const lowerLimit = Math.min(i + 20 - upperMatches.length, rankings.length - 1);
            for (let j = i + 1; j <= lowerLimit; j++) {
                const opponentRating = map.get(rankings[j].entryTaikoNo);
                lowerMatches.push([
                    opponentRating.rating,
                    opponentRating.RD,
                    getGlickoScore(rankings[i].totalScore, rankings[j].totalScore)
                ]);
            };
        }
        else {
            const lowerLimit = Math.min(i + 10, rankings.length - 1);
            for (let j = i + 1; j <= lowerLimit; j++) {
                const opponentRating = map.get(rankings[j].entryTaikoNo);
                lowerMatches.push([
                    opponentRating.rating,
                    opponentRating.RD,
                    getGlickoScore(rankings[i].totalScore, rankings[j].totalScore)
                ]);
            };

            const upperLimit = Math.max(i - 20 + lowerMatches.length, 0);
            for (let j = upperLimit; j < i; j++) {
                const opponentRating = map.get(rankings[j].entryTaikoNo);
                upperMatches.push([
                    opponentRating.rating,
                    opponentRating.RD,
                    getGlickoScore(rankings[i].totalScore, rankings[j].totalScore)
                ]);
            }
        }

        return [...upperMatches, ...lowerMatches];
    }

    return updatedRatingMap;
}

function scopeNewRating(oldRatings: RatingDataMap, newRatings: Map<string, RatingData>, participantCount: number) {
    newRatings.forEach((newRatingData, taikoNo) => {
        const oldRatingData = oldRatings.get(taikoNo);
        newRatingData.rating = (oldRatingData.rating) + (newRatingData.rating - oldRatingData.rating) / Math.sqrt(participantCount);
    });
}

function decreaseUnparticipatedRD(oldRatings: RatingData[], newRatingMap: Map<string, RatingData>) {
    oldRatings.forEach((r) => {
        if (newRatingMap.has(r.taikoNo)) return;
        const RD = Math.min(Math.sqrt(r.RD ** 2 + 1 * (r.Vol ** 2)), 350);
        newRatingMap.set(r.taikoNo, {
            taikoNo: r.taikoNo,
            rating: r.ranking - 10,
            RD,
            Vol: r.Vol,
            ranking: 0
        });
    })
}

function sortNewRating(newRatingMap: Map<string, RatingData>) {
    const newRatingDatas = Array.from(newRatingMap.values());
    newRatingDatas.sort((a, b) => b.rating - a.rating)
    newRatingDatas.forEach((e, i) => {
        e.ranking = i + 1;
    });
    return newRatingDatas;
}

class RatingDataMap {
    private map = new Map<string, RatingData>();

    constructor(iterable?: Iterable<[taikoNo: string, ratingData: RatingData]>) {
        this.map = new Map(iterable);
    }

    get(taikoNo: string) {
        let data = this.map.get(taikoNo);
        if (!data) {
            data = {
                taikoNo,
                rating: 1500,
                RD: 350,
                Vol: 0.6,
                ranking: 0
            }
            this.map.set(taikoNo, data);
        }
        return data;
    }

    set(taikoNo: string, ratingData: RatingData) {
        this.map.set(taikoNo, ratingData);
    }
}