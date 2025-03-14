import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel, updateExcelScore } from "./queries/QuriesKey";
import { updateExcelScoreApi } from "#/app/api/userApi";
import { IExcel } from "#/types/LTS/ILts";

export default function useUpdateExcelScore() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IExcel>, { message: string }, IExcel>(
        [updateExcelScore], async (payload: IExcel) => await updateExcelScoreApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserExcel]);
            }
        }
    )
}