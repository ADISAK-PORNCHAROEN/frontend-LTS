import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserExcel, uploadExcel } from "./queries/QuriesKey";
import { uploadExcelApi } from "#/app/api/userApi";
import { ISubjects, IExcel } from "#/types/LTS/ILts";

export default function useUplodaExcel() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IExcel>, { message: string }, { payload: IExcel, file: File }>(
        [uploadExcel],
        // เปลี่ยนรูปแบบข้อมูลที่รับเป็น object ที่มี payload และ file
        ({ payload, file }) => uploadExcelApi(payload, file),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserExcel]);
            }
        }
    );
}