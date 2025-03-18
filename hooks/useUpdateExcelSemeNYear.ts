import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel, updateExcelSemeNYear } from "./queries/QuriesKey";
import { updateExcelSemeNYearApi } from "#/app/api/userApi";
import { IUserExcel } from "#/types/LTS/ILts";

export default function useUpdateExcelSemeNYear() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserExcel>, { message: string }, IUserExcel>(
        [updateExcelSemeNYear], async (payload: IUserExcel) => await updateExcelSemeNYearApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserExcel]);
            }
        }
    )
}