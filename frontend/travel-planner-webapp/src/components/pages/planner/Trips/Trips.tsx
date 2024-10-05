import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { tripsService } from 'src/config/services';
import { useQuery } from 'src/components/hooks/useQuery';
import { AddTrip } from './AddTrip';

import styles from './Trips.module.scss';
import { Spinner } from 'src/components/atoms/Spinner';

export function Trips() {
    const { data: trips = [], isLoading, error } = useQuery(
        'getTrips',
        () => tripsService.getTripsAsync(),
    );

    if (isLoading) return <Spinner />;
    if (error) return <Typography>{error}</Typography>;

    return (
        <div className={styles.trips}>
            <Typography variant='h4'>Your trips</Typography>
            <div className={styles.tripList}>
                {trips.map(trip => (
                    <Link className={styles.link} key={trip.id} to={`/trips/${trip.id}`}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography variant='h5'>{trip.name}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                <AddTrip />
            </div>
        </div>
    );
};
