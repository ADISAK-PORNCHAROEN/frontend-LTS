import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllCloList, getAllUserClo, updateUserPlosMany } from "./queries/QuriesKey";
import { updateUserPloManyApi } from "#/app/api/userApi";
import { IUserPlo } from "#/types/LTS/ILts";

export default function useUpdateUserPloMany() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserPlo>, { message: string }, IUserPlo >(
        [updateUserPlosMany], async (payload: IUserPlo) => await updateUserPloManyApi(payload), {


            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
                queryClient.invalidateQueries([getAllCloList]);
            }
        }
    )
}