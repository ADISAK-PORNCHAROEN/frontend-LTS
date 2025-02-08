import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllSubjects, updateSubjects } from "./queries/QuriesKey";
import { updateSubjectsApi } from "#/app/api/userApi";
import { ISubjects } from "#/types/LTS/ILts";

export default function useUpdateSubjects() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<ISubjects>, { message: string }, ISubjects>(
        [updateSubjects], async (payload: ISubjects) => await updateSubjectsApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllSubjects]);
            }
        }
    )
}