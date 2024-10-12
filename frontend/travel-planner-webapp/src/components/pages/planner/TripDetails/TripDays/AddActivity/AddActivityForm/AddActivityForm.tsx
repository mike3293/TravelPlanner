import { useReducer } from 'react';
import { TextField, Button, Dialog, DialogContent, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { tripInitialState, tripReducer } from './reducer';
import styles from './AddActivityForm.module.scss';
import { useMutation } from 'src/components/hooks/useMutation';
import { tripsService } from 'src/config/services';
import { useQueryClient } from 'react-query';
import { TripInfo } from 'src/services/trips/TripInfo';
import { DateFormat } from 'src/config/dateFormats';


export interface AddActivityFormProps {
    onClose: () => void;
}

export function AddActivityForm({ onClose }: AddActivityFormProps) {
    const queryClient = useQueryClient();
    const { mutate: create, isLoading, error } = useMutation(() => tripsService.createTripAsync({
        name: state.tripName,
        startDate: state.startDate!,
        endDate: state.endDate!,
    }), {
        onSuccess: (data) => {
            const queryData: TripInfo[] = queryClient.getQueryData('getTrips')!;

            queryClient.setQueryData('getTrips', [
                ...queryData,
                data
            ]);

            onClose();
        },
    });

    const [state, dispatch] = useReducer(tripReducer, tripInitialState);

    return (
        <Dialog open onClose={onClose}>
            <DialogContent className={styles.form}>
                <TextField
                    label='Trip Name'
                    variant='standard'
                    fullWidth
                    value={state.tripName}
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
                    onClick={create}
                    disabled={isLoading || !state.tripName || !state.startDate || !state.endDate}
                >
                    Create Trip
                </Button>
            </DialogContent>
        </Dialog >
    );
};
