import { IUser } from "../IResponse/IResponse";
import { IClo, IPlo } from "./IPlo";

export interface IExcel {
    subName?: string | null;
    userId?: number | null;
    curriculumId?: number | null;
    subId?: number | null;
    semester?: number | null;
    year?: string | null;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;

    id?: number | null;
    userCloId?: number | null;
    excelId?: number | null;
    score?: number | null;
}

export interface IExcelWithScore {
    subName?: string | null;
    userId?: number | null;
    subId?: number | null;
    semester?: number | null;
    year?: string | null;
    filterRows?: IUserExcel[] | null;
}

export interface ISubjects {
    id?: number | null;
    curriculum?: ICurriculum | null;
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
    dateCreated?: Date | null;
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

export interface IUserPlo {
    id?: number | null;
    userId?: number | null;
    curriculumId?: number | null;
    ploIds?: number[] | null;
    plo?: number[] | null;
    cloId?: number | null;
    ploId?: number | null;
    ploName?: string | null;
    ploDesc?: string | null;
    selected?: boolean | null;
    updatedPloIds?: {
        [cloId: string]: number[]
    };
}

export interface IUserClo {
    id?: number | null;
    userId?: number | null;
    subId?: number | null;
    curriculumId?: number | null;
    subjects?: ISubjects[] | null;
    clo?: IClo[] | null;
    plo?: IUserPlo[] | null;
    semester?: number | null;
    year?: string | null;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;
    ids?: string | null;
    ploIds?: number[] | null;
}

export interface IUserCloList {
    id?: number | null;
    userId?: number | null;
    curriculumId?: number | null;
    subId?: number | null;
    cloId?: number | null;
    cloName?: string | null;
    cloDesc?: string | null;
    semester?: number | null;
    year?: string | null;
    ids?: string | null;
}

export interface IUserCloScore {
    id?: number | null;
    userCloId?: number | null;
    curriculumId?: number | null;
    subId?: number | null;
    score?: number | null;
    semester?: number | null;
    year?: string | null;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;  
    threshold?: number | null;
    excelId?: number | null;
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
    curriculumType?: string | null;
}

export interface IUserExcel {
    id?: number | null;
    subId?: number | null;
    semester?: number | null;
    year?: string | null;
    stuId?: string | null;
    fullName?: string | null;
    // clos?: IUserCloList[] | null;
    userCloId?: number | null;
    excel?: IExcel[] | null;
    ids?: string | null;
    score?: number | null;
    createdDate?: Date | null;
    createdBy?: string | null;
    updatedDate?: Date | null;
    updatedBy?: string | null;
}

export interface IExcelScore {
    id: number;
    userCloId: number;
    excelId: number;
    score: number;
}

export interface IExcelItem {
    id: number;
    subId: number;
    semester: number;
    year: string;
    fullName: string;
    excel: IExcelScore[];
}

export interface IExcelResponse {
    success: boolean;
    message: string;
    data: IExcelItem[];
}

export interface ComprehensiveChartData {
    labels: string[];
    data: number[];
}

export interface ICloListItem {
    id: number;
    userId: number;
    curriculumId: number;
    subId: number;
    cloId: number;
    cloName: string;
    cloDesc: string;
    semester: number;
    year: string;
}

export interface ICloListResponse {
    success: boolean;
    message: string;
    data: ICloListItem[];
}

export interface ISubject {
    id: number;
    subNameTh: string;
}

export interface ChartDataItem {
    label: string;
    value: number;
}

export interface StudentEnrollmentChartProps {
    excelData: IExcelResponse; // Remove the | undefined
    isLoadingCloList: boolean;
    isLoadingExcelData: boolean;
    subjects: ISubject[]; // Make required by removing the ?
    [key: string]: any;
}