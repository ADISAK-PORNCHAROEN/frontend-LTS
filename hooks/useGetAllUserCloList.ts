import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserCloList } from "./queries/QuriesKey";
import { getAllUserCloListApi } from "#/app/api/userApi";
import { IUserCloList } from "#/types/LTS/ILts";

export default function useGetAllUserCloList(
  options?: UseQueryOptions<IResponse<IUserCloList[]>, Error>
) {
  return useQuery<IResponse<IUserCloList[]>, Error>(
    [getAllUserCloList],
    () => getAllUserCloListApi(),
    {
      ...options,
      retry: 1,
    }
  );
}