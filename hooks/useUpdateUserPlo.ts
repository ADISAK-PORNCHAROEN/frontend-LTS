import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUserClo, updateUserPlos } from "./queries/QuriesKey";
import { updateUserPloApi } from "#/app/api/userApi";
import { IUserPlo } from "#/types/LTS/ILts";

export default function useUpdateUserPlo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserPlo>, { message: string }, IUserPlo >(
        [updateUserPlos], async (payload: IUserPlo) => await updateUserPloApi(payload), {


            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    )
}