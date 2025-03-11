import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUserClo, updateNewUserClo } from "./queries/QuriesKey";
import { updateNewUserCloApi } from "#/app/api/userApi";
import { IUserClo } from "#/types/LTS/ILts";

export default function useUpdateNewUserClo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserClo>, { message: string }, IUserClo >(
        [updateNewUserClo], async (payload: IUserClo) => await updateNewUserCloApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    )
}