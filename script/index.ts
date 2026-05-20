import { getLatestCompetition, getCurrentSeason } from "./module/db";
import { updateRating } from "./module/updateRating";

async function main() {
    // 1. 가장 최신의 대회 데이터를 가져온다.
    const latestCompetition = await getLatestCompetition();

    // 2. 가장 최신의 시즌 데이터를 가져온다.
    const currentSeason = await getCurrentSeason();

    // 3. 만약 어제가 시즌의 마지막 날이었다면 오늘 시즌을 생성한다.
    // 시즌은 이번달 말일까지다.
    // 즉 시즌은 매달 초마다 새로 시작된다.

    // 4. 만약 대회의 체크 날짜가 오늘이면 아래 내용을 수행한다.

    // 5. 대회와 연관된 모든 히로바 대회의 랭킹을 가져온다.
    // 6. 랭킹을 모두 합쳐 저장한다. 북 번호(taiko number)와 점수 총합을 기록해야한다.
    // 7. 이전 레이팅을 기준으로 정렬한 뒤 적절히 그룹으로 나눈다.
    // 8. 각 그룹에서 glicko2-lite를 통해 레이팅을 재산출 한뒤 저장한다.
    // 9. 새로운 대회를 생성한다. 대회 종료일은 오늘 + 1, 대회 체크 날짜는 오늘 + 2이다.
};

//await main();

async function test() {
    /**
 * 지정한 개수만큼 레이팅과 데이터 순서가 완벽히 뒤섞인 Mock 데이터를 생성합니다.
 * @param {number} count 생성할 데이터 개수 (예: 100)
 */
    function generateRandomMockData(count: number) {
        const ratings = [];
        const rankings = [];

        // 1. 순차적으로 매칭 데이터 생성
        for (let i = 1; i <= count; i++) {
            const taikoNo = (100000000000 + i).toString();

            // 실력대가 골고루 분포하되 완전히 랜덤한 점수 부여 (1000 ~ 2200)
            const randomRating = Math.floor(Math.random() * 1200) + 1000;
            const randomScore = Math.floor(randomRating * 5 + Math.random() * 2000);

            ratings.push({
                taikoNo,
                rating: randomRating,
                RD: Math.floor(Math.random() * 50) + 50, // 50~100 사이 실뢰도
                Vol: 0.06,
                ranking: 0
            });

            rankings.push({
                entryTaikoNo: taikoNo,
                totalScore: randomScore
                // 라이브러리 규격 유지를 위해 필요한 기본값만 세팅
            });
        }

        // 2. 완벽한 랜덤 셔플 (Fisher-Yates Shuffle 알고리즘)
        // 두 배열의 주소 매칭(taikoNo)은 유지하되, 배열 내부의 인덱스 순서를 완전히 뒤섞습니다.
        for (let i = count - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ratings[i], ratings[j]] = [ratings[j], ratings[i]];

            const k = Math.floor(Math.random() * (i + 1));
            [rankings[i], rankings[k]] = [rankings[k], rankings[i]];
        }

        return { ratings, rankings };
    }

    const mockData = generateRandomMockData(100000);
    mockData.rankings.sort((a, b) => b.totalScore - a.totalScore);
    mockData.ratings.sort((a, b) => b.rating - a.rating);
    await Bun.write('./input.json', JSON.stringify(mockData, null, 2))
    console.time('update')
    const output = updateRating(mockData.rankings, mockData.ratings);
    console.timeEnd('update')

    await Bun.write('./output.json', JSON.stringify(output, null, 2))
}

await test();

export { };
