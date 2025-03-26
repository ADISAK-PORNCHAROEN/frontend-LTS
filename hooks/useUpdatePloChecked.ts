import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllUserClo, updatePlo } from "./queries/QuriesKey";
import { updatePloCheckedApi } from "#/app/api/userApi";
import { IPloChecked } from "#/types/LTS/IPlo";

export default function useUpdatePloChecked() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IPloChecked>, { message: string }, IPloChecked>(
        [updatePlo], async (payload: IPloChecked) => await updatePloCheckedApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllUserClo]);
            }
        }
    )
}