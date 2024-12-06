import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/projectManagement/IResponse";
import { getAllUsers } from "./queries/QuriesKey";
import { getAllUsersApi } from "#/app/api/userApi";

export default function useGetAllUsers(
  options?: UseQueryOptions<IResponse<IUser[]>, Error>
) {
  return useQuery<IResponse<IUser[]>, Error>(
    [getAllUsers],
    () => getAllUsersApi(),
    {
      ...options,
      retry: 1,
    }
  );
}