import { useReducer, useRef } from 'react';

import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { mapResizeEventEmitter } from 'src/components/utils/events';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { useMobile } from 'src/components/hooks/useMedia';

import { activityInitialState, activityReducer } from './reducer';


export interface AddActivityFormProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (activity: TripDayActivity) => void;
}

export function useAddActivityForm({ isOpen, onClose, onCreate }: AddActivityFormProps) {
    const isMobile = useMobile();

    const [
        isPointRequested,
        requestPointSelectionAsync,
        requestedPoint,
        confirmPointSelection,
    ] = usePointSelectionStoreShallow(s => [
        s.isPointRequested,
        s.requestPointSelection,
        s.requestedPoint,
        s.confirmPointSelection,
    ]);

    const [state, dispatch] = useReducer(activityReducer, activityInitialState);


    // Supressed as mui does not reexport ref type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popperRef = useRef<any>(null);

    useOnDidMount(() => {
        if (isMobile) {
            return;
        }
        const handleResize = () => popperRef.current?.update();
        mapResizeEventEmitter.subscribe(handleResize);

        return () => {
            mapResizeEventEmitter.unsubscribe(handleResize);
        };
    });

    useOnDidUpdate(() => {
        if (isOpen && !isPointRequested) {
            requestPointSelectionAsync();
        }
    }, [isOpen]);

    useOnDidUpdate(() => {
        if (isOpen && requestedPoint) {
            dispatch({ type: 'SET_POINT', payload: requestedPoint });
        }
    }, [requestedPoint]);

    const handleClose = () => {
        onClose();
        confirmPointSelection();
        dispatch({ type: 'RESET' });
    }

    const handleCreate = () => {
        onCreate({
            ...state,
            name: state.name || state.address,
        });
        handleClose();
    }

    return {
        isMobile,
        popperRef,
        state,
        dispatch,
        handleClose,
        handleCreate,
    }
};
