export namespace models{
    export type Session = {
        season: number;
        session: number;
        songs: {
            songNo: string;
            title: string;
            level: number;
            diff: '4' | '5';
        }[];
        start: string;
        end: string;
    }
}