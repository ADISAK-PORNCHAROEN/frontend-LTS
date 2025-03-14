import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel, deleteUserExcel } from "./queries/QuriesKey";
import { deleteUserExcelApi } from "#/app/api/userApi";
import { IUserExcel } from "#/types/LTS/ILts";

export default function useDeleteUserExcel() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserExcel>, { message: string }, IUserExcel>(
        [deleteUserExcel], async (data: IUserExcel) => await deleteUserExcelApi(data), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserExcel]);
            }
        }
    )
}