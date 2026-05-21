import { getAccounts } from "./module/getAccounts";
import { step1 } from "./step/step1";
import { step2 } from "./step/step2";
import { step3 } from "./step/step3";
import { step4 } from "./step/step4";
import { step5 } from "./step/step5";
import { WorkflowState } from "./step/types";

async function main() {
    console.log("Starting main workflow via modular steps...");

    const state: WorkflowState = {
        currentSeasonNo: 1,
        now: null as any,
        seasonHandled: false,
        rankings: null,
        sessionNo: 0,
        accounts: await getAccounts()
    };

    await step1(state);
    await step2(state);
    await step3(state);
    await step4(state);
    await step5(state);
}

main().catch(err => {
    console.error("Main workflow failed:", err);
});

export { };
