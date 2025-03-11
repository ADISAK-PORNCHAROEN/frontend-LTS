import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IResponse } from "#/types/IResponse/IResponse";
import { getAllClo, createClo } from "./queries/QuriesKey";
import { createCloApi } from "#/app/api/userApi";
import { IClo, IPlo } from "#/types/LTS/IPlo";

export default function useCreateClo() {
    const queryClient = useQueryClient();
    
    return useMutation<IResponse<IClo>, { message: string }, IClo>(
        [createClo],
        (payload: IClo) => createCloApi(payload),
        {

            onSuccess: () => {
                queryClient.invalidateQueries([getAllClo]);
            }
        }
    );
}