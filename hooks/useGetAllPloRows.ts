import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllPloRows } from "./queries/QuriesKey";
import { getAllPloRowsApi } from "#/app/api/userApi";
import { IPloRows } from "#/types/LTS/IPlo";

export default function useGetAllPloRows(
  options?: UseQueryOptions<IResponse<IPloRows[]>, Error>
) {
  return useQuery<IResponse<IPloRows[]>, Error>(
    [getAllPloRows],
    () => getAllPloRowsApi(),
    {
      ...options,
      retry: 1,
    }
  );
}