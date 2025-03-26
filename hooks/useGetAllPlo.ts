import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllPlo } from "./queries/QuriesKey";
import { getAllPloApi } from "#/app/api/userApi";
import { IPlo } from "#/types/LTS/IPlo";

export default function useGetAllPlo(
  options?: UseQueryOptions<IResponse<IPlo[]>, Error>
) {
  return useQuery<IResponse<IPlo[]>, Error>(
    [getAllPlo],
    () => getAllPloApi(),
    {
      ...options,
      retry: 1,
    }
  );
}