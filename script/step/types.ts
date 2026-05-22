import { DateTime } from "luxon";
import { DBSchema } from "../module/db";
import { Account } from "../module/getAccounts";

export interface WorkflowState {
    latestCompetition?: DBSchema['competition'];
    season: number;
    session: number;
    now: DateTime;
    //seasonHandled: boolean;
    rankings: any[] | null;
    ratingsUpdated?: boolean;
    accounts: Account[];
    days: number;
}
