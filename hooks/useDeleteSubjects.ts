import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllSubjects, deleteSubjects } from "./queries/QuriesKey";
import { deleteSubjectsApi } from "#/app/api/userApi";
import { ISubjects } from "#/types/LTS/ILts";

export default function useDeleteSubjects() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<ISubjects>, { message: string }, ISubjects>(
        [deleteSubjects], async (data: ISubjects) => await deleteSubjectsApi(data), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllSubjects]);
            }
        }
    )
}