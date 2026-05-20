import { RatingData } from "./types";
import glicko2 from 'glicko2-lite';

export function updateRating(rankings: {entryTaikoNo: string, totalScore: number}[], ratings: RatingData[]) {
    const map = new RatingDataMap(ratings.map(e => [e.taikoNo, e]));

    rankings = rankings.toSorted((a, b) => {
        const aRating = map.get(a.entryTaikoNo);
        const bRating = map.get(b.entryTaikoNo);

        return bRating.rating - aRating.rating;
    });

    const groupedRankings: {entryTaikoNo: string, totalScore: number}[][] = groupRanking(rankings);

    const updatedRating: RatingData[] = [];

    groupedRankings.forEach((group) => {
        for (let i = 0; i < group.length; i++) {
            const matches: [number, number, number][] = [];
            for (let j = 0; j < group.length; j++) {
                if (i === j) continue;
                const opponentRating = map.get(group[j].entryTaikoNo);
                matches.push([
                    opponentRating.rating,
                    opponentRating.RD,
                    group[i].totalScore > group[j].totalScore ? 1 :
                        group[i].totalScore === group[j].totalScore ? 0.5 :
                            0
                ]);
            }
            const myRating = map.get(group[i].entryTaikoNo)
            const updated = glicko2(myRating.rating, myRating.RD, myRating.Vol, matches);

            updatedRating.push({
                taikoNo: group[i].entryTaikoNo,
                rating: updated.rating,
                RD: updated.rd,
                Vol: updated.vol,
                ranking: 0
            });
        }
    });

    updatedRating.sort((a, b) => b.rating - a.rating)
    updatedRating.forEach((e, i) => {
        e.ranking = i + 1;
    });

    return updatedRating;
}

function groupRanking(
    rankings: {entryTaikoNo: string, totalScore: number}[]
): {entryTaikoNo: string, totalScore: number}[][] {
    const groups: {entryTaikoNo: string, totalScore: number}[][] = [];

    while(1){
        if(rankings.length >= 1000){
            groups.push(rankings.slice(0, 1000));
            rankings = rankings.slice(1000);
        } else {
            groups.push(rankings);
            break;
        }
    }

    return groups;
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