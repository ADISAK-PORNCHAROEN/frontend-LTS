import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllClo } from "./queries/QuriesKey";
import { getAllCloApi } from "#/app/api/userApi";
import { IClo } from "#/types/LTS/IPlo";

export default function useGetAllClo(
  options?: UseQueryOptions<IResponse<IClo[]>, Error>
) {
  return useQuery<IResponse<IClo[]>, Error>(
    [getAllClo],
    () => getAllCloApi(),
    {
      ...options,
      retry: 1,
    }
  );
}