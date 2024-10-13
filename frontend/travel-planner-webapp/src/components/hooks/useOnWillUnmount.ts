import { useEffect } from 'react';


export const useOnWillUnmount = (
    onWillUnmount: () => void | undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
) => useEffect(() => onWillUnmount, []);

