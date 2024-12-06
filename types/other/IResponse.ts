export interface IResponse {
  success: boolean;
  message: string;
  data: any | null;
  error: string | null;
}

export interface IResponseDTO<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
}

export interface IPagination<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
  first: boolean;
}
