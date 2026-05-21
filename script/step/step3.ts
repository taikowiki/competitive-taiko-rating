import { getHirobaCompes, saveHirobaCompetitionHistory } from "../module/db";
import { getAccounts } from "../module/getAccounts";
import { DonderHiroba } from "hiroba-js";
import { DateTime } from "luxon";
import { WorkflowState } from "./types";

export async function step3(state: WorkflowState) {
    console.log("Step 3: Checking results and fetching rankings...");

    const { latestCompetition, now } = state;
    if (!latestCompetition){
        console.log('Cannot find latest competition.');
        return;
    };

    const checkDate = DateTime.fromFormat(latestCompetition.checkDate, 'yyyy-MM-dd', { zone: 'Asia/Seoul' });

    if (now < checkDate) {
        console.log(`Not yet time to check. Next check date: ${latestCompetition.checkDate}`);
        return;
    }

    console.log(`Checking results for Season ${latestCompetition.season} Session ${latestCompetition.session}`);

    const hirobaCompes = await getHirobaCompes(latestCompetition.season, latestCompetition.session);
    const accounts = await getAccounts();

    const aggregatedScores = new Map<string, number>();

    const token = await DonderHiroba.func.getSessionToken({
        email: accounts[0].email,
        password: accounts[0].password
    });
    await DonderHiroba.func.cardLogin({ token, taikoNumber: accounts[0].taikoNo });

    for (const hc of hirobaCompes) {
        console.log(`Fetching ranking for Hiroba Competition: ${hc.compeId}`);
        try {
            const compeData = await DonderHiroba.func.getCompeData({ token, compeId: hc.compeId });
            if (compeData && compeData.ranking) {
                compeData.ranking.forEach(player => {
                    const score = player.totalScore;
                    const taikoNo = player.entryTaikoNo;
                    aggregatedScores.set(taikoNo, (aggregatedScores.get(taikoNo) ?? 0) + score);
                });
            }
        } catch (err) {
            console.error(`Error fetching ranking for ${hc.compeId}:`, err);
        }
    }

    const rankings = Array.from(aggregatedScores.entries()).map(([taikoNo, score]) => ({
        entryTaikoNo: taikoNo,
        totalScore: score
    }));

    if (rankings.length > 0) {
        await saveHirobaCompetitionHistory(rankings, latestCompetition.season, latestCompetition.session);
        state.rankings = rankings;
        state.session = latestCompetition.session + 1;
    } else {
        console.log("No participants found in this session.");
    }
}
