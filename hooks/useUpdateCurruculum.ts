import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllCurriculum, updateCurriculum } from "./queries/QuriesKey";
import { updateCurriculumApi } from "#/app/api/userApi";
import { ICurriculum } from "#/types/LTS/ILts";

export default function useUpdateCurruculum() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<ICurriculum>, { message: string }, ICurriculum>(
        [updateCurriculum], async (payload: ICurriculum) => await updateCurriculumApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllCurriculum]);
            }
        }
    )
}