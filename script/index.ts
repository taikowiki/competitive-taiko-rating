import { step1 } from "./step/step1";
import { step2 } from "./step/step2";
import { step3 } from "./step/step3";
import { step4 } from "./step/step4";

async function main() {
    console.log("Starting workflow...");
    const { accounts, setting, now, currentSeason, currentCompetition, needToCheck} = await step1();
    const rankings = await step2(accounts[0], currentCompetition, needToCheck);
    await step3(accounts, setting, rankings, currentCompetition, needToCheck);
    await step4(accounts, setting, currentSeason, currentCompetition, now, needToCheck);
    console.log("Workflow completed successfully.");
    process.exit(0);
}

await main().catch(err => console.error(err))

export { };
