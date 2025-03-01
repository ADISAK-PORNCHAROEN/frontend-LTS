import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllPlo, deletePlo } from "./queries/QuriesKey";
import { deletePloApi } from "#/app/api/userApi";
import { IPlo } from "#/types/LTS/IPlo";

export default function useDeletePlo() {
    const queryClient = useQueryClient();
    return useMutation<IResponse<IPlo>, { message: string }, IPlo>(
        [deletePlo], async (data: IPlo) => await deletePloApi(data), {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllPlo]);
            }
        }
    )
}