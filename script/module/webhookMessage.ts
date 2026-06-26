export function webhookKo(
    season: number, 
    session: number, 
    songs: {title: string, diff: 1 | 2 | 3 | 4 | 5, level: number}[]
){
function getDiffString(diff: 1 | 2 | 3 | 4 | 5){
    if(diff === 1){
        return '쉬움'
    } else if(diff == 2){
        return '보통'
    } else if (diff === 3){
        return '어려움'
    } else if (diff === 4){
        return '오니(앞)'
    } else {
        return '오니(뒤)'
    }
}

    return(
`
# S${season} #${session}
S${season} #${session}이 시작되었습니다!

과제곡은 아래와 같습니다.
- ${songs[0].title} (${getDiffString(songs[0].diff)}, ★${songs[0].level})
- ${songs[1].title} (${getDiffString(songs[1].diff)}, ★${songs[1].level})
- ${songs[2].title} (${getDiffString(songs[2].diff)}, ★${songs[2].level})

자세한 내용은 아래를 참고해주세요.
https://crating.taiko.wiki
`);
}

export function webhookEn(
    season: number,
    session: number,
    songs: { title: string; diff: 1 | 2 | 3 | 4 | 5; level: number }[]
) {
    function getDiffString(diff: 1 | 2 | 3 | 4 | 5) {
        if (diff === 1) {
            return "Easy";
        } else if (diff === 2) {
            return "Normal";
        } else if (diff === 3) {
            return "Hard";
        } else if (diff === 4) {
            return "Oni";
        } else {
            return "Ura Oni";
        }
    }

    return `
# S${season} #${session}
S${season} #${session} has started!

The assignment songs are:
- ${songs[0].title} (${getDiffString(songs[0].diff)}, ★${songs[0].level})
- ${songs[1].title} (${getDiffString(songs[1].diff)}, ★${songs[1].level})
- ${songs[2].title} (${getDiffString(songs[2].diff)}, ★${songs[2].level})

For more details, please visit:
https://crating.taiko.wiki
`;
}

export function webhookJa(
    season: number,
    session: number,
    songs: { title: string; diff: 1 | 2 | 3 | 4 | 5; level: number }[]
) {
    function getDiffString(diff: 1 | 2 | 3 | 4 | 5) {
        if (diff === 1) {
            return "かんたん";
        } else if (diff === 2) {
            return "ふつう";
        } else if (diff === 3) {
            return "むずかしい";
        } else if (diff === 4) {
            return "おに(表)";
        } else {
            return "おに(裏)";
        }
    }

    return `
# S${season} #${session}
シーズン${season} 第${session}回が開始されました！

課題曲は以下の3曲です。
- ${songs[0].title} (${getDiffString(songs[0].diff)}, ★${songs[0].level})
- ${songs[1].title} (${getDiffString(songs[1].diff)}, ★${songs[1].level})
- ${songs[2].title} (${getDiffString(songs[2].diff)}, ★${songs[2].level})

詳細はこちらをご覧ください。
https://crating.taiko.wiki
`;
}