import { useQuery as useQueryBase, UseQueryOptions } from 'react-query';
import { ServiceResult } from 'src/services/serviceBase/ServiceResult';


export function useQuery<T>(
    key: string,
    fetch: () => Promise<ServiceResult<T>>,
    options?: Omit<UseQueryOptions<T, string>, 'queryKey' | 'queryFn'>
) {
    return useQueryBase<T, string>(
        key,
        async () => {
            const result = await fetch();

            if (result.isSuccessful) {
                return result.result;
            } else {
                throw result.error;
            }
        },
        options,
    );
}