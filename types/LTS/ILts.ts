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
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;
    ids?: string | null;
    subjects?: ISubjects[] | null;
}

export interface IUserSubject {
    // id?: number | null;
    userId?: number | null;
    subjects?: number[] | null;
}

export interface IUserSubject1 {
    id?: number | null;
    userId?: number | null;
    subjects?: ISubjects[] | null | undefined;
}

export interface ICurriculum {
    id?: number | null;
    curriculumCode?: string | null;
    nameTh?: string | null;
    nameEn?: string | null;
    degreeFullTh?: string | null;
    degreeShortTh?: string | null;
    degreeFullEn?: string | null;
    degreeShortEn?: string | null;
    major?: string | null;
    totalCredits?: string | null;
    programType?: string | null;
    degreeCategory?: string | null;
    language?: string | null;
    acceptance?: string | null;
    integration?: string | null;
    collaboration?: string | null;
    degreeGranted?: string | null;
    approvalCurriculum?: string | null;
    previousCurriculum?: string | null;
    qualityAssurance?: string | null;
    career?: string | null;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;
    ids?: string | null;
}