import { Close } from '@mui/icons-material';
import { Alert, Button, IconButton, TextField, Tooltip } from '@mui/material';
import { ReactNode, useReducer } from 'react';

import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { activityInitialState, activityReducer } from './reducer';

import styles from './AddActivityForm.module.scss';


export interface AddActivityFormProps {
    anchorEl: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (activity: TripDayActivity) => void;
}

export function AddActivityForm({ anchorEl, isOpen, onClose, onCreate }: AddActivityFormProps) {
    const [
        isPointRequested,
        requestPointSelectionAsync,
        requestedPoint,
        clearRequestedPoint,
    ] = usePointSelectionStoreShallow(s => [
        s.isPointRequested(),
        s.requestPointSelectionAsync,
        s.requestedPoint,
        s.clearRequestedPoint,
    ]);

    const [state, dispatch] = useReducer(activityReducer, activityInitialState);

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
        clearRequestedPoint();
        dispatch({ type: 'RESET' });
    }

    const handleCreate = () => {
        onCreate(state);
        handleClose();
    }

    return (
        <Tooltip
            open={isOpen}
            classes={{
                tooltip: styles.form,
            }}
            title={(
                <>
                    <IconButton
                        className={styles.formClose}
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>
                    <TextField
                        variant='standard'
                        label='Name'
                        value={state.name}
                        onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                        fullWidth
                    />
                    {state.address ? (
                        <>{state.address}</>
                    ) : (
                        <Alert severity='warning' className={styles.formLocationWarning}>
                            Please select location on the map
                        </Alert>
                    )}
                    <Button
                        className={styles.formButton}
                        variant='contained'
                        color='primary'
                        onClick={handleCreate}
                        disabled={!state.address}
                    >
                        Create activity
                    </Button>
                </>
            )}
        >
            <div className={styles.anchor}>{anchorEl}</div>
        </Tooltip>
    );
};
