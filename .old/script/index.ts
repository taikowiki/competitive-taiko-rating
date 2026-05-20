import { defaultDBConnector, runQuery } from "@yowza/db-handler";
import { getHirobaCompes, getLatestCompetition, queryBuilder } from "./module/db";
import { DateTime } from 'luxon';
import { Account, getAccounts } from "./module/getAccounts";
import { CompeData, DonderHiroba } from "hiroba-js";

test();

async function test() {
    const accounts = await getAccounts();

    await checkLatestCompetition(accounts[0]);
}

async function main() {

}

async function checkLatestCompetition(account: Account) {
    const latestCompetition = await getLatestCompetition();
    const checkDate = DateTime.fromFormat(
        latestCompetition.checkDate,
        'yyyy-MM-dd',
        {zone: '+09:00'}
    );
    
    if(checkDate.hasSame(DateTime.now(), 'day')){
        const hirobaCompes = await getHirobaCompes(
            latestCompetition.season,
            latestCompetition.session
        );

        const token = await DonderHiroba.func.getSessionToken(account);
        await DonderHiroba.func.cardLogin({token, taikoNumber: account.taikoNo});

        const hirobaCompeDatas: CompeData[] = [];
        for(const h of hirobaCompes){
            try{
                const compeData = await DonderHiroba.func.getCompeData({token, compeId: h.compeId});
                if(compeData){
                    hirobaCompeDatas.push(compeData);
                } else {
                    throw null;
                }
            } catch(err){
                console.error(`Hiroba compe crawling error (id:${h.compeId}):${err}\n`)
            }
        }
    }
}