export interface IPlo {
    id?: number;
    ploName?: string;
    ploDesc?: string;
    ploStatus?: string;
}

export interface IClo {
    id?: number;
    cloDesc?: string;
    cloStatus?: string;
    [key: string]: any;
}

export interface IPloClo {
    id?: number;
    plo?: IPlo;
    clo?: IClo;
}

export interface IPloRows {
    id?: number;
    ploData?: string;
    [key: string]: any;
}