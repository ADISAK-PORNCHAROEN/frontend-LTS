import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUsers, updateUser } from "./queries/QuriesKey";
import { updateUserApi } from "#/app/api/userApi";

export default function useUpdateUsers() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUser>, { message: string }, IUser>(
        [updateUser], async (payload: IUser) => await updateUserApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUsers]);
            }
        }
    )
}