import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel, getExcelWithScore } from "./queries/QuriesKey";
import { getExcelWithScoreApi } from "#/app/api/userApi";
import { IExcelWithScore } from "#/types/LTS/ILts";

export default function useGetExcelWithScore() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IExcelWithScore>, { message: string }, IExcelWithScore>(
        [getExcelWithScore],
        (payload: IExcelWithScore) => getExcelWithScoreApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserExcel]);
            }
        }
    );
}