import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllCloList } from "./queries/QuriesKey";
import { getAllCloListApi } from "#/app/api/userApi";
import { IClo } from "#/types/LTS/IPlo";

export default function useGetAllCloList(
  options?: UseQueryOptions<IResponse<IClo[]>, Error>
) {
  return useQuery<IResponse<IClo[]>, Error>(
    [getAllCloList],
    () => getAllCloListApi(),
    {
      ...options,
      retry: 1,
    }
  );
}