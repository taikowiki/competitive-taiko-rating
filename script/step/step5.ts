import { getAccounts } from "../module/getAccounts";
import { openHirobaCompe, CompeSong } from "../module/hirobaCompe";
import { saveHirobaCompeIds, createCompetition } from "../module/db";
import { DateTime } from "luxon";
import { WorkflowState } from "./types";

const DAYS = 1;

export async function step5(state: WorkflowState) {
    console.log("Step 5: Starting New Competition...");

    const latestCompetition = state.latestCompetition;
    if(!latestCompetition){
        console.log('Cannot find latest competition.');
        return;
    }

    const season = state.season;
    const session = state.session;

    const now = DateTime.now().setZone('Asia/Seoul');
    const endDate = now.plus({ days: DAYS });
    const checkDate = now.plus({ days: DAYS + 1 });

    const prevCompeCheckDate = DateTime.fromFormat(latestCompetition.checkDate, 'yyyy-MM-dd', { zone: 'Asia/Seoul' });
    if (now < prevCompeCheckDate) {
        console.log(`Not yet time to check. Next check date: ${latestCompetition.checkDate}`);
        return;
    }
    if (checkDate.month !== now.month || checkDate.year !== now.year) {
        console.log("Next check date is in the next month. Skipping competition creation for this season.");
        return;
    }

    console.log(`Starting New Competition: Season ${season}, Session ${session}`);

    const songs: [CompeSong, CompeSong, CompeSong] = [
        { songNo: "845", difficulty: 5 },
        { songNo: "128", difficulty: 4 },
        { songNo: "181", difficulty: 4 }
    ];

    const accounts = state.accounts;
    const compeIds: string[] = [];

    for (const account of accounts) {
        console.log(`Opening Hiroba Competition for account: ${account.taikoNo}`);
        try {
            const compeId = await openHirobaCompe(account, `C-Rating S${season} #${session}`, songs, DAYS);
            if (compeId) {
                compeIds.push(compeId);
            }
        } catch (err) {
            console.error(`Error opening competition for ${account.taikoNo}:`, err);
        }
    }

    if (compeIds.length > 0) {
        await saveHirobaCompeIds(compeIds, season, session);

        await createCompetition({
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
        });
        console.log("New competition created successfully.");
    } else {
        console.error("Failed to open any Hiroba competitions.");
    }
}
