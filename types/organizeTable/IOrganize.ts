export interface IOrganizeHaeder {
    organizeName?: string | null;
    seqNo?: number | null;
    hideFlag?: string | null;
}

export interface IOrganizeRequest {
    userId: number;
    userName: string;
    organizeCode: string;
    organizeList: IOrganizeHaeder[];
}
export interface IOrganizeTableUserGet {
    userId?: number | null;
    organizeCode?: string | null;
}


export interface IOrganizeTableGet {
    roleId?: number | null;
    organizeCode?: string | null;
}