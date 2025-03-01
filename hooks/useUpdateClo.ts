import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllClo, updateClo } from "./queries/QuriesKey";
import { updateCloApi } from "#/app/api/userApi";
import { IClo } from "#/types/LTS/IPlo";


export default function useUpdateClo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IClo>, { message: string }, IClo>(
        [updateClo], async (payload: IClo) => await updateCloApi(payload), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllClo]);
            }
        }
    )
}