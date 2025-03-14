import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel, updateExcelName } from "./queries/QuriesKey";
import { updateExcelNameApi } from "#/app/api/userApi";
import { IUserExcel } from "#/types/LTS/ILts";

export default function useUpdateExcelScore() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserExcel>, { message: string }, IUserExcel>(
        [updateExcelName], async (payload: IUserExcel) => await updateExcelNameApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserExcel]);
            }
        }
    )
}