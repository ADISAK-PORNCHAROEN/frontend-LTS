import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllPlo, createPlo } from "./queries/QuriesKey";
import { createPloApi } from "#/app/api/userApi";
import { IPlo } from "#/types/LTS/IPlo";

export default function useCreatePlo() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IPlo>, { message: string }, IPlo>(
        [createPlo],
        (payload: IPlo) => createPloApi(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([getAllPlo]);
            }
        }
    );
}