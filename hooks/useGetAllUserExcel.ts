import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel } from "./queries/QuriesKey";
import { getAllUserExcelApi } from "#/app/api/userApi";
import { IUserExcel } from "#/types/LTS/ILts";

export default function useGetAllUserExcel(
  options?: UseQueryOptions<IResponse<IUserExcel[]>, Error>
) {
  return useQuery<IResponse<IUserExcel[]>, Error>(
    [getAllUserExcel],
    () => getAllUserExcelApi(),
    {
      ...options,
      retry: 1,
    }
  );
}