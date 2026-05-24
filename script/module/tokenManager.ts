import { DonderHiroba } from "hiroba-js";
import { Account } from "./getAccounts";

let token: string | null = null;

let tokenPromise: Promise<string> | null = null;

export async function getToken(): Promise<string> {
    if (tokenPromise) {
        await tokenPromise;
    }
    return token as string;
}

let re = 0;

export async function renewToken(account: Account) {
    try {
        if (tokenPromise) {
            const newToken = await tokenPromise;
            token = newToken;
            return newToken;
        }

        tokenPromise = (async () => {
            const _newToken = await DonderHiroba.func.getSessionToken(account);
            const cardList = await DonderHiroba.func.getCardList({
                token: _newToken
            });
            await DonderHiroba.func.cardLogin({
                token: _newToken,
                taikoNumber: cardList[0].taikoNumber
            });
            re = 0;
            token = _newToken;
            return _newToken;
        })().then(newToken => {
            tokenPromise = null;
            return newToken;
        });

        const newToken = await tokenPromise;

        return newToken;
    }
    catch (err) {
        if (re === 10) {
            re = 0;
            throw new Error('Hiroba Account Error');
        }
        console.warn('Hiroba Account Error, retry...');
        console.log(err);
        re++;
        return await renewToken(account);
    }
}