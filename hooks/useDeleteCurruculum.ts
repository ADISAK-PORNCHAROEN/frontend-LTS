import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllCurriculum, deleteCurriculum, getAllUsers } from "./queries/QuriesKey";
import { deleteCurriculumApi } from "#/app/api/userApi";
import { ICurriculum } from "#/types/LTS/ILts";

export default function useDeleteCurruculum() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<ICurriculum>, { message: string }, ICurriculum>(
        [deleteCurriculum], async (data: ICurriculum) => await deleteCurriculumApi(data), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllCurriculum]);
                queryClient.invalidateQueries([getAllUsers]);
            }
        }
    )
}