import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUsers, createUser } from "./queries/QuriesKey";
import { createUserApi } from "#/app/api/userApi";

export default function useCreateUsers() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IUser>, { message: string }, IUser>(
        [createUser],
        (payload: IUser) => createUserApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllUsers]);
            }
        }
    );
}