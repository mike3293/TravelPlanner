import { Save } from '@mui/icons-material';
import { Fade, Typography } from '@mui/material';
import throttle from 'lodash/throttle';
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
import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { EditTrip } from './EditTrip';
import { TripDays } from './TripDays';
import { TripAccommodations } from './TripAccommodations';

import styles from './TripDetails.module.scss';


const renderDateField = (label: string, date: Moment) => (
    <div className={styles.fieldsField}>
        <Typography className={styles.fieldsLabel}>{label}:</Typography>
        <Typography>{date.format(DateFormat.Date)}</Typography>
    </div>
);


export function TripDetails() {
    const { tripId } = useParams();

    const [trip, onDaysChange, onAccommodationsChange, onTripChange] = usePointsStoreShallow(s => [s.trip, s.setDays, s.setAccommodations, s.setTrip]);

    const { data, error, isFetching } = useQuery(
        ['trip', tripId],
        () => tripsService.getTripAsync(tripId!),
        {
            onSuccess: (trip) => {
                onTripChange(trip);
            },
        },
    );

    const { mutate: updateDays, isLoading: isDaysUpdating } = useMutation((days: TripDay[]) => tripsService.updateTripDaysAsync(tripId!, days));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateDaysDebounced = useCallback(throttle((days: TripDay[]) => updateDays(days), 3000), []);

    const { mutate: updateAccommodations, isLoading: isAccommodationsUpdating } = useMutation((accommodations: TripDayActivity[]) => tripsService.updateTripAccommodationsAsync(tripId!, accommodations));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateAccommodationsDebounced = useCallback(throttle((accommodations: TripDayActivity[]) => updateAccommodations(accommodations), 3000), []);

    useOnDidUpdate(() => {
        if (!trip) return;

        if (trip.days !== data?.days) {
            updateDaysDebounced(trip.days);
        }

        if (trip.accommodations !== data?.accommodations) {
            updateAccommodationsDebounced(trip.accommodations);
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
                    <Fade
                        className={styles.tripHeaderTitleIcon}
                        in={isAccommodationsUpdating || isDaysUpdating}
                        timeout={{ exit: 5000 }}
                    >
                        <Save color='primary' />
                    </Fade>
                </div>
                <div className={styles.fields}>
                    {renderDateField('Start', trip.startDate)}
                    {renderDateField('End', trip.endDate)}
                    <EditTrip trip={trip} />
                </div>
            </div>
            <TripDays
                days={trip.days}
                onDaysChange={onDaysChange}
            >
                <TripAccommodations
                    accommodations={trip.accommodations}
                    onChange={onAccommodationsChange}
                />
            </TripDays>
        </div>
    );
};
