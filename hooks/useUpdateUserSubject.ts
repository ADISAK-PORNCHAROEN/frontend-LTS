import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { getAllUsers, updateUserSubjects } from "./queries/QuriesKey";
import { updateUserSubjectApi } from "#/app/api/userApi";
import { IUserSubject } from "#/types/LTS/ILts";

export default function useUpdateUserSubject() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IUserSubject>, { message: string }, IUserSubject >(
        [updateUserSubjects], async (payload: IUserSubject) => await updateUserSubjectApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUsers]);
            }
        }
    )
}