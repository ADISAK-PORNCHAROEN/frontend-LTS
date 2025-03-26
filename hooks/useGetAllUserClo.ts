import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo } from "./queries/QuriesKey";
import { getAllUserCloApi } from "#/app/api/userApi";
import { IUserClo } from "#/types/LTS/ILts";

export default function useGetAllUserClo(
  options?: UseQueryOptions<IResponse<IUserClo[]>, Error>
) {
  return useQuery<IResponse<IUserClo[]>, Error>(
    [getAllUserClo],
    () => getAllUserCloApi(),
    {
      ...options,
      retry: 1,
    }
  );
}