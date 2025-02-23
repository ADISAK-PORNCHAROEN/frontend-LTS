import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllCurriculum, createCurriculum } from "./queries/QuriesKey";
import { createCurriculumApi } from "#/app/api/userApi";
import { ICurriculum } from "#/types/LTS/ILts";

export default function useCreateCurriculum() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<ICurriculum>, { message: string }, ICurriculum>(
        [createCurriculum],
        (payload: ICurriculum) => createCurriculumApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllCurriculum]);
            }
        }
    );
}