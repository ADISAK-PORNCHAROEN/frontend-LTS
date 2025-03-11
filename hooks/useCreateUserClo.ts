import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo, createUserClo } from "./queries/QuriesKey";
import { createUserCloApi } from "#/app/api/userApi";
import { ISubjects, IUserClo } from "#/types/LTS/ILts";

export default function useCreateUserClo() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IUserClo>, { message: string }, IUserClo>(
        [createUserClo],
        (payload: IUserClo) => createUserCloApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    );
}