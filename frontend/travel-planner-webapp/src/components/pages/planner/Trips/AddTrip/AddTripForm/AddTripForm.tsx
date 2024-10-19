import { useReducer } from 'react';
import { TextField, Button, Dialog, DialogContent, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { useMutation } from 'src/components/hooks/useMutation';
import { tripsService } from 'src/config/services';
import { TripInfo } from 'src/services/trips/TripInfo';
import { DateFormat } from 'src/config/dateFormats';
import { IntroStep, useIntroJourney } from 'src/components/moleculas/IntroJourney';
import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import { links } from 'src/links';

import { tripInitialState, tripReducer } from './reducer';

import styles from './AddTripForm.module.scss';


export interface AddTripFormProps {
    onClose: () => void;
}

export function AddTripForm({ onClose }: AddTripFormProps) {
    const [state, dispatch] = useReducer(tripReducer, tripInitialState);

    const { introInProgress, continueIntroInProgress, nextStep } = useIntroJourney();
    useOnDidMount(continueIntroInProgress);

    const navigate = useNavigate();

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

            nextStep();
            navigate(links.tripDetails(data.id));
        },
    });

    return (
        <Dialog open onClose={!introInProgress ? onClose : undefined}>
            <DialogContent data-intro-step={IntroStep.SaveTrip} className={styles.form}>
                <TextField
                    label='Trip Name'
                    variant='standard'
                    fullWidth
                    value={state.tripName}
                    onChange={(e) => dispatch({ type: 'SET_TRIP_NAME', payload: e.target.value })}
                />

                <DatePicker
                    label='Start Date'
                    slotProps={{ textField: { variant: 'standard' }, dialog: { className: styles.formDateDialog } }}
                    format={DateFormat.Date}
                    value={state.startDate}
                    onChange={(date) => dispatch({ type: 'SET_START_DATE', payload: date })}
                    maxDate={state.endDate ?? undefined}
                />

                <DatePicker
                    label='End Date'
                    slotProps={{ textField: { variant: 'standard' }, dialog: { className: styles.formDateDialog } }}
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
                    disabled={isLoading || !state.tripName || !state.startDate || !state.endDate}
                >
                    Create Trip
                </Button>
            </DialogContent>
        </Dialog >
    );
};
