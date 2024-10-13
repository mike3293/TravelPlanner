import { useReducer } from 'react';
import { TextField, Button, Dialog, DialogContent, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQueryClient } from 'react-query';

import { useMutation } from 'src/components/hooks/useMutation';
import { tripsService } from 'src/config/services';
import { DateFormat } from 'src/config/dateFormats';
import { Trip } from 'src/services/trips/Trip';

import { tripReducer } from './reducer';

import styles from './EditTripForm.module.scss';


export interface EditTripFormProps {
    trip: Trip;
    onClose: () => void;
}

export function EditTripForm({ trip, onClose }: EditTripFormProps) {
    const queryClient = useQueryClient();
    const { mutate: create, isLoading, error } = useMutation(() => tripsService.updateTripAsync(trip.id, {
        name: state.name,
        startDate: state.startDate,
        endDate: state.endDate,
    }), {
        onSuccess: (data) => {
            queryClient.setQueryData(['trip', trip.id], data);

            onClose();
        },
    });

    const [state, dispatch] = useReducer(tripReducer, trip);

    return (
        <Dialog open onClose={onClose}>
            <DialogContent className={styles.form}>
                <TextField
                    label='Trip Name'
                    variant='standard'
                    fullWidth
                    value={state.name}
                    onChange={(e) => dispatch({ type: 'SET_TRIP_NAME', payload: e.target.value })}
                />

                <DatePicker
                    label='Start Date'
                    slotProps={{ textField: { variant: 'standard' } }}
                    format={DateFormat.Date}
                    value={state.startDate}
                    onChange={(date) => dispatch({ type: 'SET_START_DATE', payload: date })}
                    maxDate={state.endDate ?? undefined}
                />

                <DatePicker
                    label='End Date'
                    slotProps={{ textField: { variant: 'standard' } }}
                    format={DateFormat.Date}
                    value={state.endDate}
                    onChange={(date) => dispatch({ type: 'SET_END_DATE', payload: date })}
                    minDate={state.startDate ?? undefined}
                />
                {error && <Alert severity='error'>{error}</Alert>}
                <Button
                    className={styles.formButton}
                    variant='contained'
                    color='primary'
                    onClick={() => create()}
                    disabled={isLoading || !state.name || !state.startDate || !state.endDate}
                >
                    Update Trip
                </Button>
            </DialogContent>
        </Dialog >
    );
};
