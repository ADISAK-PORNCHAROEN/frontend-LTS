import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getFindEmail } from "./queries/QuriesKey";
import { getFindEmailApi } from "#/app/api/userApi";

export default function useGetFindEmail(
  options?: UseQueryOptions<IResponse<IUser[]>, Error>
) {
  return useQuery<IResponse<IUser[]>, Error>(
    [getFindEmail],
    () => getFindEmailApi(),
    {
      ...options,
      retry: 1,
    }
  );
}