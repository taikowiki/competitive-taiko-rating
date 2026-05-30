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

    export type Season = {
        season: number;
        startDate: string;
        endDate: string;
    }

    export type Rating = {
        taikoNo: string;
        ranking: number;
        rating: number;
    }

    export type History = {
        season: number;
        session: number;
        taikoNo: string;
        score: number;
    }
}