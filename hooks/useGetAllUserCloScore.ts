import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserCloScore } from "./queries/QuriesKey";
import { getAllUserCloScoreApi } from "#/app/api/userApi";
import { IUserCloScore } from "#/types/LTS/ILts";

export default function useGetAllUserCloScore(
  options?: UseQueryOptions<IResponse<IUserCloScore[]>, Error>
) {
  return useQuery<IResponse<IUserCloScore[]>, Error>(
    [getAllUserCloScore],
    () => getAllUserCloScoreApi(),
    {
      ...options,
      retry: 1,
    }
  );
}