import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo, createUserCloWithPlo } from "./queries/QuriesKey";
import { createUserCloWithCloApi } from "#/app/api/userApi";
import { ISubjects, IUserClo } from "#/types/LTS/ILts";

export default function useCreateUserCloWithPlo() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IUserClo>, { message: string }, IUserClo>(
        [createUserCloWithPlo],
        (payload: IUserClo) => createUserCloWithCloApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    );
}