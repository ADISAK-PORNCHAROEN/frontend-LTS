import { IUser } from "../IResponse/IResponse";

export interface ISubjects {
    id?: number | null;
    subId?: string | null;
    subNameTh?: string | null;
    subNameEn?: string | null;
    subClo?: string | null;
    subDescTh?: string | null;    
    subDescEn?: string | null;
    subStatus?: string | null;
    createdDate?: Date | null;
    updatedDate?: Date | null;
    ids?: string | null;
    subjects?: ISubjects[] | null;
}

export interface IUserSubject {
    // id?: number | null;
    userId?: number | null;
    subjects?: number[] | null;
}