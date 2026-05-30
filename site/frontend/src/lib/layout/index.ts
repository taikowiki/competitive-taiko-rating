import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export namespace layout {
    export function useIsMobile() {
        const isMobile = writable<boolean>(window.innerWidth <= 768);
        window.addEventListener('resize', () => {
            isMobile.set(window.innerWidth <= 768);
        });
        setContext('isMobile', isMobile);
        return isMobile;
    }
    export function getIsMobile(): Writable<boolean> {
        return getContext('isMobile');
    }

    export function useLang() {
        let langInit = window.localStorage.getItem('lang');
        if (!(['ko', 'ja', 'en'] as any[]).includes(langInit)) {
            langInit = 'ko'
        }
        const lang = writable(langInit as 'ko' | 'ja' | 'en');
        lang.subscribe((v) => window.localStorage.setItem('lang', v));
        setContext('lang', lang);
        return lang;
    }
    export function getLang(){
        return getContext('lang') as Writable<'ko' | 'ja' | 'en'>;
    }
}