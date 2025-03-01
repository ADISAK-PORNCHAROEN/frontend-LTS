import { ICurriculum, ISubjects } from "./ILts";

export interface IPlo {
    id?: number;
    curriculum?: ICurriculum | null;
    ploName?: string;
    ploDesc?: string;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;
    ids?: string | null;
}

export interface IClo {
    id?: number | null;
    curriculum?: ICurriculum | null;
    subjects?: ISubjects | null;
    cloName?: string | null;
    cloDesc?: string | null;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;
    ids?: string | null;
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