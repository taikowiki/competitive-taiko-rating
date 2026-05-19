import { DonderHiroba } from "hiroba-js";
import { getAccounts } from "./module/getAccounts";
import { openCompe } from "./module/openCompe";

const accounts = await getAccounts();

for (const account of accounts) {
    console.log(await openCompe(
        account,
        '테스트',
        [
            {
                songNo: "1",
                difficulty: 4
            },
            {
                songNo: "2",
                difficulty: 4
            },
            {
                songNo: "3",
                difficulty: 4
            }
        ]
    ))
}