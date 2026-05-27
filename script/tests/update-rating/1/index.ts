import path from "node:path";
import { updateRating } from "../../../module/updateRating";

// 10명이서 시작시 변동 측정
const rankings: {
    entryTaikoNo: string;
    totalScore: number;
}[] = [];

for (let i = 0; i < 22; i++) {
    rankings.push({
        entryTaikoNo: `${i}`,
        totalScore: 100 - i
    })
};

await Bun.write(path.join(import.meta.dir, 'output.json'), JSON.stringify(updateRating(rankings, [], [], 1), null, 2))