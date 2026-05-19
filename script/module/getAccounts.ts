import path from 'node:path';

export type Account = {
    email: string;
    password: string;
    taikoNo: string;
}

export async function getAccounts(): Promise<Account[]> {
    const jsonPath = path.join(process.cwd(), "accounts.json");
    const json = await Bun.file(jsonPath).text();
    return JSON.parse(json) as Account[];
}