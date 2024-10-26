import { useReducer, useRef } from 'react';

import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { mapResizeEventEmitter } from 'src/components/utils/events';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { useMobile } from 'src/components/hooks/useMedia';
import { useIntroJourney } from 'src/components/moleculas/IntroJourney';

import { activityInitialState, activityReducer } from './reducer';


export interface ActivityFormProps {
    activity?: TripDayActivity;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (activity: TripDayActivity) => void;
}

export function useActivityForm({ activity = activityInitialState, isOpen, onClose, onSubmit }: ActivityFormProps) {
    const isMobile = useMobile();

    const { nextStep } = useIntroJourney();

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

    const [state, dispatch] = useReducer(activityReducer, activity);

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
        if (isOpen) {
            dispatch({ type: 'RESET', payload: activity });

            if (!isPointRequested) {
                requestPointSelectionAsync(activity.address ? {
                    latitude: activity.latitude,
                    longitude: activity.longitude,
                    address: activity.address,
                } : undefined);
            }
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
    }

    const handleSave = () => {
        const newActivity = {
            ...state,
            name: state.name || state.address,
        };
        onSubmit(newActivity);
        handleClose();

        nextStep();
    }

    return {
        isMobile,
        popperRef,
        state,
        dispatch,
        handleClose,
        handleSave,
    }
};
