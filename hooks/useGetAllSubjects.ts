import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllSubjects } from "./queries/QuriesKey";
import { getAllSubjectsApi } from "#/app/api/userApi";
import { ISubjects } from "#/types/LTS/ILts";

export default function useGetAllSubjects(
  options?: UseQueryOptions<IResponse<ISubjects[]>, Error>
) {
  return useQuery<IResponse<ISubjects[]>, Error>(
    [getAllSubjects],
    () => getAllSubjectsApi(),
    {
      ...options,
      retry: 1,
    }
  );
}