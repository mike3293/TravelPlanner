import { useMutation as useMutationBase, UseMutationOptions } from 'react-query';

import { ServiceResult } from 'src/services/serviceBase/ServiceResult';


export function useMutation<T, V>(
    mutate: (variables: V) => Promise<ServiceResult<T>>,
    options?: Omit<UseMutationOptions<T, string, V>, 'mutationFn'>
) {
    return useMutationBase<T, string, V>(
        async (variables: V) => {
            const result = await mutate(variables);

            if (result.isSuccessful) {
                return result.result;
            } else {
                throw result.error;
            }
        },
        options,
    );
}
