import { DonderHiroba } from 'hiroba-js'
import { Account } from './getAccounts'
import { parse as parseHTML } from 'node-html-parser'

export type CompeSong = {
    songNo: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
}

export async function openHirobaCompe(account: Account, name: string, songs: [CompeSong, CompeSong, CompeSong], days: number) {
    const token = await DonderHiroba.func.getSessionToken({
        email: account.email,
        password: account.password
    });

    await DonderHiroba.func.cardLogin({ token, taikoNumber: account.taikoNo });
    const ticketbody = await fetch('https://donderhiroba.jp/compe_form.php', { headers: createHeader(`_token_v2=${token}`) }).then((e) => e.text());
    const ticket = DonderHiroba.parse.ticket(ticketbody);

    const header = createHeader(`_token_v2=${token}`);
    header.set("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    header.set("x-requested-with", "XMLHttpRequest");

    const body = new URLSearchParams();
    body.set('compename', name);
    body.set('song_cnt', '3');
    songs.forEach((song, i) => {
        i = i + 1;
        body.set(`song_no_${i}`, song.songNo);
        body.set(`song_no_${i}_level`, song.difficulty.toString(10));
        body.set(`song_no_${i}_song_speed`, '50');
        body.set(`song_no_${i}_doron_flg`, '2');
        body.set(`song_no_${i}_abecobe_flg`, '2');
        body.set(`song_no_${i}_song_random`, '3');
    });
    body.set('member_count', '15');
    body.set('member_area', '0');
    body.set('title', '0');
    body.set('compe_days', (days - 1).toString());
    body.set('comment', '');
    body.set('_tckt', ticket ?? '');

    let response = await fetch("https://donderhiroba.jp/ajax/compe_create.php", {
        "headers": header,
        "body": body.toString(),
        "method": "post"
    });

    if (response.status !== 200) {
        throw response;
    }

    try {
        var json = await response.json();
    } catch {
        throw response;
    }

    if (json.result !== 0) {
        throw json;
    }

    response = await fetch('https://donderhiroba.jp/compe_top.php', {
        headers: createHeader(`_token_v2=${token}`)
    });

    const dom = parseHTML(await response.text());
    const ob = dom.querySelector('.festival .buttonArea a')

    if (!ob) {
        return null;
    }

    const compeURL = new URL(ob.getAttribute('href') ?? '', 'https://donderhiroba.jp');
    return compeURL.searchParams.get('compeid')
}

export function createHeader(cookie?: string) {
    const headers: Record<string, string> = {
        "accept": "*/*",
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        "cache-control": "max-age=0",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        "referer": "https://donderhiroba.jp",

    }

    if (cookie) {
        if (!cookie.trim().endsWith(';')) {
            cookie = cookie.trim() + ';';
        }
        headers.cookie = cookie;
    }

    return new Headers(headers);
}