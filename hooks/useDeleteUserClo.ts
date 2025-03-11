import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo, deleteUserClo } from "./queries/QuriesKey";
import { deleteUserCloApi } from "#/app/api/userApi";
import { IUserClo } from "#/types/LTS/ILts";

export default function useDeleteUserClo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserClo>, { message: string }, IUserClo>(
        [deleteUserClo], async (data: IUserClo) => await deleteUserCloApi(data), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    )
}