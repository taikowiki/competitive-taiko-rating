import { createSeason, archiveSeasonRating, getLatestCompetition } from "../module/db";
import { DateTime } from "luxon";
import { WorkflowState } from "./types";

export async function step2(state: WorkflowState) {
    console.log("Step 2: Checking for season transition...");
    const { latestCompetition, season, now } = state;

    if (latestCompetition) {
        const latestCompDate = DateTime.fromFormat(latestCompetition.startDate, 'yyyy-MM-dd', { zone: 'Asia/Seoul' });
        
        // 새로운 달로 넘어감
        if (now.month !== latestCompDate.month || now.year !== latestCompDate.year) {
            console.log(`New month detected. Archiving Season ${season} and creating new season...`);
            
            await archiveSeasonRating(season);

            const nextSeasonNo = season + 1;
            const startDate = now.startOf('month').toFormat('yyyy-MM-dd');
            const endDate = now.endOf('month').toFormat('yyyy-MM-dd');
            await createSeason(nextSeasonNo, startDate, endDate);
        
            state.season = nextSeasonNo;
            state.session = 1;
            state.latestCompetition = await getLatestCompetition();
            return;
        }
    } else {
        // 아직 대회가 없음
        console.log("No competition found. Initializing first season...");
        const startDate = now.startOf('month').toFormat('yyyy-MM-dd');
        const endDate = now.endOf('month').toFormat('yyyy-MM-dd');
        await createSeason(1, startDate, endDate);
        
        state.season = 1;
        state.session = 1;
        return;
    }
}
