import { CompeSong } from "./hirobaCompe";
import path from 'node:path';

export async function getSongPool(): Promise<[CompeSong[], CompeSong[], CompeSong[]]> {
    const jsonPath = path.join(process.cwd(), "songs.json");
    const json = await Bun.file(jsonPath).text();
    return JSON.parse(json);
}