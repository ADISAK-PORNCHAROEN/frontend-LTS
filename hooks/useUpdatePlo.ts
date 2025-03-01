import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllPlo, updatePlo } from "./queries/QuriesKey";
import { updatePloApi } from "#/app/api/userApi";
import { IPlo } from "#/types/LTS/IPlo";

export default function useUpdatePlo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IPlo>, { message: string }, IPlo>(
        [updatePlo], async (payload: IPlo) => await updatePloApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllPlo]);
            }
        }
    )
}