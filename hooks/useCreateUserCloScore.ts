import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { createUserCloScore, getAllUserCloScore } from "./queries/QuriesKey";
import { createUserCloScoreApi } from "#/app/api/userApi";
import { ISubjects, IUserClo, IUserCloScore } from "#/types/LTS/ILts";

export default function useCreateUserCloScore() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IUserCloScore>, { message: string }, IUserCloScore>(
        [createUserCloScore],
        (payload: IUserCloScore) => createUserCloScoreApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserCloScore]);
            }
        }
    );
}