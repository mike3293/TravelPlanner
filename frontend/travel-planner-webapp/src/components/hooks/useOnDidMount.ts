import { useEffect } from 'react';


export const useOnDidMount = (onDidMount: () => void, onWillUnmount?: () => void) => useEffect(() => {
    onDidMount();

    return onWillUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
