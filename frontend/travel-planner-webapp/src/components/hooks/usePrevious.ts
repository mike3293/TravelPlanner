import { useEffect, useRef } from 'react';


export const usePrevious = <T>(current: T): T | null => {
    const ref = useRef<T | null>(null);

    useEffect(() => { ref.current = current; }, [current]);

    return ref.current;
};
