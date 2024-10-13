import { Save } from '@mui/icons-material';
import { Fade, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import { Moment } from 'moment';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from 'src/components/atoms/Spinner';
import { useMutation } from 'src/components/hooks/useMutation';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { useQuery } from 'src/components/hooks/useQuery';
import { DateFormat } from 'src/config/dateFormats';
import { tripsService } from 'src/config/services';
import { usePointsStoreShallow } from 'src/context/pointsStore';
import { TripDay } from 'src/services/trips/TripDay';

import { EditTrip } from './EditTrip';
import { TripDays } from './TripDays';

import styles from './TripDetails.module.scss';


const renderDateField = (label: string, date: Moment) => (
    <div className={styles.fieldsField}>
        <Typography className={styles.fieldsLabel}>{label}:</Typography>
        <Typography>{date.format(DateFormat.Date)}</Typography>
    </div>
);


export function TripDetails() {
    const { tripId } = useParams();

    const [trip, onDaysChange, onTripChange] = usePointsStoreShallow(s => [s.trip, s.setDays, s.setTrip]);

    const { data, error, isFetching } = useQuery(
        ['trip', tripId],
        () => tripsService.getTripAsync(tripId!),
        {
            onSuccess: (trip) => {
                onTripChange(trip);
            },
        },
    );

    const { mutate: updateDays, isLoading: isUpdating } = useMutation((days: TripDay[]) => tripsService.updateTripDaysAsync(tripId!, days));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateDaysDebounced = useCallback(debounce((days: TripDay[]) => updateDays(days), 3000), []);
    useOnDidUpdate(() => {
        if (trip?.days && trip.days !== data?.days) {
            updateDaysDebounced(trip.days);
        }
    }, [trip]);

    if (isFetching) return <Spinner />;
    if (error) return <Typography>{error}</Typography>;

    if (!trip) return null;

    return (
        <div className={styles.trip}>
            <div className={styles.tripHeader}>
                <div className={styles.tripHeaderTitle}>
                    <Typography variant='h4'>{trip.name}</Typography>
                    <EditTrip trip={trip} />
                    <Fade in={isUpdating} timeout={{ exit: 5000 }} >
                        <Save color='primary' />
                    </Fade>
                </div>
                <div className={styles.fields}>
                    {renderDateField('Start', trip.startDate)}
                    {renderDateField('End', trip.endDate)}
                </div>
            </div>
            <TripDays
                days={trip.days}
                onDaysChange={onDaysChange}
            />
        </div>
    );
};
