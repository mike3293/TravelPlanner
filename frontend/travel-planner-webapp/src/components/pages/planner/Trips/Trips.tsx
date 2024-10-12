import { Typography } from '@mui/material';
import orderBy from 'lodash/orderBy';

import { tripsService } from 'src/config/services';
import { useQuery } from 'src/components/hooks/useQuery';
import { Spinner } from 'src/components/atoms/Spinner';

import { AddTrip } from './AddTrip';
import { TripItem } from './TripItem';

import styles from './Trips.module.scss';


export function Trips() {
    const { data: trips = [], isLoading, error } = useQuery(
        'getTrips',
        () => tripsService.getTripsAsync(),
        {
            select: data => orderBy(data, t => t.startDate),
        }
    );

    if (isLoading) return <Spinner />;
    if (error) return <Typography>{error}</Typography>;

    return (
        <div className={styles.trips}>
            <Typography variant='h4' className={styles.tripsHeader}>Your trips</Typography>
            <div className={styles.tripList}>
                {trips.map(trip => (
                    <TripItem
                        key={trip.id}
                        trip={trip}
                    />
                ))}
                <AddTrip />
            </div>
        </div>
    );
};
