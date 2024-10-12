import { Alert, Button, Fade, Paper, Popper, TextField } from '@mui/material';
import { useReducer } from 'react';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';

import { activityInitialState, activityReducer } from './reducer';

import styles from './AddActivityForm.module.scss';


export interface AddActivityFormProps {
    anchorEl: HTMLElement;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (activity: TripDayActivity) => void;
}

// export interface TripDayActivity {
//     id: string;
//     address: string;
//     latitude: number;
//     longitude: number;
//     name: string | null;
//     description: string | null;
//     imageUrl: string | null;
//     duration: Duration | null;
// }
export function AddActivityForm({ anchorEl, isOpen, onCreate }: AddActivityFormProps) {
    const requestPointSelectionAsync = usePointSelectionStoreShallow(s => s.requestPointSelectionAsync);

    const [state, dispatch] = useReducer(activityReducer, activityInitialState);

    const handleOpen = async () => {
        const point = await requestPointSelectionAsync();

        dispatch({ type: 'SET_POINT', payload: point });
    }


    useOnDidUpdate(() => {
        if (isOpen) {
            handleOpen();
        }
    }, [isOpen]);

    return (
        <Popper open={isOpen} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper className={styles.form}>
                        <TextField
                            variant='standard'
                            label='Name'
                            value={state.name}
                            onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                            fullWidth
                        />
                        {state.address ? (
                            <>hi</>
                        ) : (
                            <Alert severity='warning' className={styles.formLocationWarning}>
                                Please select location on the map
                            </Alert>
                        )}
                        <Button
                            className={styles.formButton}
                            variant='contained'
                            color='primary'
                            onClick={() => onCreate(state)}
                            disabled={!state.name || !state.address}
                        >
                            Create activity
                        </Button>
                    </Paper>
                </Fade>
            )}
        </Popper >
    );
};
