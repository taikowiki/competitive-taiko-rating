import { getContext, setContext } from "svelte";
import { derived, type Readable } from "svelte/store";
import { layout } from "../../lib/layout";
import ko from "./ko.json";
import en from "./en.json";
import ja from "./ja.json";
import koMd from "./about/ko.md?raw";
import enMd from "./about/en.md?raw";
import jaMd from "./about/ja.md?raw";

const translations: any = { 
    ko: { ...ko, about_content: koMd },
    en: { ...en, about_content: enMd },
    ja: { ...ja, about_content: jaMd }
};

export function useI18n() {
    const lang = layout.getLang();
    const t = derived(lang, ($lang) => {
        return (key: string) => {
            return translations[$lang][key] || key;
        };
    });
    setContext('t', t);
    return t;
}

export function getI18n() {
    return getContext('t') as Readable<(key: string) => string>;
}
