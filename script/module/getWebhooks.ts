import path from "node:path";

export async function getWebhooks(): Promise<Partial<Record<'ko' | 'en' | 'ja', string>>> {
    const jsonPath = path.join(process.cwd(), "webhooks.json");
    const json = await Bun.file(jsonPath).text();
    return JSON.parse(json);
}