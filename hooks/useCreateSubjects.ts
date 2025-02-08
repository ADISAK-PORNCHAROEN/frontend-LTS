import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllSubjects, createSubjects } from "./queries/QuriesKey";
import { createSubjectsApi } from "#/app/api/userApi";
import { ISubjects } from "#/types/LTS/ILts";

export default function useCreateUsers() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<ISubjects>, { message: string }, ISubjects>(
        [createSubjects],
        (payload: ISubjects) => createSubjectsApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllSubjects]);
            }
        }
    );
}