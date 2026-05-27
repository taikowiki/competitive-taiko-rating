import path from "node:path";
import { updateRating } from "../../../module/updateRating";
import { RatingData } from "../../../module/types";
import glicko2 from 'glicko2-lite';

// 100명이서 시작시 변동 측정
const rankings: {
    entryTaikoNo: string;
    totalScore: number;
}[] = [];
const ratings: RatingData[] = [];

for (let i = 0; i < 100; i++) {
    rankings.push({
        entryTaikoNo: `${i}`,
        totalScore: 1000 - i
    });
   
};


await Bun.write(path.join(import.meta.dir, 'output.json'), JSON.stringify(updateRating(rankings, ratings, [], 1), null, 2))