import { Setting } from "./types";
import path from 'node:path';

export async function getSetting(): Promise<Setting> {
    const jsonPath = path.join(process.cwd(), "setting.json");
    const json = await Bun.file(jsonPath).text();
    return JSON.parse(json);
}