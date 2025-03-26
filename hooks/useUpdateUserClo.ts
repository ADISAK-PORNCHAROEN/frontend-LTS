import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUserClo, updateUserClo } from "./queries/QuriesKey";
import { updateUserCloApi } from "#/app/api/userApi";
import { IUserClo } from "#/types/LTS/ILts";

export default function useUpdateUserClo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserClo>, { message: string }, IUserClo >(
        [updateUserClo], async (payload: IUserClo) => await updateUserCloApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    )
}