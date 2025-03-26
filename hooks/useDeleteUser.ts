import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUsers, deleteUser } from "./queries/QuriesKey";
import { deleteUserApi } from "#/app/api/userApi";

export default function useDeleteUsers() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUser>, { message: string }, IUser>(
        [deleteUser], async (payload: IUser) => await deleteUserApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUsers]);
            }
        }
    )
}