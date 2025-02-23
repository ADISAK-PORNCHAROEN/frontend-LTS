import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllCurriculum } from "./queries/QuriesKey";
import { getAllCurriculumApi } from "#/app/api/userApi";
import { ICurriculum } from "#/types/LTS/ILts";

export default function useGetAllCurriculum(
  options?: UseQueryOptions<IResponse<ICurriculum[]>, Error>
) {
  return useQuery<IResponse<ICurriculum[]>, Error>(
    [getAllCurriculum],
    () => getAllCurriculumApi(),
    {
      ...options,
      retry: 1,
    }
  );
}