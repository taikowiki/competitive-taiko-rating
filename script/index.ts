import { 
    getLatestCompetition, 
    getCurrentSeason, 
    getHirobaCompes, 
    saveRatings, 
    saveRatingHistory, 
    saveHirobaCompetitionHistory,
    createCompetition,
    createSeason,
    saveHirobaCompeIds,
    queryBuilder
} from "./module/db";
import { updateRating } from "./module/updateRating";
import { getAccounts } from "./module/getAccounts";
import { openHirobaCompe, CompeSong } from "./module/hirobaCompe";
import { DonderHiroba } from "hiroba-js";
import { DateTime } from "luxon";
import { runQuery } from "@yowza/db-handler";

const DAYS = 1;

async function main() {
    console.log("Starting main workflow...");

    // 1. 가장 최신의 대회 데이터를 가져온다.
    const latestCompetition = await getLatestCompetition();

    // 2. 가장 최신의 시즌 데이터를 가져온다.
    let currentSeasonNo = await getCurrentSeason();

    const now = DateTime.now().setZone('Asia/Seoul');

    // 3. 만약 대회의 시즌이 이번 달보다 이전이면 새로운 시즌을 생성한다.
    // 시즌 번호는 1씩 증가한다.
    if (latestCompetition) {
        const latestCompDate = DateTime.fromFormat(latestCompetition.startDate, 'yyyy-MM-dd', { zone: 'Asia/Seoul' });
        
        if (now.month !== latestCompDate.month || now.year !== latestCompDate.year) {
            console.log(`New month detected. Creating new season...`);
            const nextSeasonNo = currentSeasonNo + 1;
            const startDate = now.startOf('month').toFormat('yyyy-MM-dd');
            const endDate = now.endOf('month').toFormat('yyyy-MM-dd');
            await createSeason(nextSeasonNo, startDate, endDate);
            currentSeasonNo = nextSeasonNo;
            
            // 새 시즌이 시작되면 세션 1부터 다시 시작
            await startNewCompetition(currentSeasonNo, 1);
            return;
        }
    } else {
        console.log("No competition found. Initializing first season and competition...");
        const startDate = now.startOf('month').toFormat('yyyy-MM-dd');
        const endDate = now.endOf('month').toFormat('yyyy-MM-dd');
        await createSeason(1, startDate, endDate);
        await startNewCompetition(1, 1);
        return;
    }

    // 4. 만약 대회의 체크 날짜가 오늘이면 아래 내용을 수행한다.
    const checkDate = DateTime.fromFormat(latestCompetition.checkDate, 'yyyy-MM-dd', { zone: 'Asia/Seoul' });

    if (now >= checkDate) {
        console.log(`Checking results for Season ${latestCompetition.season} Session ${latestCompetition.session}`);

        // 5. 대회와 연관된 모든 히로바 대회의 랭킹을 가져온다.
        const hirobaCompes = await getHirobaCompes(latestCompetition.season, latestCompetition.session);
        const accounts = await getAccounts();

        const aggregatedScores = new Map<string, number>();

        // Use one account to fetch all rankings
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

        // 6. 랭킹을 모두 합쳐 저장한다.
        const rankings = Array.from(aggregatedScores.entries()).map(([taikoNo, score]) => ({
            entryTaikoNo: taikoNo,
            totalScore: score
        }));

        if (rankings.length > 0) {
            await saveHirobaCompetitionHistory(rankings, latestCompetition.season, latestCompetition.session);

            // 7. 이전 레이팅을 기준으로 정절히 그룹으로 나눈다.
            // 8. 각 그룹에서 glicko2-lite를 통해 레이팅을 재산출 한뒤 저장한다.
            // 레이팅을 가져올 때 IN을 쓰지 않고 전체를 가져온다.
            const currentRatings = await runQuery(async (run) => {
                return await queryBuilder
                    .select('rating', '*')
                    .execute(run);
            });

            console.log("Updating ratings...");
            const updatedRatings = updateRating(rankings, (currentRatings as any[]).map(e => ({
                taikoNo: e.taikoNo,
                rating: e.rating,
                RD: e.RD,
                Vol: e.Vol,
                ranking: e.ranking
            })));

            await saveRatings(updatedRatings);
            await saveRatingHistory(updatedRatings, latestCompetition.season, latestCompetition.session);
        } else {
            console.log("No participants found in this session.");
        }

        // 9. 새로운 대회를 생성한다.
        await startNewCompetition(latestCompetition.season, latestCompetition.session + 1);
    } else {
        console.log(`Not yet time to check. Next check date: ${latestCompetition.checkDate}`);
    }
}

async function startNewCompetition(season: number, session: number) {
    const now = DateTime.now().setZone('Asia/Seoul');
    const endDate = now.plus({ days: DAYS });
    const checkDate = now.plus({ days: DAYS + 1 });

    if (checkDate.month !== now.month || checkDate.year !== now.year) {
        console.log("Next check date is in the next month. Skipping competition creation for this season.");
        return;
    }

    console.log(`Starting New Competition: Season ${season}, Session ${session}`);

    // Placeholder for song selection
    // In a real scenario, these should be randomly selected from a song list.
    const songs: [CompeSong, CompeSong, CompeSong] = [
        { songNo: "845", difficulty: 5 },
        { songNo: "128", difficulty: 4 },
        { songNo: "181", difficulty: 4 }
    ];

    const accounts = await getAccounts();
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

await main();

export { };
