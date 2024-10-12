import { useCallback, useRef } from 'react';


export function useMutable<T>(
    initialValue: T
): [get: () => T, set: (v: T) => void] {
    const ref = useRef(initialValue);

    const getMutable = useCallback(() => ref.current, [ref]);
    const setMutable = useCallback(
        (value: T) => {
            ref.current = value;
        },
        [ref]
    );

    return [getMutable, setMutable];
}

export default useMutable;
