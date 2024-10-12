import { DependencyList, useEffect } from 'react';

import useMutable from '../useMutable';


type Destructor = (() => void) | void | undefined;

const useOnDidUpdate = (
    onDidUpdate: () => Destructor,
    deps: DependencyList,
    firstRenderCleanUp: Destructor = undefined
) => {
    const [getIsMounted, setIsMounted] = useMutable(false);

    useEffect(() => {
        if (!getIsMounted()) {
            setIsMounted(true);

            return firstRenderCleanUp;
        }

        return onDidUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useOnDidUpdate;
