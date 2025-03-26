import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo, createUserCloWithPloUpdate } from "./queries/QuriesKey";
import { createUserCloWithCloUpdateApi } from "#/app/api/userApi";
import { ISubjects, IUserClo } from "#/types/LTS/ILts";

export default function useCreateUserCloWithPloUpdate() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IUserClo>, { message: string }, IUserClo>(
        [createUserCloWithPloUpdate],
        (payload: IUserClo) => createUserCloWithCloUpdateApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    );
}