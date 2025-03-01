import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllClo, deleteClo } from "./queries/QuriesKey";
import { deleteCloApi } from "#/app/api/userApi";
import { IClo } from "#/types/LTS/IPlo";

export default function useDeleteClo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IClo>, { message: string }, IClo>(
        [deleteClo], async (data: IClo) => await deleteCloApi(data), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllClo]);
            }
        }
    )
}