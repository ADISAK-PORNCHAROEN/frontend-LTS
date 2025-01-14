export interface IResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string;
}

export interface IResponsePmsDTO<T> {
    success: boolean;
    message: string;
    data: T | null;
    error: string | null;
  }

export interface ApiLine {
    id?: number;
    name?: string | null;
    create_date: Date | null;
    create_by: string | null;
    update_date: Date | null;
    update_by: string | null;
}

export interface IUser {
    id?: number | null;
    name?: string | null;
    email?: string | null;
    password?: string | null;
    image?: string | null;
    role?: string | null;   
    createdDate?: Date | null;
    updatedDate?: Date | null;
}

export interface IAccount {
    id?: number | null;
    userId?: number | null;
    type?: string | null;
    provider?: string | null;   
    providerAccountId?: string | null;
    refreshToken?: string | null;
    accessToken?: string | null;
    expiresAt?: number | null;
    tokenType?: string | null;
    scope?: string | null;
    idToken?: string | null;
    sessionState?: string | null;
}