import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserCloScore, updateUserCloScore } from "./queries/QuriesKey";
import { updateUserCloScoreApi } from "#/app/api/userApi";
import { IUserCloScore } from "#/types/LTS/ILts";

export default function useUpdateUserCloScore() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserCloScore>, { message: string }, IUserCloScore>(
        [updateUserCloScore], async (payload: IUserCloScore) => await updateUserCloScoreApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserCloScore]);
            }
        }
    )
}