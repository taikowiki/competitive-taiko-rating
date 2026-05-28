import { writable, derived } from 'svelte/store';
import en from './en.json';
import ja from './ja.json';
import ko from './ko.json';

const translations: Record<string, Record<string, string>> = { en, ja, ko };

export const locale = writable('ko');

export const t = derived(locale, ($locale) => {
    return (key: string) => translations[$locale]?.[key] || key;
});
