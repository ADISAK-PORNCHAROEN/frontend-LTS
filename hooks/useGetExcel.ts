import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo, getExcel } from "./queries/QuriesKey";
import { getExcelApi } from "#/app/api/userApi";
import { IExcel, ISubjects, IUserClo } from "#/types/LTS/ILts";

export default function useGetExcel() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IExcel>, { message: string }, IExcel>(
        [getExcel],
        (payload: IExcel) => getExcelApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    );
}